//connect cosmos DB
const client = require('./config');

const database = client.database('renosh');
const container = database.container('like');
const bookcontainer = database.container('bookbinder');

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

// async function postUserLike(req,res){
//     const like = {
//         userid: req.params.userid,
//         highlight_like: {}
//     }
//     try{
//         const {resource:item} = await container.items.create(like);
//         res.status(200).json(item);
//         //console.log("User Like created");
//     }
//     catch(error){
//         res.status(500).send(error);
//     }
// }

async function putUserLike(req,res){
    id=req.body.likeid;
    const userid=req.params.userid;
    const bookid = req.body.bookid;
    const highlightid=req.body.highlightid;
    const like = {
        userid: req.params.userid,
        highlight_like: []
    }
    var error_flag=0;
    try{
        //if no like item, create one
        if(!id){ 
             const {resource:item} = await container.items.create(like);
             id = item.id;
        }
        const {resource:item} = await container.item(id,userid).read();
        let i;
        //push highlight id in the highlight like list
        for(i=0;i<item.highlight_like.length;i++){
            if(item.highlight_like[i].bookid==bookid){
                if(!item.highlight_like[i].like.includes(highlightid)){ 
                    item.highlight_like[i].like.push(highlightid);
                }
                else{
                    error_flag=1; //exception handling: if duplicate liked
                }
                break;
            }
        }
        //if first highlight on the book, create book
        if(i==item.highlight_like.length){ 
            var newbook={bookid:bookid,like:[highlightid,]};
            item.highlight_like.push(newbook);
        }

        //edit like item
        const {resource: nitem} = await container.item(id, userid).replace(item);


        //increase like count of corresponding highlight item
        if (!error_flag) {
            const bitem = bookcontainer.item(highlightid, bookid);
            const { resource: highlight } = await bitem.read();

            highlight.like += 1;
            const { resouce: nbitem } = await bookcontainer.item(highlightid, bookid).replace(highlight);
        }
        res.status(200).json(nitem); //return like item

        
    } catch(error){
        res.status(500).send(error);
    }
}
async function deleteUserLike(req,res){
    const id=req.body.likeid;
    const userid=req.params.userid;
    const bookid = req.body.bookid;
    const highlightid=req.body.highlightid;

    var error_flag=0;

    try{
        //get like item
        const {resource:item} = await container.item(id,userid).read();
        let i;

        //remove highlight from the highlight like list
        for(i=0;i<item.highlight_like.length;i++){
            if(item.highlight_like[i].bookid==bookid){
                if(item.highlight_like[i].like.includes(highlightid)){ //check if liked before
                    for(let j=0;j<item.highlight_like[i].like.length;j++){
                        if(item.highlight_like[i].like[j]==highlightid){ //remove item
                            item.highlight_like[i].like.splice(j,j+1); 
                        }
                    }
                }
                else{
                    error_flag =1; //exception handling: if not liked before
                }
                break;
            }
        }

        //edit like item
        const {resource: nitem} = await container.item(id, userid).replace(item);


        //increase like count of corresponding highlight item
        if (!error_flag) {
            const bitem = bookcontainer.item(highlightid, bookid);
            const { resource: highlight } = await bitem.read();

            highlight.like -= 1;
            const { resouce: nbitem } = await bookcontainer.item(highlightid, bookid).replace(highlight);

        }
        //return like item
        res.status(200).json(nitem); 
        
    } catch(error){
        res.status(500).send(error);
    }
}
module.exports = {
    getUserLike, 
    putUserLike, 
    deleteUserLike
}
