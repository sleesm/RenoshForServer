//connect cosmos DB
const client = require('./config');
const { CosmosClient } = require('@azure/cosmos');

const database = client.database('renosh');
const container = database.container('userbooklist');

async function getUserBookListByUserId(req, res){
    const querySpec = {
        query:
        "SELECT * FROM c WHERE c.userid = @userid", 
        parameters: [
            {
                name:'@userid',
                value: req.params.userid
            }
        ]
    };
    try{
        const {resources: userbooklist} = await container.items.query(querySpec).fetchAll();
        res.status(200).json(userbooklist);
    }catch(error){
        res.status(500).send(error);
    }
}


async function getMyBookListOfUsersByUserId(req, res){
    const querySpec = {
        query:
        "SELECT c.mybooklist FROM c WHERE c.userid = @userid", 
        parameters: [
            {
                name:'@userid',
                value: req.params.userid
            }
        ]
    };
    try{
        const {resources: mybooklist} = await container.items.query(querySpec).fetchAll();
        res.status(200).json(mybooklist);
    }catch(error){
        res.status(500).send(error);
    }
}

async function postMyBookListOfUsersById(req, res){
    const bookinfo = req.body;
    try{
        const { resource } = await container.items.create(bookinfo);
        res.json(resource.id);
    }catch(error){
        res.status(500).send(error);
    }
}

//TODO: USER ID만 가지고 mybooklist를 put하는 방법
async function updateMyBookListById(req, res){
    const id = req.params.userbooklistid;
    const userid = req.params.userid;
    let readbookid = req.body.bookid;
    try{
        const {resource: user} = await container.item(id, userid).read();
        var newbook = {bookid:readbookid, location:"2"};
        user.mybooklist.push(newbook);
        const {resource: item} = await container.item(id, userid).replace(user);
        res.status(200).json(`User ${userid} my book list updated successfully`);
        console.log(`User ${userid} my book list updated successfully`);
    } catch(error){
        res.status(500).send(error);
    }
}

async function updateMyBookLastRead(req, res){
    const id = req.params.userbooklistid;
    const userid=req.params.userid;
    const bookid = req.body.bookid;
    try{
        const {resource:user} = await container.item(id, userid).read();
        for(let i=0;i<user.mybooklist.length;i++){
            if(user.mybooklist[i].bookid==bookid){
                user.mybooklist[i].location = req.body.location;
            }
        }
        const {resource:item} = await container.item(id, userid).replace(user);
        res.status(200).json(item);
    } catch(error){
        res.status(500).send(error);
    }
}
module.exports = {
    getUserBookListByUserId,
    getMyBookListOfUsersByUserId,
    postMyBookListOfUsersById,
    updateMyBookListById,
    updateMyBookLastRead
}