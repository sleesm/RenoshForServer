require('dotenv').config();
const {CosmosClient} = require("@azure/cosmos");
const endpoint = process.env.COSMOSDB_ENDPOINT; // Add your endpoint
const key = process.env.COSMOSDB_KEY; // Add the masterkey of the endpoint
const client = new CosmosClient({ endpoint, key });

module.exports = client;