// pages/detail/detail.js
const AV = require('../../libs/av-weapp-min.js');
const moment = require('../../utils/moment.js')
const app = getApp()

var topicId = '';
var imageUrl = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl:'',
    comments:[],
    topicId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    topicId = options.topicId
    imageUrl = options.imageurl
  },

  onShow: function () {
    var that = this;
    var query = new AV.Query('Comment');
    query.equalTo('topicId', topicId);
    query.descending('createdAt');
    query.find().then(function (values) {
      console.log(values)
      var tempComments = []
      values.forEach(function (value) {
        value.createdAt = moment(value.createdAt).format('YYYY年MM月DD日 HH:mm:ss')
        tempComments.push(value.toJSON())
      })

      that.setData({
        imageUrl: imageUrl,
        comments: tempComments,
        topicId: topicId
      })

    }, function (error) {
      console.error(error)
    })
  },

  jumpToWrite: function(event){
    var that = this;

    // 获得当前登录用户
    const user = AV.User.current();
    // 调用小程序 API，得到用户信息
    wx.showLoading({
      title: '获取登录状态',
    })
    wx.getUserInfo({
      success: ({ userInfo }) => {
        // 更新当前用户的信息
        user.set(userInfo).save().then(user => {
          // 成功，此时可在控制台中看到更新后的用户信息
          wx.hideLoading()
          app.globalData.userInfo = user.toJSON();
          console.log(user.toJSON())
          wx.navigateTo({
            url: '../write/write?topicId=' + that.data.topicId + '&nickName=' + app.globalData.userInfo.nickName + '&avatarUrl=' + app.globalData.userInfo.avatarUrl
          })
        }).catch((error)=>{
          console.error(error)
          wx.hideLoading()
        });
      },
      fail: (error)=>{
        console.error(error)
        wx.hideLoading()
      }
    });
  },

  jumpToDetailCmt:function(event){
    console.log(event)
    var commenttext = event.currentTarget.dataset.commenttext
    var createdate = event.currentTarget.dataset.createdate
    var username = event.currentTarget.dataset.username
    var userAvatar = event.currentTarget.dataset.useravatar
    wx.navigateTo({
      url: '../comment/comment?commenttext=' + commenttext + '&createdate=' + createdate + '&username=' + username + '&userAvatar=' + userAvatar
    })
  }

})