//connect cosmos DB
const client = require('./config');

const database = client.database('renosh');
const container = database.container('user');


async function getListOfUsers(req, res){
    console.log(client);
    try{
        const { resources: UserList } = await container.items.readAll().fetchAll();
        res.status(200).json(UserList);
        UserList.forEach(item => {
            console.log(`${item.user_id} - ${item.name}`);
        });
    }catch(error){
        res.status(500).send(error);
    }
}


async function postUserInfo(req, res){
    const userinfo = {
        user_id: req.body.user_id,
        password: req.body.password,
        name: req.body.name,
        register_type: req.body.register_type
    };
    try{
        const { resource } = await container.items.create(userinfo);
        res.status(200).json({"user_id" : resource.user_id});
        console.log(`User ${user_id} created successfully`);
    }catch(error){
        res.status(500).send(error);
    }
}


async function getUserById(req, res){
    try{
        const user_id = req.params.user_id;
        const {resource: user} = await container.item(user_id, undefined).read();
        
        // const {resource: user} = await item.read();
        res.status(200).json(user);
        console.log(`${user}`);
    }catch(error){
        res.status(500).send(error);
    }
}


async function updateUserById(req, res){
    const id = req.params.user_id;
    try{
        const {resource: user} = await container.item(id, undefined).read();
        console.log(user)
        const userinfo = {
            id: user.id, // UPDATE는 id 필요
            user_id: user.user_id,
            password: req.body.password,
            name: req.body.name,
            register_type: req.body.register_type
        };
        console.log(userinfo)
        const {resource: item} = await container.item(id, undefined).replace(userinfo);
        res.status(200).json(item);
        console.log(`User ${user_id} updated successfully`);
    } catch(error){
        res.status(500).send(error);
    }
}


async function deleteUserById(req, res){
    const user_id = req.params.user_id;
    try{
        const {resource: item} = await container.item(user_id, undefined).delete();
        res.status(200).json(item);
        console.log(`User ${user_id} deleted successfully`);
    } catch(error){
        res.status(500).send(error);
    }
}


module.exports = {
    getListOfUsers,
    postUserInfo,
    getUserById,
    updateUserById,
    deleteUserById
}