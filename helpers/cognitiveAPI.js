require('dotenv').config();
const endpoint = process.env.TEXT_ANALYTICS_ENDPOINT; // Add your endpoint
const key = process.env.TEXT_ANALYTICS_KEY;
const axios = require('axios');

async function getTextAnalyticsData(req, res){
    const memo = req.body.memo;
    let result = await axios({
        method: "post",
        url: endpoint,
        data: {
            "documents": [
                {
                  "language": "ko",
                  "id": "1",
                  "text": memo
                }
            ]
        },
        headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": key
        }
    }).then((respond) => {
        return respond.data.documents[0].sentiment;
    }).catch((error) => {
        console.log(error);
    });

    return result;
}

module.exports ={
    getTextAnalyticsData
}