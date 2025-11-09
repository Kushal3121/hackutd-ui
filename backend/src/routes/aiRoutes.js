import express from 'express';

const router = express.Router();

// POST /api/compare-summary
// Local heuristic summary (no external AI)
function currencyStr(currency, amount) {
  try {
    return `${currency} ${Number(amount || 0).toLocaleString()}`;
  } catch {
    return `${currency} ${amount}`;
  }
}
function heuristicSummary(a, b) {
  const nameA = `${a?.name || ''} ${a?.trim || ''}`.trim();
  const nameB = `${b?.name || ''} ${b?.trim || ''}`.trim();
  const priceDiff = Math.abs(Number(a?.msrp || 0) - Number(b?.msrp || 0));
  const cheaper = Number(a?.msrp || 0) <= Number(b?.msrp || 0) ? nameA : nameB;
  const mpgA =
    Number(a?.efficiency?.city_mpg || 0) +
    Number(a?.efficiency?.hwy_mpg || 0);
  const mpgB =
    Number(b?.efficiency?.city_mpg || 0) +
    Number(b?.efficiency?.hwy_mpg || 0);
  const mpgBetter = mpgA === mpgB ? null : mpgA > mpgB ? nameA : nameB;
  const driveNote =
    a?.drivetrain && b?.drivetrain && a.drivetrain !== b.drivetrain
      ? `${nameA} is ${a.drivetrain}, while ${nameB} is ${b.drivetrain}. `
      : '';
  const powerNote =
    a?.powertrain && b?.powertrain && a.powertrain !== b.powertrain
      ? `${(nameA.split(' ')[0] || nameA) || 'Car A'} uses ${
          a.powertrain
        }; ${(nameB.split(' ')[0] || nameB) || 'Car B'} uses ${b.powertrain}. `
      : '';
  const audience =
    String(a?.series || '').includes('SUV') ||
    String(b?.series || '').includes('SUV')
      ? 'Families and adventure-focused buyers may prefer the SUV for space and versatility.'
      : 'Daily commuters may prefer the sedan for value and efficiency.';
  return `${nameA} vs ${nameB}: ${cheaper} is more budget‑friendly (≈ ${currencyStr(
    a?.currency || b?.currency || 'USD',
    priceDiff
  )} difference). ${mpgBetter ? `${mpgBetter} tends to be more efficient overall. ` : ''}${driveNote}${powerNote}${audience}`;
}

router.post('/compare-summary', async (req, res) => {
  try {
    const { carA, carB } = req.body || {};
    if (!carA || !carB)
      return res.status(400).json({ error: 'carA and carB required' });
    const summary = heuristicSummary(carA, carB);
    return res.json({ summary });
  } catch (err) {
    console.error('compare-summary error:', err?.message || err);
    return res.status(500).json({ error: 'Failed to generate summary' });
  }
});

export default router;

// General chat completion (optional)
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'message required' });
    const lower = String(message).toLowerCase();
    let text =
      'I can help with search, compare, and recommendations. Try "hybrid suv under 30k".';
    if (/\b(hi|hello|hey|yo|sup|good (morning|afternoon|evening))\b/.test(lower))
      text =
        'Hello! I can help you search models, compare two cars, or suggest options.';
    else if (/\b(thanks|thank you|ty|thx|appreciate)\b/.test(lower))
      text = 'You’re welcome! Anything else I can help you find?';
    else if (/\b(bye|goodbye|see (ya|you)|later|cya)\b/.test(lower))
      text = 'Goodbye! Come back anytime if you need more help.';
    else if (/(how are you|how's it going|how are u)/.test(lower))
      text = 'Doing well and ready to help with car searches!';
    else if (/(who are you|what are you)/.test(lower))
      text = 'I’m your assistant for car search, comparisons, and recommendations.';
    return res.json({ text });
  } catch (err) {
    console.error('chat error:', err?.message || err);
    return res.status(500).json({ error: 'Failed to generate chat' });
  }
});
