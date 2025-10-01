import axios from 'axios';
import { load } from 'cheerio';
import ddgSearch from '../utils/search.js';
import { parseDateLoose, inRange } from '../utils/dateFilter.js';


const HEADERS = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' };
const REQUEST_DELAY = 900; // ms


export default async function scrapeG2({ company, companyUrl, startDate, endDate }) {
    let base = companyUrl;
    if (!base) {
        const q = `${company} site:g2.com`;
        base = await ddgSearch(q);
        if (!base) throw new Error('Could not find G2 page via search');
    }

    if (!base.includes('g2.com')) throw new Error('Provided URL not a g2 URL');
    if (!base.includes('/reviews')) { // ensure reviews path
        base = base.replace(/\/?$/, '') + '/reviews';
    }
    const reviews = [];
    let page = 1;
    let consecutiveEmpty = 0;
    while (true) {
        const pageUrl = page === 1 ? base : (base.includes('?') ? `${base}&page=$ {page}` : `${base}?page=${page}`);
        const resp = await axios.get(pageUrl, { headers: HEADERS, timeout: 20000 });
        const $ = load(resp.data);
        // G2 markup changes — try multiple selectors
        const blocks = $("div[data-testid='review']").toArray().length ? $ ("div[data-testid='review']").toArray() : $('.paper, .review, .reviewcard').toArray();
        if (!blocks || blocks.length === 0) break;
        let foundThisPage = 0;
        for (const b of blocks) {
            try {
                const el = $(b);
                const title = el.find('h3').first().text().trim() || el.find('.review-title').text().trim();
                const reviewText = el.find("[data-testid='reviewbody']").text().trim() || el.find('.review-body').text().trim() || el.find('p').text().trim();
                const timeEl = el.find('time').first();
                const dateRaw = timeEl.attr('datetime') || timeEl.text().trim() || el.find('.date').text().trim();
                const date = parseDateLoose(dateRaw);
                const ratingEl = el.find('[aria-label*="out of"], .rating').first();
                let rating = null;
                if (ratingEl && ratingEl.attr('aria-label')) {
                    const m = ratingEl.attr('aria-label').match(/(\d+(?:\.\d+)?)/);
                    if (m) rating = parseFloat(m[1]);
                } else if (ratingEl) {
                    const m = ratingEl.text().match(/(\d+(?:\.\d+)?)/);
                    if (m) rating = parseFloat(m[1]);
                }

                const reviewer = el.find('.user-display-name, .author, .reviewername').first().text().trim() || null;
                if (inRange(date, startDate, endDate)) {
                    reviews.push({ title: title || null, review: reviewText || null, date: date ? date.toISOString() : null, rating, reviewer, source: 'g2', url: pageUrl });
                    foundThisPage++;
                }
            } catch (e) {
                // ignore block parse error
                console.warn('g2 block parse error', e.message);
            } 
        }
    if (foundThisPage === 0) consecutiveEmpty++; else consecutiveEmpty = 0;
        // stop if we've seen many consecutive pages with 0 matches (assume dates older than range)
    if (consecutiveEmpty >= 2) break; 
    page++;
    await new Promise(r => setTimeout(r, REQUEST_DELAY));
    } 
    return reviews;
}
