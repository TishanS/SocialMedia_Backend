const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {type: String},
    message: {type: String},
    name: {type: String},
    creator: {type: String},
    tags: {type: [String]},
    selectedFile: {type: String},
    // likeCount: {
    //     type: Number,
    //     default: 0,
    // },
    likes: { type: [String], default: [] },
    comments: { type: [String], default: [] },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    // moviename: { type: String, required: true },
    // theatrename: { type: String, required: true, unique:true},
},
	{ collection: 'social_post' }
)

const postModel = mongoose.model('social_post', postSchema);

module.exports = postModel