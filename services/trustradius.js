import axios from 'axios';
import { load } from 'cheerio';
import ddgSearch from '../utils/search.js';
import { parseDateLoose, inRange } from '../utils/dateFilter.js';


const HEADERS = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' };
const REQUEST_DELAY = 900;


export default async function scrapeTrustRadius({ company, companyUrl, startDate, endDate }) {
    let base = companyUrl;
    if (!base) {
        const q = `${company} site:trustradius.com`;
        base = await ddgSearch(q);
        if (!base) throw new Error('Could not find TrustRadius page via search');
    }
    if (!base.includes('trustradius.com')) throw new Error('Provided URL not a TrustRadius URL');
    if (!base.includes('/reviews')) base = base.replace(/\/?$/, '') + '/reviews';
    const reviews = [];
    let page = 1;
    while (true) {
        const pageUrl = page === 1 ? base : (base.includes('?') ? `${base}&page=${page}` : `${base}?page=${page}`);
        const resp = await axios.get(pageUrl, { headers: HEADERS, timeout: 20000 });
        const $ = load(resp.data);
        const blocks = $('.review-card, .tr-review, article').toArray();
        if (!blocks || blocks.length === 0) break;
        let foundThisPage = 0;
        for (const b of blocks) {
            const el = $(b);
            try {
                const title = el.find('.review-title, h3').first().text().trim() || null;
                const reviewText = el.find('.review-text, .review-body, p').first().text().trim() || null;
                const timeEl = el.find('time').first();
                const dateRaw = timeEl.attr('datetime') || timeEl.text().trim() || el.find('.date').text().trim();
                const date = parseDateLoose(dateRaw);
                let rating = null;
                const ratingEl = el.find('.rating, .stars').first();
                if (ratingEl) {
                    const m = ratingEl.text().match(/(\d+(?:\.\d+)?)/);
                    if (m) rating = parseFloat(m[1]);
                }
                const reviewer = el.find('.reviewer, .author, .user').first().text().trim() || null;
                if (inRange(date, startDate, endDate)) {
                    reviews.push({ title, review: reviewText, date: date ? date.toISOString() : null, rating, reviewer, source: 'trustradius', url: pageUrl });
                    foundThisPage++;
                }
            } catch (e) {
                console.warn('trustradius block parse error', e.message);
            }
        }
        if (foundThisPage === 0) break;
        page++; 
        await new Promise(r => setTimeout(r, REQUEST_DELAY));
    }
    return reviews;
}
