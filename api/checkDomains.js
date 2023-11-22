// api/checkDomains.js

const dns = require('dns');

async function checkDomainAvailability(domain) {
  try {
    await dns.promises.lookup(domain);
    return false; // Domain exists, not available
  } catch (error) {
    return true; // Domain does not exist, available
  }
}

export default async function handler(req, res) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const extensions = ['ac', 'ad', 'ae', /* ... */];

  const results = [];

  for (const letter of alphabet) {
    for (const extension of extensions) {
      const domain = `${letter}.${extension}`;
      const isAvailable = await checkDomainAvailability(domain);
      results.push({ domain, isAvailable });
    }
  }

  // Check if the request has a "callback" query parameter (indicating JSONP)
  const callback = req.query.callback;

  if (callback) {
    // If JSONP, wrap the results in the callback function
    res.status(200).send(`${callback}(${JSON.stringify({ results })})`);
  } else {
    // If not JSONP, return the results as JSON
    res.status(200).json({ results });
  }
}
