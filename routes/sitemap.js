// routes/sitemap.js

const express = require('express');
const router = express.Router();
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

// Sitemap Route
router.get('/sitemap.xml', async (req, res) => {
  try {
    const links = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/about', changefreq: 'monthly', priority: 0.8 },
      { url: '/services', changefreq: 'weekly', priority: 0.9 },
      { url: '/contact', changefreq: 'monthly', priority: 0.7 },
      { url: '/testimonials', changefreq: 'weekly', priority: 0.8 },
      { url: '/gallery', changefreq: 'weekly', priority: 0.8 },
      { url: '/booking', changefreq: 'monthly', priority: 0.7 },
      { url: '/chat', changefreq: 'monthly', priority: 0.6 },
      // Add more static routes as needed
    ];

    const stream = new SitemapStream({ hostname: 'https://www.yourdomain.com' });
    const xmlString = await streamToPromise(Readable.from(links).pipe(stream)).then(data => data.toString());
    res.header('Content-Type', 'application/xml');
    res.send(xmlString);
  } catch (err) {
    console.error('Error generating sitemap:', err);
    res.status(500).end();
  }
});

module.exports = router;
