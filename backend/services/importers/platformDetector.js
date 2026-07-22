function detectPlatform(url) {
  const lower = url.toLowerCase();

  if (lower.includes("amazon.")) return "amazon";
  if (lower.includes("flipkart.")) return "flipkart";
  if (lower.includes("myntra.")) return "myntra";
  if (lower.includes("ajio.")) return "ajio";
  if (lower.includes("apple.")) return "apple";
  if (lower.includes("nike.")) return "nike";
  if (lower.includes("samsung.")) return "samsung";
  if (lower.includes("croma.")) return "croma";
  if (lower.includes("reliancedigital.")) return "reliance";
  if (lower.includes("nykaa.")) return "nykaa";

  return "unknown";
}

module.exports = detectPlatform;