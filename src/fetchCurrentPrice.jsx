// Simple in-memory cache for the session
const priceCache = {};
const token = "bThqd1hEWFJBanR2cFhucUlOMVllWEVieVBJdExVZUNCYm5vSl84NGxvTT0"

export async function fetchCurrentPrice(symbol) {
  const key = symbol.toUpperCase();

  // 1. Return cached price immediately if available
  if (priceCache[key] !== undefined) {
    return priceCache[key];
  }

  // 2. Timeout wrapper to avoid hanging requests
  const withTimeout = (promise, ms = 5000) =>
    Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), ms),
      ),
    ]);

  try {
    // 3. Call your API (Massive, AlphaVantage, etc.)
    const response = await withTimeout(
      fetch(`https://api.marketdata.app/v1/stocks/quotes/${key}/?token=${token}`),
    );

    if (!response.ok) {
      throw new Error("API error");
    }

    const data = await response.json();

    // 4. Extract price safely
    const price = Number(data?.last?.[0]); // Adjust based on actual API response structure

    // 5. Validate numeric output
    if (!price || Number.isNaN(price)) {
      throw new Error("Invalid price");
    }

    // 6. Cache it for future calls
    priceCache[key] = price;

    return price;
  } catch (err) {
    console.warn(`Price fetch failed for ${key}:`, err.message);

    // 7. Fallback: return last known cached price if available
    if (priceCache[key] !== undefined) {
      return priceCache[key];
    }

    // 8. Final fallback: return null so UI can handle gracefully
    return null;
  }
}
