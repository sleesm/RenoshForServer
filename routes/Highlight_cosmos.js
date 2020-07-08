//connect cosmos DB
const client = require('./config');

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
        res.status(200).json(highlight);
    } catch(error){
        res.status(500).send(error);
    }
}


//post a highlight on the book
async function postHgl(req, res){
    const highlight = {
        book_id: req.params.book_id,
        user_id: req.body.user_id,
        location: req.body.location,
        memo: req.body.memo
    };
    try{
        const {item} = await container.items.create(highlight);
        res.status(200).json({"highlight_id" : item.id});
        console.log(`Highlight of book ${req.params.book_id} created successfully`);
    } catch(error){
        res.status(500).send(error);
    }
}

async function deleteHgl(req, res){
    const high_id = req.params.highlight_id;
    try{
        const {resource: item} = await container.item(high_id, undefined).delete();
        res.status(200).json({"highlight_id":high_id});
        console.log(`Highlight ${high_id} deleted successfully`);
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