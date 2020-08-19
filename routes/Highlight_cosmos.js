//connect cosmos DB
const client = require('./config');

const database = client.database('renosh');
const container = database.container('bookbinder');


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

//get highlights and annotations of the book
async function getHglByBook(req, res) {
    
    const querySpec = {
        query:
        "SELECT * FROM c WHERE c.bookid = @book_id AND c.type = @type",
        parameters: [
            {
                name:'@book_id',
                value: req.params.book_id
                
            },
            {
                name:'@type',
                value: "highlight"
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
        "SELECT * FROM c WHERE c.bookid = @book_id AND c.type = @type AND NOT IS_NULL(c.memo)",
        parameters: [
            {
                name:'@book_id',
                value: req.params.book_id
                
            },
            {
                name:'@type',
                value: "highlight"
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
        const item = container.item(req.params.highlight_id,req.params.book_id);
        const {resource: highlight} = await item.read();
        res.status(200).json(highlight);
    } catch(error){
        res.status(500).send(error);
    }
}


//post a highlight on the book
async function postHgl(req, res){
    const curdate = new Date().toISOString().replace('T',' ').substr(0,19);
    const highlight = {
        bookid: req.params.book_id,
        type: "highlight",
        userid: req.body.userid,
        username: req.body.username,
        location: req.body.location,
        text:req.body.text,
        memo: null,
        created_date:curdate
    };
    try{
        const {resource:item} = await container.items.create(highlight);
        res.status(200).json({"highlight_id" : item.id});
        console.log(`Highlight of book ${req.params.book_id} created successfully`);

    } catch(error){
        res.status(500).send(error);
    }
}

async function deleteHgl(req, res){
    const high_id = req.params.highlight_id;
    const book_id = req.params.book_id;  
    try{
        const {resource: item} = await container.item(high_id, book_id).delete();   
        res.status(200).json({"highlight_id":high_id});
        console.log(`Highlight ${high_id} deleted successfully`);
    } catch(error){
        res.status(500).send(error);
    }
}

async function editHglmemo(req,res){
    const high_id = req.params.highlight_id;
    const book_id = req.params.book_id;
    try{
        const {resource:curitem} = await container.item(high_id,book_id).read();
        const highlight = {
            bookid: curitem.bookid,
            type: curitem.type,
            userid: curitem.userid,
            username: curitem.username,
            location: curitem.location,
            text: curitem.text,  
            memo: req.body.memo,   //if null, highlight. else, annotation
            id: high_id,
            created_date: curitem.created_date
        };
        const { resource:updatedItem } = await container.item(high_id,book_id).replace(highlight);
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