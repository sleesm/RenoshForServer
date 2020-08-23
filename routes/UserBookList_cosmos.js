//connect cosmos DB
const client = require('./config');
const { CosmosClient } = require('@azure/cosmos');

const database = client.database('renosh');
const container = database.container('userbooklist');

async function getMyBookListOfUsersById(req,res){
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

//TODO: USER ID만 가지고 mybooklist를 put하는 방법
async function updateMyBookListById(req, res){
    const userid = req.params.userid;
    const querySpec = {
        query:
        "SELECT c.id FROM c WHERE c.userid = @userid", 
        parameters: [
            {
                name:'@userid',
                value: req.params.userid
            }
        ]
    };
    try{
        const {resources: id} = await container.items.query(querySpec).fetchAll();
        // console.log(id[0]);
        // const {resource: user} = await container.item(id[0], undefined).read();
        // console.log(user);
        // const userinfo = {
        //     id: user.id,
        //     userid: user.userid,
        //     username: user.username,
        //     mybooklist: req.body.mybooklist, // update 할 부분
        //     wishlist: user.wishlist
        // };
        // const {resource: item} = await container.item(id, undefined).replace(userinfo);
        // res.status(200).json(`User ${userid} my book list updated successfully`);
        // console.log(`User ${userid} my book list updated successfully`);
    } catch(error){
        res.status(500).send(error);
    }
}

module.exports = {
    getMyBookListOfUsersById,
    updateMyBookListById
}