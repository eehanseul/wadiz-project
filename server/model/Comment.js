const mongoose = require('mongoose');

// comment 스키마
const commentSchema = new mongoose.Schema({
    body: {type:String, required: true},
    Campaign:{
        type: Number,
        ref: "Campaign",
        require: true,
    },
    commentType: {type:String, default: null},
    userNickname: {type:String, require: true},
    whenCreated: {type:Date, default: Date.now},
    commentReplys: [{ // 자식의 id 저장
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }],
    depth:{type:Number, default: 0, require:true}, // 현재 댓글이 어떤 depth에 있는지
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;