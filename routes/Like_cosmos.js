//connect cosmos DB
const client = require('./config');

const database = client.database('renosh');
const container = database.container('like');

async function getUserLike(req,res){
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
        const { resources: userlike } = await container.items.query(querySpec).fetchAll();
        res.status(200).json(userlike[0]);
    } catch(error){
        res.status(500).send(error);
    }
}

async function postUserLike(req,res){
    const like = {
        userid: req.params.userid,
        highlight_like: {}
    }
    try{
        const {resource:item} = await container.items.create(like);
        res.status(200).json(item);
        //console.log("User Like created");
    }
    catch(error){
        res.status(500).send(error);
    }
}

async function putUserLike(req,res){
    id=req.body.likeid;
    const userid=req.params.userid;
    const bookid = req.body.bookid;
    const highlightid=req.body.highlightid;
    const like = {
        userid: req.params.userid,
        highlight_like: []
    }
    try{
        if(!id){ //if no like item, create one
             const {resource:item} = await container.items.create(like);
             //console.log(item);
             id = item.id;
        }
        const {resource:item} = await container.item(id,userid).read();
        let i;
        for(i=0;i<item.highlight_like.length;i++){
            if(item.highlight_like[i].bookid==bookid){
                if(!item.highlight_like[i].like.includes(highlightid)){ //avoid duplicate
                    item.highlight_like[i].like.push(highlightid);
                }
                break;
            }
        }
        if(i==item.highlight_like.length){ //first highlight like on the book
            var newbook={bookid:bookid,like:[highlightid,]};
            item.highlight_like.push(newbook);
        }
        const {resource: nitem} = await container.item(id, userid).replace(item);
        res.status(200).json(nitem);
    } catch(error){
        res.status(500).send(error);
    }
}
async function deleteUserLike(req,res){
    const id=req.body.likeid;
    const userid=req.params.userid;
    const bookid = req.body.bookid;
    const highlightid=req.body.highlightid;
    try{
        const {resource:item} = await container.item(id,userid).read();
        let i;
        //console.log(item);
        for(i=0;i<item.highlight_like.length;i++){
            if(item.highlight_like[i].bookid==bookid){
                //console.log(item.highlight_like[i].like);
                if(item.highlight_like[i].like.includes(highlightid)){ //check if liked before
                    for(let j=0;j<item.highlight_like[i].like.length;j++){
                        if(item.highlight_like[i].like[j]==highlightid){ //remove item
                            item.highlight_like[i].like.splice(j,j+1); 
                        }
                    }
                }
                break;
            }
        }
        const {resource: nitem} = await container.item(id, userid).replace(item);
        res.status(200).json(nitem);
    } catch(error){
        res.status(500).send(error);
    }
}
module.exports = {
    getUserLike, 
    postUserLike, 
    putUserLike, 
    deleteUserLike
}
