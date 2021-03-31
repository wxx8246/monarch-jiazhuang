const http = require("../../utils/http.js")
const config = require("../../config.js")
const APP = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bglogo: '/images/bglogo.png',
    logo: '/images/logo.png',
    img1: '/images/shoucang.png',
    img2: '/images/kefu.png',
    img3: '/images/fankui.png',
    img4: '/images/jiaqian.png',
    img5: '/images/shouji.png',
    userAvatarUrl: '/images/nologin.png',
    userNickName: null,
    phoneNumber: null,
    member: 0,
    version: config.version,
    memberType: null,
    mobile: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPhone()

  },
  getPhone() { // 获取客服电话
    http.GET({
      url: config.apiUrl + `/wx/jz/configure`,
      success: res => {
        console.log(res);
        this.setData({
          phoneNumber: res.data.litemall_mall_phone
        })
      }
    })
  },
  //获取用户头像昵称
  bindGetUserInfo(e) {
    if (e.detail.userInfo) {
      this.setData({
        userNickName: e.detail.userInfo.nickName,
        userAvatarUrl: e.detail.userInfo.avatarUrl,
      })
    }
  },

  //联系客服
  getCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNumber
    })
  },

  bindgetphonenumber(e) {
    console.log(e.detail);
    http.POST({
      url: config.apiUrl + `/wx/jz/bindMobile`,
      params: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      },
      success: res => {
        console.log(res);
        if (res.errno == 0 && res.errmsg == "成功") {
          wx.showToast({
            title: '登录成功',
            mask: true,
            icon: 'none',
            duration: 1000
          })
          this.setData({
            member: res.data.member,
            distributor: res.data.distributor,
            mobile: res.data.mobile,
          })
          APP.globalData.loginInfo.member = res.data.member
          APP.globalData.loginInfo.distributor = res.data.distributor
          APP.globalData.loginInfo.mobile = res.data.mobile
        }
      }
    })
  },
  changeMemberType() {
    wx.showLoading()
    setTimeout(() => {
      let memberType = this.data.memberType == 1 ? 2 : 1
      this.setData({
        memberType
      }, () => {
        wx.setStorageSync("switchType", memberType)
        wx.hideLoading()
      })
    }, 600)
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
    if (APP.globalData.userInfo) {
      this.setData({
        userNickName: APP.globalData.userInfo.nickName,
        userAvatarUrl: APP.globalData.userInfo.avatarUrl,
      })
    }
    if (APP.globalData.loginInfo) {
      this.setData({
        member: APP.globalData.loginInfo.member,
        distributor: APP.globalData.loginInfo.distributor,
        mobile: APP.globalData.loginInfo.mobile,
      })
    }
    this.setData({
      memberType: wx.getStorageSync("switchType") ? wx.getStorageSync("switchType") : 1
    })
  },
  deleteMobile: function () {
    wx.showModal({
      title: '提示',
      content: `确认解除绑定手机 ${this.data.mobile} ?`,
      success: res => {
        console.log(res);
        if (res.confirm) {
          http.GET({
            url: config.apiUrl + `/wx/jz/unbundling`,

            success: res => {
              console.log(res);
              if (res.errno == 0 && res.errmsg == "成功") {
                wx.showToast({
                  title: '解绑成功',
                  mask: true,
                  icon: 'none',
                  duration: 1000
                })
                this.setData({
                  member: res.data.member,
                  distributor: res.data.distributor,
                  mobile: res.data.mobile,
                })
                APP.globalData.loginInfo.member = res.data.member
                APP.globalData.loginInfo.distributor = res.data.distributor
                APP.globalData.loginInfo.mobile = res.data.mobile
                wx.setStorageSync("switchType", 1)
              }
            }
          })
        }
      }
    })
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