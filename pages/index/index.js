// index.js
// var dominantemotionValue = null
// var happyValue = 0.0
// var angryValue = 0.0
// var disgustValue = 0.0
// var fearValue = 0.0
// var neutralValue = 0.0
// var sadValue = 0.0
// var surpriseValue = 0.0
// var isfaceValue = false
var initIp='www.lanhung.com'
var initHost=':5050'
Page({
    //数据
    data:{
        ip:initIp,
        host:initHost,
        dominantemotion:null,
        happy:0,
        angry:0,
        disgust:0,
        fear:0,
        neutral:0,
        sad:0,
        surprise:0,
        isface:false,
        isOk:false

    },
    // 第一次加载时调用
    onLoad(){
        console.log('ip:',this.data.ip,'host:',this.data.host)
        // this.loginForm(data)
    },
    // 提交IP地址和端口号
    submit: function(data) {
        console.log(data.detail.value)//  

        this.setData({
            isOk:true,
            ip:data.detail.value.ip,
            host:data.detail.value.host,
        })
    },
    //重置
    reset:function(){
        this.setData({
            isOk:false,
            ip:initIp,
            host:initHost

        })
        console.log('reset!!!!!!!!!!')

    },
    //
    onShow: function(){
        var that =this;
        /**
         * 防止用户拿不到最新数据(因为页面切换会重新计时)
         * 无条件请求一次最新数据
         */
        // console.log('请求接口：刷新数据(无条件执行)')
        /**
         * 每隔一段时间请求服务器刷新数据(客户状态)
         * 当页面显示时开启定时器(开启实时刷新)
         * 每隔1分钟请求刷新一次
         * @注意：用户切换后页面会重新计时
         */
        setInterval(()=>{ 
            if (this.data.isOk){
                console.log(this.data.isOk)

                 //拍摄照片
                wx.createCameraContext().takePhoto({
                    quality: 'high',//拍摄质量(high:高质量 normal:普通质量 low:高质量)
                    success: (res) => {
                        //拍摄成功
                        //照片文件的临时文件
                        var file = res.tempImagePath;
                        console.log(file)
                        //上传图片处理成base64
                        wx.getFileSystemManager().readFile({
                            filePath: file,
                            encoding:"base64",
                            success: function (data){
                                console.log(data)//返回base64编码结果，但是图片的话没有data:image/png
                                var str = JSON.stringify(data)
                                var temp =JSON.parse(str)
                                //   上传
                                console.log('---------------')
                                console.log({"img":"data:image/jpeg;base64,"+temp['data']})
                                wx.request({
                                    url: 'http://'+that.data.ip+that.data.host+'/analyze',
                                    header:{
                                        "Content-Type": "application/json"
                                    },
                                    data: {
                                        "img":["data:image/jpeg;base64,"+temp['data']]
                                    },
                                    method: 'POST',
                                    success: (res) => {
                                        console.log(that.data.ip)
                                        //上传成功
                                        console.log(res)
                                        console.log(typeof(res.data))
                                        // console.log(res.data['instance_1']['emotion']['angry'])
                                        // var dominant_emotion =res.data['instance_1']['dominant_emotion']
                                        // var data=JSON.parse(res.data)
                                        // console.log(data)
                                        if(res.data['statusCode']=200){
                                            console.log(res.data['instance_1']['emotion']['angry'])
                                            var dominant_emotion =res.data['instance_1']['dominant_emotion']
                                            // console.log('ok')
                                            console.log(res.data['instance_1']['emotion']['angry'].toFixed(5))
                                            
                                            that.setData({
                                                angry:res.data['instance_1']['emotion']['angry'].toFixed(5),
                                                happy:res.data['instance_1']['emotion']['happy'].toFixed(5),
                                                disgust:res.data['instance_1']['emotion']['disgust'].toFixed(5),
                                                fear:res.data['instance_1']['emotion']['fear'].toFixed(5),
                                                neutral:res.data['instance_1']['emotion']['neutral'].toFixed(5),
                                                sad:res.data['instance_1']['emotion']['sad'].toFixed(5),
                                                surprise:res.data['instance_1']['emotion']['surprise'].toFixed(5),
                                            })
                                            console.log('hhh:'+that.data.ip)
                        
                                    } 
                                    },
                                    fail: (res) => {
                                        //上传失败
                                        wx.showToast({
                                            title: '上传失败！！！！！',
                                            icon: 'error'
                                        })
                                    },
                                    complete: (res) => {},
                                })
                        
                            }
                        })
                
                    },
                    fail: (res) => {
                        //拍摄失败
                        wx.showToast({
                            title: '拍摄失败！！！！！',
                            icon: 'error'
                        })
                    },            
                })
                
            }
            
           
    
        }, 5000)//间隔时间
        
    },   
})
