const http = require("../../utils/http.js")
const config = require("../../config.js")

const isTel = (value) => !/^1[34578]\d{9}$/.test(value)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    error: false,
    mobile: '',
    feedType: '',
    content: '',
  },
  onSubmit() {
    if (this.data.error) {
      wx.showModal({
        title: '手机号码输入不正确!',
        showCancel: !1,
      })
      return
    }
    console.log(this.data);
    http.POST({
      url: config.apiUrl + '/wx/jz/submit',
      params: {
        ...this.data
      },
      success: res => {
        console.log(res.data);
        wx.showToast({
          title: '反馈成功!',
          icon: 'success',
          duration: 2000
        })
        setTimeout(()=>{
          wx.navigateBack()
        },2000)
      }
    })
  },
  onChangePhone(e) {
    this.setData({
      error: isTel(e.detail.value),
      mobile: e.detail.value,
    })
  },
  onChangeFeedType(e) {
    this.setData({
      feedType: e.detail.value,
    })
  },
  onChangeContent(e) {
    this.setData({
      content: e.detail.value,
    })
  },

  onClear(e) {
    console.log('onClear', e)
    this.setData({
      error: true,
      mobile: '',
    })
  },
  onError() {
    wx.showModal({
      title: '手机号码输入不正确!',
      showCancel: !1,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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