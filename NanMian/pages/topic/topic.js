//index.js
const AV = require('../../libs/av-weapp-min.js');
const moment = require('../../utils/moment.js')

//获取应用实例
const app = getApp()

Page({
  data: {
    topics:[]
  },
  onLoad: function () {
    wx.startPullDownRefresh();
  },

  getTopicData:function(){
    var that = this
    //查询话题信息
    var topicQuery = new AV.Query('Topic')
    topicQuery.descending('createdAt');
    topicQuery.find()
      .then(function (topics) {
        wx.stopPullDownRefresh()
        var tempTopics = []
        topics.forEach(function (topic) {
          topic.createdAt = moment(topic.createdAt).format('YYYY年MM月DD日 HH:mm:ss')
          tempTopics.push(topic.toJSON())
        })

        that.setData({
          topics: tempTopics
        })
        console.log(tempTopics)
      }).catch(function (error) {
        wx.stopPullDownRefresh()
        console.error(error)
      });
  },

  //点击事件
  jumpToDetail: function (event) {
    console.log(event)
    var topicId = event.currentTarget.dataset.topicid
    var imageUrl = event.currentTarget.dataset.imageurl
    var cardTitle = event.currentTarget.dataset.cardTitle
    wx.navigateTo({
      url: '../detail/detail?topicId=' + topicId + '&imageurl=' + imageUrl + '&cardTitle=' + cardTitle,
    })
  },

  onPullDownRefresh: function (event) {
    this.getTopicData();
  },

  onShareAppMessage: function (res) {
    return {
      title: '难眠',
    }
  }

})
