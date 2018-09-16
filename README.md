# 一个社交类的微信小程序
这是一个微信小程序，社交类的，但是快做完了才发现个人是不能发布社交类的小程序的...既然如此，那就开源好了
#### 大致功能：
1.发布动态：可以发文字，图片以及录音  

2.发布话题：需要手动修改数据库来发布话题  

3.话题的留言：用户可以对话题留言
#### 截图：
![主页](https://upload-images.jianshu.io/upload_images/2649238-85ddc3eafacf2e1e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/340)

![话题](https://upload-images.jianshu.io/upload_images/2649238-5fc7722a3dd724bc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/340)

![发布](https://upload-images.jianshu.io/upload_images/2649238-468fb8e94b85bf31.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/340)

![话题留言](https://upload-images.jianshu.io/upload_images/2649238-af7b797665d4aa00.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/340)

![我的](https://upload-images.jianshu.io/upload_images/2649238-35421f288eca0b55.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/340)

#### 使用代码的方法：
1.首先你要在项目的project.config.json配置文件下填入自己的小程序appid
```
"appid": "your app id",
```
2.然后此项目的后台服务使用的是leancloud，你需要去  
https://leancloud.cn/  
注册账号，并创建自己的一个项目，然后按照上面  
https://leancloud.cn/docs/weapp.html#hash650323347  
的文档配置好

3.配置完后把leancloud上的appid和appkey填入项目的app.js里
```
AV.init({
  appId: 'you leancloud app id',
  appKey: 'you leancloud app key',
});
```

###### 希望大家给我star...
