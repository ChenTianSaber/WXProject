// pages/write/write.js
const AV = require('../../libs/av-weapp-min.js');
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    value:"",
    topicId:'',
    nickName:'',
    avatarUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      avatarUrl: options.avatarUrl,
      nickName: options.nickName,
      topicId: options.topicId
    })
  },

  bindTextAreaBlur:function(event){
    console.log('bindTextAreaBlur:'+event.detail.value)
    this.setData({
      value: event.detail.value
    })
  },

  submit:function(event){
    console.log('submit:' + this.data.value)

    var Comment = AV.Object.extend('Comment');
    var comment = new Comment();
    comment.set('commentText', this.data.value);
    comment.set('topicId', this.data.topicId);
    comment.set('userAvatar', this.data.avatarUrl);
    comment.set('userName', this.data.nickName);
    comment.set('userId', app.globalData.userInfo.objectId);
  
    wx.showLoading({
      title: '发布中',
      mask:true
    })
    comment.save().then(function (comment) {
      console.log('objectId is ' + comment.id);
      wx.hideLoading();
      wx.showToast({
        title: '发布成功',
      })
      wx.navigateBack({
        delta:1,
      })
    }, function (error) {
      console.error(error);
    });
  }
})