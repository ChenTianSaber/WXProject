// pages/upload/upload.js

const AV = require('../../libs/av-weapp-min.js');
const recorderManager = wx.getRecorderManager();
const app = getApp()

let that;
let date;
let voiceUrl;
let imageUrl;
let voiceDuration;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagePath: '',
    text: '',
    hasChooseImage: false,
    //0表示未录制，1表示正在录制，2表示录制暂停，3表示录制结束
    recorderState: 0,
    recorderPath: '',
    //0表示未播放，1表示正在播放，2表示播放暂停
    playerState: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    date = new Date().getTime();
    voiceUrl = ''
    imageUrl = ''
    voiceDuration = 0
    this.innerAudioContext = wx.createInnerAudioContext();

    recorderManager.onStart(() => {
      console.log('recorder start')
      wx.hideLoading()
      that.setData({
        recorderState: 1,
        playerState: 0
      })
    })

    recorderManager.onPause(() => {
      console.log('recorder pause')
      wx.hideLoading()
      that.setData({
        recorderState: 2
      })
    })

    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      wx.hideLoading()
      voiceDuration = res.duration
      that.setData({
        recorderState: 3,
        recorderPath: res.tempFilePath
      })
    })

    recorderManager.onFrameRecorded((res) => {
      const {frameBuffer} = res
      console.log('frameBuffer.byteLength', frameBuffer.byteLength)
    })


    this.innerAudioContext.onError((res) => {
      that.tip("播放录音失败！")
      that.setData({
        playerState: 0
      })
    })

    this.innerAudioContext.onPlay((res) => {
      wx.hideLoading()
      that.setData({
        playerState: 1
      })
    })

    this.innerAudioContext.onEnded((res) => {
      // that.tip("播放结束")
      that.setData({
        playerState: 0
      })
    })

    this.innerAudioContext.onPause((res) => {
      that.setData({
        playerState: 2
      })
    })

  },

  chooseImage: function(event) {
    let that = this;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        console.log(res);
        that.setData({
          hasChooseImage: true,
          imagePath: res.tempFilePaths[0]
        })
      },
    })
  },

  clickRecord: function(event) {
    if (that.data.recorderState == 3) {
      if (that.data.playerState == 0) {
        // 播放录音
        console.log(that.data.recorderPath)
        this.innerAudioContext.src = this.data.recorderPath; // 这里可以是录音的临时路径
        wx.showLoading({
          title: '准备播放',
        })
        this.innerAudioContext.play()
      } else if (that.data.playerState == 1) {
        this.innerAudioContext.pause()
      } else if (that.data.playerState == 2) {
        this.innerAudioContext.play()
      }

      return
    }

    // wx.openSetting({})
    // 先获取录音权限
    wx.authorize({
      scope: 'scope.record',
      fail: (res) => {
        console.log(res);
        wx.showModal({
          title: '提示',
          content: '录音权限获取失败，请去(右上角 - 关于 - 右上角 - 设置)界面开启录音权限',
          showCancel: false
        })
      },
      success: () => {
        if (that.data.recorderState == 0) {
          wx.showLoading({
            title: '准备录音',
          })

          const options = {
            format: 'mp3',
            duration:600000,
          }
          recorderManager.start(options)

        } else if (that.data.recorderState == 1) {
          wx.showLoading({
            title: '暂停录音',
          })

          recorderManager.pause()
        } else if (that.data.recorderState == 2) {
          recorderManager.resume()
          that.setData({
            recorderState: 1
          })
        }
      }
    })

  },

  clickLongRecord: function(event) {
    if (that.data.recorderState == 0) {
      return
    } else if (that.data.recorderState == 3) {
      // 重置录音
      wx.showModal({
        title: '提示',
        content: '确定要重新录音吗',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.innerAudioContext.stop();
            wx.showLoading({
              title: '准备录音',
            })

            const options = {
              format: 'mp3',
              duration: 600000,
            }

            recorderManager.start(options)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      // 结束录音
      wx.showModal({
        title: '提示',
        content: '确定要结束录音吗',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            recorderManager.stop()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

  },

  bindTextAreaBlur: function(event) {
    console.log('bindTextAreaBlur:' + event.detail.value)
    this.setData({
      text: event.detail.value
    })
  },

  submitData: function(event) {
    // 获得当前登录用户
    wx.showLoading({
      title: '获取登录状态',
    })
    const user = AV.User.current();
    // 调用小程序 API，得到用户信息
    wx.getUserInfo({
      success: ({ userInfo }) => {
        // 更新当前用户的信息
        user.set(userInfo).save().then(user => {
          // 成功，此时可在控制台中看到更新后的用户信息
          wx.hideLoading()
          app.globalData.userInfo = user.toJSON();
          console.log(app.globalData.userInfo)
          that.uploadData();
        }).catch((error)=>{
          wx.hideLoading()
        });
      },
      fail:(error)=>{
        console.error(error)
        wx.hideLoading()
      }
    });
  },

  uploadData:function(){
    this.date = new Date().getTime();

    if (that.data.recorderPath == "" && that.data.imagePath == "" && that.data.text == "") {
      //啥都没写的情况下
      wx.showModal({
        title: '提示',
        content: '你好像啥都没写呢，是要退出吗',
        showCancel: 'false',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateBack({})
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }

    if (!that.data.recorderPath == "") {
      wx.showLoading({
        title: '正在传录音',
      })
      //传录音
      new AV.File('voice' + date + '.mp3', {
        blob: {
          uri: that.data.recorderPath,
        },
      }).save().then(function (file) {
        voiceUrl = file.url();
        if (!that.data.imagePath == "") {
          //传图片
          wx.showLoading({
            title: '正在传图片',
          })
          new AV.File('image' + date + '.jpg', {
            blob: {
              uri: that.data.imagePath,
            },
          }).save().then(function (file) {
            imageUrl = file.url()
            that.uploadText()
          }).catch(function (error) {
            wx.hideLoading()
            wx.showToast({
              title: '上传失败',
            })
          });
        } else {
          that.uploadText()
        }
      }).catch(function (error) {
        console.log(error)
        wx.hideLoading()
        wx.showToast({
          title: '上传失败',
        })
      });
    } else {
      if (!that.data.imagePath == "") {
        //传图片
        wx.showLoading({
          title: '正在传图片',
        })
        new AV.File('image' + date + '.jpg', {
          blob: {
            uri: that.data.imagePath,
          },
        }).save().then(function (file) {
          imageUrl = file.url()
          that.uploadText()
        }).catch(function (error) {
          wx.hideLoading()
          wx.showToast({
            title: '上传失败',
          })
        });
      } else {
        that.uploadText()
      }
    }
  },

  uploadText:function(){
    wx.showLoading({
      title: '正在上传',
    })
    var Article = AV.Object.extend('Article');
    var article = new Article();
    article.set('imageUrl', imageUrl)
    article.set('voiceUrl', voiceUrl)
    article.set('voiceDuration', voiceDuration)
    article.set('text', that.data.text)
    article.set('userName', app.globalData.userInfo.nickName)
    article.set('userAvatar', app.globalData.userInfo.avatarUrl)
    article.set('userId', app.globalData.userInfo.objectId)
    article.save().then(function (article) {
      // 成功
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '上传成功',
        showCancel: 'false',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateBack({})
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }, function (error) {
      // 失败
      wx.hideLoading()
      wx.showToast({
        title: '上传失败',
      })
    });
  }

})