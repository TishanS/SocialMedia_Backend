const mongoose = require('mongoose')
const postMessage = require('../model/postMessage')


exports.getposts = async(req,res,next) =>{

    const { page } = req.query;

    
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

        const total = await postMessage.countDocuments({});
        const posts = await postMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
       
       res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {
        res.status(404).json({message: error.message})
        console.log("Try again!!")
    }
}

exports.getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await postMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


// exports.getPostsBySearch = async (req, res) => {
//     console.log("Backend")
//     const { searchQuery, tags } = req.query;
    

//     try {

//         //Regular Expression with Case-sensitive "Ignore"
//         const title = new RegExp(searchQuery, "i");

//         const posts = await postMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});
       

//         res.json({ data: posts });
//     } catch (error) {    
//         res.status(404).json({ message: error.message });
//     }
// }
exports.getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query
    console.log("Actions",searchQuery)

    try {
        const title = new RegExp(searchQuery, "i");

        const posts = await postMessage.find({ $or: [ { title: title }, { tags: { $in: tags.split(',') } } ]});

        res.json({ data: posts });
    } catch (error) {    
        res.status(404).json({ message: error.message });
        console.log(searchQuery)
    }
}

exports.createposts = async (req,res,next) => {

    const post = req.body;

    const newPostMessage = new postMessage({...post, creator: req.userId, createdAt: new Date().toISOString()});
    

    try {
      
        let response = await newPostMessage.save();
        res.status(201).json(response)
        console.log("Database Connected")
    } catch (error) {
        res.status(409).json({message: error.message})
    }
}

// exports.createposts = async (req, res) => {
//     const { title, message, selectedFile, creator, tags } = req.body;

//     const newPostMessage = new postMessage({ title, message, selectedFile, creator, tags })

//     try {
//         await newPostMessage.save();

//         res.status(201).json(newPostMessage );
//     } catch (error) {
//         res.status(409).json({ message: error.message });
//     }
// }

exports.updateposts = async (req,res, next) => {
    const {id}  = req.params;
    const Data = req.body;

    try {
        if(!mongoose.Types.ObjectId.isValid(id))
            return res.send(404).send('No post with that id')

        const updatedPost  = await postMessage.findByIdAndUpdate(id, Data, {new: true});
        res.json(updatedPost)
        
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

exports.deletePost = async (req,res,next) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id))
            return res.send(404).send('No post with that id')
    
    const deletePost = await postMessage.findByIdAndRemove(id);
    res.json({message: 'Post deleted successfully.'})
}

exports.likePost = async (req,res) => {
    const {id} = req.params;

    
    // "req.userId" comes from MIDDLEWARE
    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
    }

    if(!mongoose.Types.ObjectId.isValid(id))
            return res.send(404).send('No post with that id')

    const post = await postMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId))

    if (index  === -1) {
        post.likes.push(req.userId)
    } else {
        // DISLIKE Post
        post.likes = post.likes.filter((id) => id !== String(req.userId) )
    }

    const updatedPost = await postMessage.findByIdAndUpdate(id, post,  {new: true});
    // const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { new: true });
    res.status(200).json(updatedPost);

}

exports.commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    const post = await postMessage.findById(id);

    post.comments.push(value);

    const updatedPost = await postMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
};

// export default router;

