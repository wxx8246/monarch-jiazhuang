const http = require("../../utils/http.js")
const config = require("../../config.js")
const app = getApp()

Page({
  data: {
    banner: [], //轮播
    channel: [],
    newGoodsList: [],

    popUp: {},
    example: {
      animation: 'fadeIn',
      classNames: 'wux-animate--fadeIn',
      enter: true,
      exit: true,
      in: false,
    },
  },

  onClick() {
    this.setData({
      'example.in': true,
    })
  },

  onclose(e) {
    this.setData({ 'example.in': false })
  },




  onShow: function () {
    this.getIndex()
    
  },
  onLoad: function () {
    this.getPopup() 
  },
  getPopup() { // 获取首页弹窗信息
    http.GET({
      url: config.apiUrl + '/wx/jz/advertisement',
      // params: params,
      success: res => {
        console.log(res.data);

        this.setData({
          popUp: res.data
        }, () => {
          this.onClick()
        })
      }
    })
  },
  getIndex() { // 获取首页信息
    http.GET({
      url: config.apiUrl + '/wx/jz/index',
      // params: params,
      success: res => {
        console.log(res.data);
        this.setData({
          ...res.data
        })
      }
    })
  },


  tabClick(e) {  //分类点击
    let item = e.currentTarget.dataset.item
    if (item.link != '') { //如果外部跳转存在
      wx.navigateTo({
        url: '../shouhou/index?src=' + item.link,
      })
    } else {
      let id = item.id
      wx.setStorageSync("_productId", id)
      wx.switchTab({
        url: '/pages/product/index',
      })
    }
  },
  toDetailsTap(e) { //跳详情
    wx.navigateTo({
      url: "/pages/productDetails/index?id=" + e.currentTarget.dataset.id
    })
  },
  goAcOrDe(e) {  //商品详情或者链接
    let item = e.currentTarget.dataset.item
    if (item.link && item.link != '') { //如果外部跳转存在
      wx.navigateTo({
        url: '../activity/index?src=' + item.link,
      })
    } else if (item.goodsId != "") { //如果有产品
      wx.navigateTo({
        url: "/pages/productDetails/index?id=" + item.goodsId
      })
    }
  },
  goDiwang() { //跳转帝王全卫家
    wx.navigateToMiniProgram({
      appId: 'wx3528f1ad7b0aace5', //帝王全卫家appid
    })
  }
})
