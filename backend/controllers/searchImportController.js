const axios = require('axios');

const searchAmazonProducts = async (req, res) => {
  try {
    const { q } = req.query;

    const response = await axios.get(
      'https://api.rainforestapi.com/request',
      {
        params: {
          api_key: process.env.RAINFOREST_API_KEY,
          type: 'search',
          amazon_domain: 'amazon.in',
          search_term: q,
        },
      }
    );

    res.json({
      success: true,
      data: response.data.search_results || [],
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  searchAmazonProducts,
};