const mongoose = require('mongoose');

// Campaign 스키마
const campaignSchema = new mongoose.Schema({
    CampaignId: { type:Number, required: true, unique: true },
    categoryName: {type:String, required: true},
    Title: {type:String, required: true},
    totalBackedAmount: {type:Number, default: 0},
    photoUrl: {type:String, },
    nickname:{type:String, },
    coreMessage:{type:String, },
    whenOpen:{type:Date, default: Date.now},
    achievementRate:{type:Number,},
},{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});
campaignSchema.virtual('comments',{
    ref: 'Comment',
    localField: 'campaignId',
    foreignField: 'Campaign',
})

const Campaign = mongoose.model("Campaign", campaignSchema);
module.exports = Campaign;