//app.js
const AV = require('./libs/av-weapp-min.js');

AV.init({
  appId: 'you leancloud app id',
  appKey: 'you leancloud app key',
});

App({
  onLaunch: function () {
    //获取用户登录信息
    AV.User.loginWithWeapp().then(user => {
      this.globalData.userInfo = user.toJSON();
      console.log(user.toJSON())
    }).catch(console.error);
  },
  globalData: {
    userInfo: null
  }
})