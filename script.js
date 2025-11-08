// server.js
// Node + Express server that serves an HTML page and a /geo JSON endpoint
// that returns geolocation info (city, region, country) for visitor IP
//
// Place GeoLite2-City.mmdb in the same folder as this file.

const path = require('path');
const express = require('express');
const maxmind = require('maxmind');

const DB_PATH = "https://github.com/john-doherty/offline-geo-from-ip/blob/master/database/geolite2-city.mmdb";//path.join(__dirname, 'GeoLite2-City.mmdb'); // <-- your file
const PORT = process.env.PORT || 3000;

async function start() {
  // open DB once (async)
  let lookup;
  try {
    lookup = await maxmind.open(DB_PATH);
    console.log('MMDB loaded from', DB_PATH);
  } catch (err) {
    console.error('Failed to open MMDB:', err.message || err);
    process.exit(1);
  }

  const app = express();

  // If you deploy behind a proxy (Heroku, nginx etc.), enable this so req.ip works:
  app.set('trust proxy', true);

  // Serve static files from /public
  app.use(express.static(path.join(__dirname, 'public')));

  // Utility: normalize IPv4-mapped IPv6 addresses like ::ffff:8.8.8.8
  function normalizeIP(ip) {
    if (!ip) return null;
    // remove IPv6 zone id if present
    const percentIndex = ip.indexOf('%');
    if (percentIndex !== -1) ip = ip.slice(0, percentIndex);

    // If IPv4-mapped IPv6 address, extract the IPv4 part
    if (ip.startsWith('::ffff:')) {
      return ip.split('::ffff:')[1];
    }
    // sometimes node returns ::1 for localhost; treat as 127.0.0.1
    if (ip === '::1') return '127.0.0.1';
    return ip;
  }

  // /geo endpoint returns JSON { ip, country, region, city, location }
  app.get('/geo', (req, res) => {
    // Determine client IP
    // req.ip respects trust proxy; falls back to socket remoteAddress
    const rawIp = req.ip || req.socket.remoteAddress || req.connection.remoteAddress;
    const ip = normalizeIP(rawIp);

    // For local testing, allow ?ip= query to override (useful)
    const queryIp = req.query.ip;
    const lookupIp = queryIp ? queryIp : ip;

    if (!lookupIp) {
      return res.status(400).json({ error: 'Could not determine IP' });
    }

    let info;
    try {
      info = lookup.get(lookupIp);
    } catch (err) {
      console.warn('Lookup failed for', lookupIp, err && err.message);
      info = null;
    }

    if (!info) {
      return res.json({
        ip: lookupIp,
        found: false,
        message: 'No data for this IP in DB'
      });
    }

    // Build friendly response
    const country = info.country?.names?.en || info.country?.iso_code || null;
    const city = info.city?.names?.en || null;
    const region = (info.subdivisions && info.subdivisions[0]?.names?.en) || info.subdivisions?.[0]?.iso_code || null;
    const location = info.location ? {
      latitude: info.location.latitude,
      longitude: info.location.longitude,
      time_zone: info.location.time_zone,
      accuracy_radius: info.location.accuracy_radius
    } : null;

    res.json({
      ip: lookupIp,
      found: true,
      country,
      region,
      city,
      location,
      raw: info // optional: full object returned by the MMDB (you can remove for privacy)
    });
  });

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Startup failed:', err);
  process.exit(1);
});
