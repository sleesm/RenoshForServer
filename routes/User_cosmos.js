//connect cosmos DB
const client = require('./config');

const database = client.database('renosh');
const container = database.container('user');
const binderContainer = database.container('bookbinder');


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
        register_type: req.body.register_type,
        my_book_list: req.body.my_book_list
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

async function getMyBookListOfUsersById(req,res){
    const querySpec = {
        query:
        "SELECT c.my_book_list FROM c WHERE c.id = @user_id", 
        parameters: [
            {
                name:'@user_id',
                value: req.params.user_id
            }
        ]
    };
    try{
        const {resources: mybooklist} = await container.items.query(querySpec).fetchAll();

        res.status(200).json(mybooklist);
        console.log(`${mybooklist}`);
    }catch(error){
        res.status(500).send(error);
    }
}

async function updateUserById(req, res){
    const userid = req.params.user_id;
    try{
        const {resource: user} = await container.item(id, undefined).read();
        console.log(user)
        const userinfo = {
            id: user.id, // UPDATE는 id 필요
            user_id: user.user_id,
            password: req.body.password,
            name: req.body.name,
            register_type: req.body.register_type,
            my_book_list : req.body.my_book_list
        };
        console.log(userinfo)
        const { resource } = await container.item(userid,undefined).replace(bookinfo);
        // const {resources: item} = await container.item(id, undefined).replace(userinfo);
        res.status(200).json(`User ${user_id} updated successfully`);
        console.log(`User ${user_id} updated successfully`);
    } catch(error){
        res.status(500).send(error);
    }
}

async function updateMyBookListById(req, res){
    const id = req.params.user_id;
    try{
        const {resource: user} = await container.item(id, undefined).read();
        const userinfo = {
            id: user.id, // UPDATE는 id 필요
            user_id: user.user_id,
            password: user.password,
            name: user.name,
            register_type: user.register_type,
            my_book_list : req.body.my_book_list // update 할 부분
        };
        const {resource: item} = await container.item(id, undefined).replace(userinfo);
        console.log(`User ${user_id} my book list updated successfully`);
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

//get highlights by user for mypage
async function getHglByUser(req,res){
    const querySpec = {
        query:
        "SELECT * FROM c WHERE c.userid = @user_id AND c.type = @type ORDER BY c._ts DESC", 
        parameters: [
            {
                name:'@user_id',
                value: req.params.user_id
                
            },
            {
                name:'@type',
                value: "highlight"
            }
        ]
    };

    try{
        const { resources: highlights } = await binderContainer.items.query(querySpec).fetchAll();
        res.status(200).json(highlights);
    } catch(error){
        res.status(500).send(error);
    }
}

module.exports = {
    getListOfUsers,
    getMyBookListOfUsersById,
    postUserInfo,
    getUserById,
    updateUserById,
    updateMyBookListById,
    deleteUserById,
    getHglByUser
}