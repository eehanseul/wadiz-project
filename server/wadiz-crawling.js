const axios = require('axios');
const mongoose = require('mongoose');
const Campaign = require('./model/Campaign');
const Comment = require('./model/Comment');

// .env 파일의 경로 설정
require('dotenv').config();
const {MONGO_HOST} = process.env; // mongodb host .env에서 가져옴
console.log(MONGO_HOST);
mongoose.connect(MONGO_HOST, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connect Successful'))
  .catch(err => console.error("DB 연결 에러 ",err));


async function fetchCampaign(url) {
  const response = await axios.post(url,{
    startNum: 0,
    order: "support",
    limit: 48,
    categoryCode: "",
    endYn: "",
  });
  return response.data;
}
async function fetchComment(url) {
  const response = await axios.get(url,{
    params: {
      size:20,
      commentGroupType:'CAMPAIGN',
    },
  });
  return response.data;
}

async function createComment(commentData, campaignId) {
  // Create the comment
  const newComment = await Comment.create({
    body: commentData.body,
    Campaign: campaignId,
    commentType: commentData.commentType,
    userNickname: commentData.nickname,
    whenCreated: commentData.whenCreated,
    depth: commentData.depth,
    commentReplys: [],
  });

  // 대댓글있으면 create 해주고 부모 commentReplys에 id push 해주기
  if (commentData.commentReplys && commentData.commentReplys.length > 0) {
    for (const replyData of commentData.commentReplys) {
      const replyComment = await createComment(replyData, campaignId);
      newComment.commentReplys.push(replyComment._id);
    }
    await newComment.save(); // Save the comment to update commentReplys
  }
  return newComment;
}

async function scrapeData(url) {

  const response = await fetchCampaign(url);
  const campaignList = response.data.list.slice(0, 20);

  for (const campaignData of campaignList) {
    const commentUrl = `https://www.wadiz.kr/web/reward/api/comments/campaigns/${campaignData.campaignId}`;

    //create campaign
    await Campaign.create({
      CampaignId: campaignData.campaignId,
      categoryName: campaignData.categoryName,
      Title: campaignData.title,
      totalBackedAmount: campaignData.totalBackedAmount,
      photoUrl: campaignData.photoUrl,
      nickname: campaignData.nickName,
      coreMessage: campaignData.coreMessage,
      whenOpen: campaignData.whenOpen,
      achievementRate: campaignData.achievementRate,
    });

    // create comments
    const commentList = await fetchComment(commentUrl);
    for (const commentData of commentList.data.content) {
      await createComment(commentData, campaignData.campaignId);
    }
  }

  console.log("Data saved to MongoDB");
  mongoose.connection.close();

};

async function scrapeAllData() {
  const campaignUrl = "https://service.wadiz.kr/api/search/funding";
  await scrapeData(campaignUrl);
}

scrapeAllData();