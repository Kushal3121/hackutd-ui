// Heuristic comparison summary (no AI).

function humanCurrency(currency, amount) {
  try {
    return `${currency} ${Number(amount || 0).toLocaleString()}`;
  } catch {
    return `${currency} ${amount}`;
  }
}

function heuristicSummary(a, b) {
  const nameA = `${a.name} ${a.trim}`.trim();
  const nameB = `${b.name} ${b.trim}`.trim();
  const priceDiff = Math.abs((a.msrp || 0) - (b.msrp || 0));
  const cheaper = a.msrp <= b.msrp ? nameA : nameB;
  const mpgA = (a?.efficiency?.city_mpg || 0) + (a?.efficiency?.hwy_mpg || 0);
  const mpgB = (b?.efficiency?.city_mpg || 0) + (b?.efficiency?.hwy_mpg || 0);
  const mpgBetter = mpgA === mpgB ? null : mpgA > mpgB ? nameA : nameB;
  const driveNote =
    a.drivetrain !== b.drivetrain
      ? `${nameA} is ${a.drivetrain}, while ${nameB} is ${b.drivetrain}. `
      : '';
  const powerNote =
    a.powertrain !== b.powertrain
      ? `${nameA.split(' ')[0]} uses ${a.powertrain}; ${
          nameB.split(' ')[0]
        } uses ${b.powertrain}. `
      : '';
  const audience =
    (a.series || '').includes('SUV') || (b.series || '').includes('SUV')
      ? 'Families and adventure-focused buyers may prefer the SUV for space and versatility.'
      : 'Daily commuters may prefer the sedan for value and efficiency.';
  return `${nameA} vs ${nameB}: ${cheaper} is more budget‑friendly (≈ ${humanCurrency(
    a.currency || b.currency || 'USD',
    priceDiff
  )} difference). ${
    mpgBetter ? `${mpgBetter} tends to be more efficient overall. ` : ''
  }${driveNote}${powerNote}${audience}`;
}

export async function compareSummary(req, res) {
  try {
    const { carA, carB } = req.body || {};
    if (!carA || !carB)
      return res.status(400).json({ error: 'carA and carB required' });
    return res.json({ summary: heuristicSummary(carA, carB) });
  } catch (err) {
    return res.status(500).json({ error: 'failed to summarize' });
  }
}
