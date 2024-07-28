// config/config.js
require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5100,
    maschainNetwork: process.env.MASCHAIN_NETWORK,
    contractAddress: process.env.CONTRACT_ADDRESS,
    // Add other configuration settings here
};
