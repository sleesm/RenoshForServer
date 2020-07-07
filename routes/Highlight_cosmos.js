

//connect cosmos DB
const {CosmosClient} = require("@azure/cosmos");

// const endpoint = "https://renosh.documents.azure.com:/"; // Add your endpoint
// const key = "masterkey"; // Add the masterkey of the endpoint

const endpoint = process.env.COSMOSDB_ENDPOINT; // Add your endpoint
const key = process.env.COSMOSDB_KEY; // Add the masterkey of the endpoint

const client = new CosmosClient({ endpoint, key });
const database = client.database('renosh');
const container = database.container('highlight');

//get all highlights
async function getallhighlights(req, res) {

    

    try{
        const { resources: highlights } = await container.items.readAll().fetchAll();
        highlights.forEach(item => {
            console.log(`${item.id} - ${item.memo}`);
        });
        res.status(200).json(highlights);
    } catch(error){
        res.status(500).send(error);
    }
}

//get highlights of the book
async function getHglByBook(req, res) {
    console.log('endpoint: ',endpoint);
    
    const querySpec = {
        query:
        "SELECT * FROM c WHERE c.book_id = @book_id",
        parameters: [
            {
                name:'@book_id',
                value: req.params.book_id
                
            }
        ]
    };
    //console.log(querySpec);

    try{
        const { resources: highlights } = await container.items.query(querySpec).fetchAll();
        res.status(200).json(highlights);
    } catch(error){
        res.status(500).send(error);
    }
}

//get a highlight by id
async function getHglById(req, res){
    try{
        const item = container.item(req.params.highlight_id,undefined);
        const {resource: highlight} = await item.read();
        //console.log(item);
        res.status(200).json(highlight);
    } catch(error){
        res.status(500).send(error);
    }
}


//post a highlight on the book
async function postHgl(req, res){
    //console.log(req.body);
    const highlight = {
        book_id: req.params.book_id,
        user_id: req.body.user_id,
        location: req.body.location,
        memo: req.body.memo
    };
    try{
        const {item} = await container.items.create(highlight);
        console.log('Highlight created successfully');
        //console.log(item.id);
        res.status(200).json({"highlight_id" : item.id});
    } catch(error){
        res.status(500).send(error);
    }
}

async function deleteHgl(req, res){
    const high_id = req.params.highlight_id;
    try{
        const {resource: item} = await container.item(high_id, undefined).delete();
        //console.log(item);
        res.status(200).json({"highlight_id":high_id});
        console.log("Highlight deleted successfully");
    } catch(error){
        res.status(500).send(error);
    }
}

module.exports = {
    getHglByBook,
    getallhighlights,
    getHglById,
    postHgl,
    deleteHgl
}