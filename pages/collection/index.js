const http = require("../../utils/http.js")
const config = require("../../config.js")
import { $startWuxRefresher, $stopWuxRefresher, $stopWuxLoader, $wuxCountDown } from '../../components/wux/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    pageIndex: 1,
    list: [],
    right: [{
      text: '取消收藏',
      style: 'background-color: #ddd; color: red',
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $startWuxRefresher()
  },
  getList(onLoadmore) {
    let _this = this
    http.GET({
      url: config.apiUrl + `/wx/jz/collectList?page=${_this.data.pageIndex}&limit=${config.pageSize}&type=0`,
      success: res => {
        console.log(res.data);
        if (onLoadmore) { //下拉时候
          this.setData({
            list: this.data.list.concat(res.data.list),
          })
          if (this.data.pageIndex < res.data.pages) {
            $stopWuxLoader()
          } else {
            $stopWuxLoader('#wux-refresher', this, true)
          }
        } else { // 刷新时候
          this.setData({
            list: res.data.list,
          })
          if (res.data.list.length == 0 || this.data.pageIndex == res.data.pages) {
            $stopWuxLoader('#wux-refresher', this, true)
          }
          $stopWuxRefresher()
        }

      }
    })
  },
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  onPulling() {
    console.log('onPulling')
  },
  onRefresh() {
    console.log('onRefresh')
    this.setData({
      pageIndex: 1
    }, () => {
      this.getList()
    })
  },
  onLoadmore() {
    console.log('onLoadmore')
    let pageIndex = this.data.pageIndex + 1
    this.setData({
      pageIndex
    }, () => {
      this.getList('onLoadmore')
    })
  },
  toDetailsTap(e) {
    wx.navigateTo({
      url: "/pages/productDetails/index?id=" + e.currentTarget.dataset.id
    })
  },
  cancel(e){
    http.POST({
      url: config.apiUrl + `/wx/jz/addordelete`,
      params: {
        valueId:  e.currentTarget.dataset.id
      },
      success: res => {
        $startWuxRefresher()
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
  onShareAppMessage: function () {

  }
})