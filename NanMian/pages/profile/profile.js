// pages/profile/profile.js

const AV = require('../../libs/av-weapp-min.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAvatar:'../../images/icon.png',
    userName:'难眠'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获得当前登录用户
    wx.showLoading({
      title: '获取登录状态',
    })
    const user = AV.User.current();
    let that = this;
    // 调用小程序 API，得到用户信息
    wx.getUserInfo({
      success: ({ userInfo }) => {
        // 更新当前用户的信息
        user.set(userInfo).save().then(user => {
          // 成功，此时可在控制台中看到更新后的用户信息
          wx.hideLoading()
          app.globalData.userInfo = user.toJSON();
          console.log(app.globalData.userInfo)
          that.setData({
            userAvatar: userInfo.avatarUrl,
            userName: userInfo.nickName
          })
        }).catch((error) => {
          console.error(error)
          wx.hideLoading()
        });
      },
      fail: (error) => {
        console.error(error)
        wx.hideLoading()
      }
    });
  },

  onShareAppMessage: function (res) {
    return {
      title: '难眠',
    }
  }

})