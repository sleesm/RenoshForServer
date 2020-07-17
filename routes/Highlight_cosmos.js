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
        "SELECT * FROM c WHERE c.book_id = @book_id AND NOT IS_DEFINED(c.memo)",
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

//get annotations of the book
async function getAnnotByBook(req, res) {
    
    const querySpec = {
        query:
        "SELECT * FROM c WHERE c.book_id = @book_id AND IS_DEFINED(c.memo)",
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
        console.log(item);
        console.log(highlight);
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
        text:req.body.text,
        memo: req.body.memo
    };
    try{
        const {resource:item} = await container.items.create(highlight);
        console.log(item);
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

async function editHglmemo(req,res){
    const high_id = req.params.highlight_id;
    
    try{
        const {resource:curitem} = await container.item(high_id,undefined).read();
        const highlight = {
            book_id: curitem.book_id,
            user_id: curitem.user_id,
            location: curitem.location,
            memo: req.body.memo,
            id: high_id,
        };
        const { resource:updatedItem } = await container.item(high_id,undefined).replace(highlight);
        res.status(200).json(updatedItem);
        console.log(`Highlight ${high_id} updated successfully`);
    } catch(error){
        res.status(500).send(error);
    }
}
module.exports = {
    getHglByBook,
    getAnnotByBook,
    getallhighlights,
    getHglById,
    postHgl,
    deleteHgl,
    editHglmemo
}