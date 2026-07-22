const detectPlatform = require("./platformDetector");

const amazonImporter = require("./amazonImporter");
const flipkartImporter = require("./flipkartImporter");
const myntraImporter = require("./myntraImporter");
const ajioImporter = require("./ajioImporter");

async function importProduct(url) {
  const platform = detectPlatform(url);

  switch (platform) {
    case "amazon":
      return amazonImporter(url);

    case "flipkart":
      return flipkartImporter(url);

    case "myntra":
      return myntraImporter(url);

    case "ajio":
      return ajioImporter(url);

    default:
      throw new Error("Unsupported marketplace.");
  }
}

module.exports = importProduct;