// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  onGotUserInfo:function(event){
    console.log(event)
    wx.switchTab({
      url: '../home/home',
    })
  }

})