const http = require("../../utils/http.js")
const config = require("../../config.js")
const APP = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: {},
    specificationList: [], //规格参数
    cantChooseItem: [],
    cantChooseItemVr: [],
    vrList: [], //规格参数
    specification_choose: {

    }, //规格参数中选中的项
    vr_choose: {

    }, //vr中选中的项
    collect: '加入收藏',
    popVisible: false,
    vrVisible: false,
    shareVisible: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.id) {
      this.getDetails(options.id)
    } else if (options.scene) { //小程序码扫码进入
      const scene = decodeURIComponent(options.scene)
      this.getDetails(scene)
    }
  },
  goVr() {
    let item = this.data.details.vr
    console.log(item)
    if (item == '') {
      return
    }
    wx.navigateTo({
      url: '../vr/index?src=' + item,
    })
  },
  chooseSpecifications(e) {
    let type = e.currentTarget.dataset.type
    let choose = e.currentTarget.dataset.choose
    if (this.data.cantChooseItem.indexOf(choose) != -1) {
      return
    }
    let goodsProductList = this.data.goodsProductList
    let specification_choose = JSON.parse(JSON.stringify(this.data.specification_choose))
    wx.showLoading()

    //修改选中的项
    //查看在选中的数据(specification_choose.specification)中是否有这一类(type) 
    let arr = specification_choose.specification.filter((item) => {
      return item.a == type
    })
    //如果没有这一类 把这一类的数据加入
    if (arr.length == 0) {
      specification_choose.specification.push({
        a: type,
        b: choose
      })
    } else { //如果有这一类,改变选中的项
      specification_choose.specification.map((item, index) => {
        if (item.a == type && item.b != choose) { //选中的项不一样就改变 
          item.b = choose
          return
        } else if (item.a == type && item.b == choose) { //选中的还是之前那个,就清空
          specification_choose.specification.splice(index, 1)
        }
      })
    }

    goodsProductList.map(a => {
      // if (JSON.stringify(a.specificationsname) == JSON.stringify(specification_choose.specification)) {
      //   specification_choose.picUrl = a.url
      //   specification_choose.value = a.price
      //   specification_choose.company = a.company 
      //   specification_choose.name = a.name 
      //   specification_choose.code = a.code 
      //   specification_choose.content = a.content 
      //   specification_choose.isStart = false
      // }
      let num = 0
      a.specificationsname.map(b => {
        specification_choose.specification.map(c => {
          if (JSON.stringify(b) == JSON.stringify(c)) {
            num++
          }
        })
      })
      if (num == a.specificationsname.length) {
        specification_choose.picUrl = a.url
        specification_choose.value = a.price
        specification_choose.company = a.company
        specification_choose.name = a.name
        specification_choose.code = a.code
        specification_choose.content = a.content
        specification_choose.isStart = false
      }
    })
    console.log(specification_choose);
    let cantChooseItem = []
    let arrx = []
    let cantChooseList = goodsProductList.filter(a => {
      return a.state == '关闭'
    })

    if (cantChooseList.length > 0) {
      cantChooseList.map(b => {
        let num = 0
        let length = b.specifications.length
        specification_choose.specification.map(a => {
          if (b.specifications.indexOf(a.b) != -1) {
            num += 1
          }
        })
        if (num == length - 1) {
          cantChooseItem.push(b.specifications)
        }
      })
    }
    cantChooseItem.map(b => {
      b.map(c => {
        let num = 0
        specification_choose.specification.map(a => {
          if (c == a.b) {
            num += 1
          }
        })
        if (num == 0) {
          arrx.push(c)
        }
      })
    })
    cantChooseItem = arrx

    console.log('arrx', arrx);

    this.setData({
      specification_choose,
      cantChooseItem
    })
    setTimeout(() => {
      wx.hideLoading()
    }, 200)
  },
  chooseVr(e) {
    let type = e.currentTarget.dataset.type
    let choose = e.currentTarget.dataset.choose
    if (this.data.cantChooseItemVr.indexOf(choose) != -1) {
      return
    }
    let goodsProductListtVR = this.data.goodsProductListtVR
    let vr_choose = JSON.parse(JSON.stringify(this.data.vr_choose))
    wx.showLoading()

    //修改选中的项
    //查看在选中的数据(vr_choose.specification)中是否有这一类(type) 
    let arr = vr_choose.specification.filter((item) => {
      return item.a == type
    })
    //如果没有这一类 把这一类的数据加入
    if (arr.length == 0) {
      vr_choose.specification.push({
        a: type,
        b: choose
      })
    } else { //如果有这一类,改变选中的项
      vr_choose.specification.map((item, index) => {
        if (item.a == type && item.b != choose) { //选中的项不一样就改变 
          item.b = choose
          return
        } else if (item.a == type && item.b == choose) { //选中的还是之前那个,就清空
          vr_choose.specification.splice(index, 1)
        }
      })
    }

    goodsProductListtVR.map(a => {
      if (JSON.stringify(a.specificationsname) == JSON.stringify(vr_choose.specification)) {
        vr_choose.picUrl = a.url
        vr_choose.value = a.price
        vr_choose.isStart = false
      }
    })
    console.log(vr_choose);
    let cantChooseItemVr = []
    let arrx = []
    let cantChooseList = goodsProductListtVR.filter(a => {
      return a.state == '关闭'
    })

    if (cantChooseList.length > 0) {
      cantChooseList.map(b => {
        let num = 0
        let length = b.specifications.length
        vr_choose.specification.map(a => {
          if (b.specifications.indexOf(a.b) != -1) {
            num += 1
          }
        })
        if (num == length - 1) {
          cantChooseItemVr.push(b.specifications)
        }
      })
    }
    cantChooseItemVr.map(b => {
      b.map(c => {
        let num = 0
        vr_choose.specification.map(a => {
          if (c == a.b) {
            num += 1
          }
        })
        if (num == 0) {
          arrx.push(c)
        }
      })
    })
    cantChooseItemVr = arrx

    console.log('arrx', arrx);

    this.setData({
      vr_choose,
      cantChooseItemVr
    })
    setTimeout(() => {
      wx.hideLoading()
    }, 200)
  },
  // chooseVr(e) {
  //   let item = e.currentTarget.dataset.item
  //   console.log(item);
  //   this.setData({
  //     vr_choose: item
  //   })
  // },
  showImg(e) {
    if (e.currentTarget.dataset.src == '') {
      return
    }
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
  },
  popOn() {
    this.setData({
      popVisible: true,
    })
  },
  popOnClose() {
    this.setData({
      popVisible: false,
    })
  },

  vrOn() {
    this.setData({
      vrVisible: true,
    })
  },
  vrOnClose() {
    this.setData({
      vrVisible: false,
    })
  },
  shareOn() {
    this.setData({
      shareVisible: true,
    })
  },
  shareOnClose() {
    this.setData({
      shareVisible: false,
    })
  },

  //分享海报
  // sharePoster() {
  //   let vm = this
  //   vm.poster.show({
  //     shape: {
  //       background: '#fff',
  //       width: 690,
  //       height: 1090
  //     },
  //     canvasData: [{
  //       type: 'img',
  //       content: vm.data.details.picUrl, //产品图片 (主图片)
  //       x: 0,
  //       y: 0,
  //       width: 690,
  //       height: 690
  //     },
  //     {
  //       type: 'text',
  //       content: vm.data.details.name, //产品名称 (主title)
  //       x: 30,
  //       y: 720,
  //       textAlign: 'left',
  //       color: '#333333',
  //       fontSize: 30,
  //       width: 625,
  //       row: 1
  //     },
  //     {
  //       type: 'text',
  //       content: '立即咨询',
  //       x: 30,
  //       y: 780,
  //       textAlign: 'left',
  //       color: '#F74335',
  //       fontSize: 36,
  //       width: 620,
  //       row: 2
  //     },
  //     {
  //       type: 'text',
  //       content: '立即咨询1',
  //       x: 230,
  //       y: 785,
  //       textAlign: 'left',
  //       color: '#999999',
  //       fontSize: 24,
  //       width: 120,
  //       row: 2
  //     },
  //     {
  //       type: 'shape',
  //       shape: 'rect',
  //       background: '#C8C8C8',
  //       x: 227,
  //       y: 795,
  //       width: 90,
  //       height: 2
  //     },
  //     {
  //       type: 'text',
  //       content: '人气' + '立即咨询2',
  //       x: 500,
  //       y: 798,
  //       textAlign: 'left',
  //       color: '#333333',
  //       fontSize: 26,
  //       width: 130,
  //       row: 2
  //     },

  //     {
  //       type: 'shape',
  //       shape: 'rect',
  //       background: '#C8C8C8',
  //       x: 30,
  //       y: 850,
  //       width: 630,
  //       height: 2
  //     },
  //     // 780
  //     {
  //       type: 'img',
  //       content: vm.data.details.picUrl,
  //       x: 30,
  //       y: 890,
  //       width: 90,
  //       height: 90,
  //       border: 'circle'
  //     },
  //     {
  //       type: 'text',
  //       content: '设计师1',
  //       x: 140,
  //       y: 900,
  //       color: '#333333',
  //       fontSize: 30
  //     },
  //     {
  //       type: 'text',
  //       content: '您的专属顾问',
  //       x: 140,
  //       y: 945,
  //       color: '#999999',
  //       fontSize: 24
  //     },
  //     {
  //       type: 'text',
  //       content: '长按识别逛逛TA的店铺',
  //       x: 30,
  //       y: 1010,
  //       color: '#999999',
  //       fontSize: 20
  //     },
  //     {
  //       type: 'img',
  //       content: vm.data.details.picUrl,
  //       x: 690 - 30 - 170,
  //       y: 880,
  //       width: 170,
  //       height: 170,
  //       border: 'circle'
  //     }
  //     ],

  //     canvasId: new Date().getTime(),
  //     canvasText: '保存图片到相册'
  //   })
  // },
  openPDF() {
    wx.showLoading({
      title: '请求中',
    })
    wx.downloadFile({
      // 示例 url，并非真实存在
      url: this.data.details.pdfUrl,
      success: function (res) {
        wx.hideLoading()
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '暂无安装说明!',
          icon: 'none'
        })
      }
    })

  },
  openPDF2() {
    wx.showLoading({
      title: '请求中',
    })
    wx.downloadFile({
      // 示例 url，并非真实存在
      url: this.data.details.pdfUrl2,
      success: function (res) {
        wx.hideLoading()
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '暂无使用说明!',
          icon: 'none'
        })
      }
    })

  },
  getDetails(id) {
    http.GET({
      url: config.apiUrl + '/wx/jz/detail?id=' + id,
      // params: params,
      success: res => {
        if (!res.data.info) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '无产品信息,请联系管理员!',
            success: res => {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          })
          return
        }
        let specification_choose = {
          picUrl: res.data.info.picUrl ? res.data.info.picUrl : '',
          specification: [],
          value: res.data.info.counterPrice,
          isStart: true //表示是刚开始还未选中规格
        }
        this.setData({
          details: res.data.info,
          specification_choose,
          specificationList: res.data.specificationList,
          goodsProductList: res.data.goodsProductList,
          vrList: res.data.specificationListVR,
          goodsProductListtVR: res.data.goodsProductListtVR,
          vr_choose: specification_choose,
          collect: res.data.collect == 0 ? '加入收藏' : '取消收藏',
        })
      }
    })
  },
  collect() {
    http.POST({
      url: config.apiUrl + `/wx/jz/addordelete`,
      params: {
        valueId: this.data.details.id
      },
      success: res => {
        console.log(res.data);
        wx.showToast({
          title: res.data,
          duration: 2000
        })
        if (res.data == '收藏成功') {
          this.setData({
            collect: '取消收藏'
          })
        } else {
          this.setData({
            collect: '加入收藏'
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: this.data.details.name,
      path: '/pages/productDetails/index?id=' + this.data.details.id,
      imageUrl: this.data.details.picUrl
    }
  }
})