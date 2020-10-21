//connect cosmos DB
const client = require('./config');

const database = client.database('renosh');
const container = database.container('bookbinder' );

async function getListOfBooks(req, res){
    const querySpec = {
        query:
        "SELECT * FROM c WHERE c.type = 'book'"
    };
    try{
        const { resources: bookList } = await container.items.query(querySpec).fetchAll();
        res.json(bookList);
    }catch(error){
        res.status(500).send(error);
    }
}

async function getBookWithId(req, res){
    try{
        const bookid = req.params.bookid;
        const { resource: book } = await container.item(bookid, undefined).read();
        res.json(book);
    }catch(error){
        res.status(500).send(error);
    }
}

//SELECT c.id , c.emotion[0].positive FROM c WHERE c.type = 'book' ORDER BY c.emotion[0].positive DESC 
// SELECT * FROM c WHERE c.id IN (SELECT c.id FROM c WHERE c.type = 'book' ORDER BY c.emotion[0].positive DESC)
async function getBestEmotionBooks(req, res){
    const querySpec = {
        query:
        "SELECT * FROM c WHERE c.type = 'book'"
    };
    try{
        const { resources: bookList } = await container.items.query(querySpec).fetchAll();
        let bestPositive = bookList[0].emotion[0].positive;
        let bestNeutral = bookList[0].emotion[1].neutral;
        let bestNegative = bookList[0].emotion[2].negative;
        let bestPositiveBook = bookList[0];
        let bestNeutralBook = bookList[0];
        let bestNegativeBook = bookList[0];

        for(let i = 1; i< bookList.length; i++){
            if(bestPositive < bookList[i].emotion[0].positive){
                bestPositive = bookList[i].emotion[0].positive;
                bestPositiveBook = bookList[i];
            }
            else if(bestNeutral < bookList[i].emotion[1].neutral){
                bestNeutral = bookList[i].emotion[1].neutral;
                bestNeutralBook = bookList[i];                
            }
            else if(bestNegative < bookList[i].emotion[2].negative){
                bestNegative = bookList[i].emotion[2].negative;
                bestNegativeBook = bookList[i];
            }
        }
        
        let bestEmotionId = [
            {
                'bestPositiveBook' : bestPositiveBook,
                'bestPositive' : bestPositive            
            },
            {
                'bestNeutralBook' : bestNeutralBook,
                'bestNeutral' : bestNeutral
            },
            {
                'bestNegativeBook' : bestNegativeBook,
                'bestNegative' : bestNegative
            }
        ]
        
        res.json(bestEmotionId);
    }catch(error){
        res.status(500).send(error);
    }
}

async function postBookInfo(req, res){
    const bookinfo = req.body;
    try{
        const { resource } = await container.items.create(bookinfo);
        res.json(resource.id);
    }catch(error){
        res.status(500).send(error);
    }
}

async function putBookInfo(req, res){
    const bookid = req.params.bookid;
    const bookinfo = req.body;
    try{
        const { resource } = await container.item(bookid,undefined).replace(bookinfo);
        res.send("Book info updated Succesfully");
    }catch(error){
        res.status(500).send(error);
    }
}

async function putEmotionCount(req, res){
    const bookid = req.params.book_id;
    try{
        const {resource:curitem} = await container.item(bookid,undefined).read();
        if(req.body.emotion == "positive"){
            curitem.emotion[0].positive = (parseInt(curitem.emotion[0].positive) + 1)           
        }else if(req.body.emotion == "neutral"){
            curitem.emotion[1].neutral = (parseInt(curitem.emotion[1].neutral) + 1) 
        }else{
            curitem.emotion[2].negative = (parseInt(curitem.emotion[2].negative) + 1)
        }
        const { resource } = await container.item(bookid,undefined).replace(curitem);
    }catch(error){
        res.status(500).send(error);
    }
}

async function deleteBook(req, res){
    const bookid = req.params.bookid;
    try{
        const {resource: item} = await container.item(bookid, undefined).delete();
        res.status(200).json({"book id":bookid});
        console.log("Book deleted successfully");
    } catch(error){
        res.status(500).send(error);
    }
}

async function getBookListofMaxHighlights(req,res){
    const querySpec = {
        query:
        "SELECT * FROM c WHERE c.type = 'book' ORDER BY c.highlight_count DESC oFFSET 0 LIMIT 3 "
    };
    try{
        const { resources: bookList } = await container.items.query(querySpec).fetchAll();
        res.status(200).json(bookList);
    }catch(error){
        res.status(500).send(error);
    }
}
module.exports = {
    getListOfBooks,
    getBookWithId,
    getBestEmotionBooks,
    postBookInfo,
    putBookInfo,
    putEmotionCount,
    deleteBook,
    getBookListofMaxHighlights,
}