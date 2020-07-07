
const express = require('express');
const router = express.Router();
const { CosmosClient, TriggerType } = require("@azure/cosmos");
const endpoint = "https://renosh.documents.azure.com:443/"; // Add your endpoint
const key = "key"; // Add the masterkey of the endpoint   key
const client = new CosmosClient({ endpoint, key });

const database = client.database('renosh');
const container = database.container('book' );

async function getListOfBooks(req, res){
    const { resources: bookList } = await container.items.readAll().fetchAll();
    console.log(bookList)
    // res.json(bookList); // error 발생 Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
}

router.get("/", (req, res)=>{
    res.send("list of books");
    getListOfBooks(req, res);
})

async function getBookWithId(req, res){
    const bookid = req.params.bookid;
    const { resource: book } = await container.item(bookid, undefined).read();
    console.log(book);
    // res.json(book); // 동일 error 발생
}

router.get("/:bookid", (req, res)=>{
    res.send(`a book. id: ${req.params.bookid}`);
    getBookWithId(req, res);
})

async function postBookInfo(req, res){
    const bookinfo = [
        {
            // id : "1",
            bookName: "The Little Prince",
            author: "Antoine de Saint-Exupéry",
            image: "https://images-na.ssl-images-amazon.com/images/I/41MkVPBdOOL._SX317_BO1,204,203,200_.jpg",
            epubURL: "https://pdfstop.com/get-download?file=838"
        },
        {
            // id : "2",
            bookName: "The Little Prince2",
            author: "Antoine de Saint-Exupéry",
            image: "https://images-na.ssl-images-amazon.com/images/I/41MkVPBdOOL._SX317_BO1,204,203,200_.jpg",
            epubURL: "https://pdfstop.com/get-download?file=838"
        }
    ];

    for(const book of bookinfo){
        const { resource } = await container.items.create(book);
        console.log(resource.id);
    }

    // res.json(resource.id); // 동일 error 발생
    res.send("Book Info added successfully.")
}

router.post("/", (req, res)=>{
    postBookInfo(req, res);
})

// async function putBookInfo(req, res){

//     const bookinfo =
//     {
//         // id : "1",
//         bookName: "The Little Prince",
//         author: "Antoine de Saint-Exupéry",
//         image: "https://images-na.ssl-images-amazon.com/images/I/41MkVPBdOOL._SX317_BO1,204,203,200_.jpg",
//         epubURL: "https://pdfstop.com/get-download?file=838"
//     }
//     const { resource } = await container.items.create(book);
//     console.log(resource.id);
// }

// router.put("/", (req, res)=>{
//     res.send("Book info updated successfully.");
// })

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

router.delete("/:bookid",(req, res)=>{
    deleteBook(req, res);
});

module.exports = router;