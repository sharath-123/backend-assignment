import express from 'express';
import g2 from '../services/g2.js';
import capterra from '../services/capterra.js';
import trustradius from '../services/trustradius.js';
import mockScraper from '../services/mockScraper.js'; // Add this import

const router = express.Router();

// POST /api/reviews
// body: { company, companyUrl?, startDate, endDate, source }
router.post('/', async (req, res) => {
    const { company, companyUrl, startDate, endDate, source } = req.body;

    if (!source || !['g2', 'capterra', 'trustradius'].includes(source)) {
        return res.status(400).json({ error: 'source must be one of g2 | capterra | trustradius' });
    }

    if (!company && !companyUrl) {
        return res.status(400).json({ error: 'Provide company (name) or companyUrl' });
    }

    try {
        let reviews = [];
        
        // Use mock data for demonstration
        reviews = await mockScraper({ company, companyUrl, startDate, endDate, source });
        
        // Uncomment below for real scraping (but it will likely be blocked)
        /*
        if (source === 'g2') {
            reviews = await g2({ company, companyUrl, startDate, endDate });
        } else if (source === 'capterra') {
            reviews = await capterra({ company, companyUrl, startDate, endDate });
        } else if (source === 'trustradius') {
            reviews = await trustradius({ company, companyUrl, startDate, endDate });
        }
        */
        
        return res.json({ count: reviews.length, reviews });
    } catch (err) {
        console.error('Error in /api/reviews', err);
        // Fallback to mock data on error
        const reviews = await mockScraper({ company, companyUrl, startDate, endDate, source });
        return res.json({ count: reviews.length, reviews });
    }
});

export default router;