

//connect cosmos DB
const {CosmosClient} = require("@azure/cosmos");

const endpoint = "https://renosh.documents.azure.com/"; // Add your endpoint
const key = "masterkey"; // Add the masterkey of the endpoint
const client = new CosmosClient({ endpoint, key });
const database = client.database('renosh');
const container = database.container('highlight');

//get all highlights
async function getallhighlights(req, res) {
    const { resources: highlights } = await container.items.readAll().fetchAll();
    highlights.forEach(item => {
        console.log(`${item.id} - ${item.memo}`);
      });
    res.json(highlights);
}

//get highlights of the book
async function getHglByBook(req, res) {
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
    const { resources: highlights } = await container.items.query(querySpec).fetchAll();
    res.json(highlights);
}

//get a highlight by id
async function getHglById(req, res){
    const item = container.item(req.params.highlight_id,undefined);
    const {resource: highlight} = await item.read();
    //console.log(item);
    res.json(highlight);
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
    const {item} = await container.items.create(highlight);
    console.log('Highlight created successfully');
    //console.log(item.id);
    res.json({"highlight_id" : item.id});
}

module.exports = {
    getHglByBook,
    getallhighlights,
    getHglById,
    postHgl
}