var express = require('express');
var router = express.Router();
const Campaign = require("../model/Campaign");
const Comment = require("../model/Comment");

//   /api/campaign GET]요청이 오면 Campaign 에 대한 리스트를 조회할 것
//   /api/:campaignId GET]요청이 오면 Campaign 한 개에 대한 데이터와 댓글 전부를 함께 조회할 것 
//   /api/:campaignId/comment POST]요청이 오면 해당 Campaign 에 대한 댓글을 임의로 달 수 
//     있도록 할 것 (댓글본문과 유저닉네임, 대댓글 깊이는 필수로 입력되도록 할 것)
//   /api/:campaignId/comment/:commentId POST]요청이 오면 해당 캠페인과 Comment 에 대한 
//     대댓글을 달 수 있도록 할 것 (댓글본문과 유저닉네임, 대댓글 id 와 대댓글 깊이는 필수로 입력되도록 할 것


/* GET - Campaign에 대한 리스트 조회 */
router. get('/campaign',(req,res,next)=>{

    Campaign.find().then(data=>{   
        res.json(data);
    }).catch(err=>{
        next(err)
    })
});

/* GET - 해당 campaign과 그에 대한 댓글 모두 조회 */
router.get('/:campaignId', async (req, res, next) => {
    try {
        const campaignId = req.params.campaignId;

        // 해당 campaign 조회
        const campaign = await Campaign.findOne({ CampaignId: campaignId });
        // 해당 campaign에 대한 댓글 조회
        const comments = await Comment.find({ Campaign: campaignId });

        const result = {
            campaign: campaign,
            comments: comments
        };
        res.json(result);

    } catch (err) {
        next(err);
    }
});

/* POST - 해당 campaign에 대한 댓글을 임의로 달 수 있도록 한다 */
router. post('/:campaignId/comment',(req,res,next)=>{

    const campaignId = req.params.campaignId;
    const { body, userNickname } = req.body;
    
    Comment.create({
        body: body,
        userNickname: userNickname,
        depth: 0,
        Campaign: campaignId,
    }).then(data=>{
        res.json(data);
    }).catch(err=>{
        next(err)
    });
});

/* POST - 해당 campaign과 Comment에 대한 대댓글을 달 수 있도록 한다*/
router. post('/:campaignId/comment/:commentId', async (req,res,next)=>{

    const campaignId = req.params.campaignId;
    const commentId = req.params.commentId;
    const { body, userNickname } = req.body;
    
    Comment.create({
        body: body,
        userNickname: userNickname,
        depth: 1,
        Campaign: campaignId,
    }).then(async (data) => {
        const parentComment = await Comment.findById(commentId);
        parentComment.commentReplys.push(data._id);
        await parentComment.save();
        res.json(data);
    }).catch(err=>{
        next(err)
    });
});

module.exports = router;