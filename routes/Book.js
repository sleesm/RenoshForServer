const express = require('express');
const router = express.Router();
const { CosmosClient } = require("@azure/cosmos");
const endpoint = "https://renosh.documents.azure.com:443/"; // Add your endpoint
const key = "VGGuRGqhhxhHNuDbdpV0ypJo3DlGRtchkGH1ofFgaq3XFX4ynqcJlWbVVoRMk48Gn8jQjxHjfFKpcvbTarRd4A=="; // Add the masterkey of the endpoint
const client = new CosmosClient({ endpoint, key });

let count = 0;

router.get("/", (req, res)=>{
    res.send("list of books");
});

router.get("/:bookid", (req, res)=>{
    res.send(`a book. id: ${req.params.bookid}`);
});

async function postBookInfo(){
    const { database } = await client.databases.createIfNotExists({ id: 'renosh' });
    const { container } = await database.containers.createIfNotExists({ id: 'book' });

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
    }
}

router.post("/", (req, res)=>{
    postBookInfo();
    console.log("Book info updated successfully.");
    res.send("Book info updated successfully.");
});

router.put("/", (req, res)=>{
    res.send("Book info updated successfully.");
});



module.exports = router;