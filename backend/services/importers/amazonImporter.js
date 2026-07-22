const axios = require("axios");

async function amazonImporter(url) {
  const response = await axios.get(
    "https://api.rainforestapi.com/request",
    {
      params: {
        api_key: process.env.RAINFOREST_API_KEY,
        type: "product",
        url,
      },
    }
  );

  const product = response.data.product;

  if (!product) {
    throw new Error("Amazon product not found");
  }

  return {
    name: product.title,
    description: product.description || "",
    price: product.buybox_winner?.price?.value || 0,
    image: product.main_image?.link || "",
    rating: product.rating || 0,
    numReviews: product.ratings_total || 0,
  };
}

module.exports = amazonImporter;