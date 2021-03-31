const http = require("../../utils/http.js")
const config = require("../../config.js")


Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryKey: null,
    categoryItem: null,
    subclass: 0,
    currentSubCategory: [],
    goodsList: [],
    pageIndex: 1,
    pages: 1,
    refresherTriggered: false,
  },
  gotoSearchPage() {
    wx.navigateTo({
      url: '/pages/productSearch/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getClassification()
  },
  getClassification() {
    http.GET({
      url: config.apiUrl + '/wx/jz/classification',
      // params: params,
      success: res => {
        console.log(res.data);
        this.setData({
          currentSubCategory: res.data.currentSubCategory,
          categoryItem: res.data.currentSubCategory ? res.data.currentSubCategory[0] : null,
          categoryKey: res.data.currentSubCategory ? res.data.currentSubCategory[0].id : null,
        })
        res.data.currentSubCategory.length > 0 && this.getGoodsList(res.data.currentSubCategory[0].id)
      }
    })
  },
  getGoodsList(id, newOrMore) {
    let _this = this
    http.GET({
      url: config.apiUrl + `/wx/jz/list?categoryId=${id}&page=${_this.data.pageIndex}&limit=${config.pageSize}&subclass=${_this.data.subclass}`,
      // params: params,
      success: res => {
        console.log(res.data);
        this.setData({
          refresherTriggered: false,
          pages: res.data.pages,
          goodsList: newOrMore == 'more' ? _this.data.goodsList.concat(res.data.list) : res.data.list,
        })
      }
    })
  },
  changeTab(e) {
    if (!e) {
      let id = wx.getStorageSync("_productId")
      if (id == this.data.categoryKey || id == "") {
        return
      }
      let item = this.data.currentSubCategory.filter((item) => {
        return item.id == id
      })
      this.setData({
        categoryKey: id,
        categoryItem: item[0],
        pageIndex: 1,
        pages: 1
      })
      this.getGoodsList(id)

    } else {
      console.log(e.currentTarget.dataset);
      let item = e.currentTarget.dataset
      wx.setStorageSync("_productId", item.item.id)
      if (item.item.id == this.data.categoryKey) {
        return
      }
      this.setData({
        categoryKey: item.item.id,
        categoryItem: item.item,
        pageIndex: 1,
        pages: 1,
        subclass: 0
      })
      this.getGoodsList(item.item.id)
    }

  },
  changeClass(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      subclass: id,
      pageIndex: 1,
      pages: 1,
    }, () => {
      this.getGoodsList(this.data.categoryKey)
    })
  },
  getMoreList() {
    let pageIndex = this.data.pageIndex + 1
    this.setData({
      pageIndex,
      refresherTriggered: false,
    }, () => {
      if (pageIndex > this.data.pages) {
        return
      }
      this.getGoodsList(this.data.categoryItem.id, 'more')
    })
  },
  getRefreshList() {
    if (this.data.refresherTriggered) {
      return
    }
    this.setData({
      pageIndex: 1,
      refresherTriggered: true,
    }, () => {
      setTimeout(() => {
        this.getGoodsList(this.data.categoryItem.id)
      }, 500)

    })
  },
  toDetailsTap(e) {
    wx.navigateTo({
      url: "/pages/productDetails/index?id=" + e.currentTarget.dataset.id
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
    this.changeTab()
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
  onShareAppMessage: function () {

  }
})