import axios from 'axios';
import { load } from 'cheerio';
// Simple DuckDuckGo HTML search to try to find the product review page for the company

export default async function ddgSearch(query) {
    try {
        const q = encodeURIComponent(query + ' reviews');
        const url = `https://duckduckgo.com/html/?q=${q}`;
        const resp = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = load(resp.data);
        const a = $('a.result__a').first();
        if (a && a.attr('href')) return a.attr('href');
        // fallback: find first link to common domains
            const links = $('a'); 
            for (let i = 0; i < links.length; i++) {
                const href = $(links[i]).attr('href');
                if (href && (href.includes('g2.com') || href.includes('capterra.com') || href.includes('trustradius.com'))) {
                    return href;
                }
            }
        return null;
    } catch (e) {
        console.warn('ddg search failed', e.message);
        return null;
    }
}
