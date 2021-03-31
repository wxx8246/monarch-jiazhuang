const http = require("../../utils/http.js")
const config = require("../../config.js")
import { $startWuxRefresher, $stopWuxRefresher, $stopWuxLoader, $wuxCountDown } from '../../components/wux/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poster: false,
    scrollTop: 0,
    pageIndex: 1,
    list: [],
    val: '',
    popVisible: false,
    popItem: null,
    checkArr: []
  },
  onSearch(e) {
    console.log(e);
    this.setData({
      val: e.detail.value,
      pageIndex: 1,
      list: [],
    }, () => {
      this.getList()
    })
  },
  getList(onLoadmore) {
    let _this = this
    http.GET({
      url: config.apiUrl + `/wx/jz/list?keyword=${_this.data.val}&page=${_this.data.pageIndex}&limit=${config.pageSize}&categoryId=0`,
      // params: params,
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
    let id = e.currentTarget.dataset.id
    if (this.data.poster) { //  说明来自海报
      this.getDetails(id)
    } else {
      wx.navigateTo({
        url: "/pages/productDetails/index?id=" + id
      })
    }
  },
  getDetails(id) {
    let idList = this.data.idList
    if(idList.indexOf(id) != -1){
      wx.showToast({
        title: '已选择该产品',
        mask: true,
        icon: 'none',
        duration: 1000
      })
      return
    }
    http.GET({
      url: config.apiUrl + '/wx/jz/detail?id=' + id,
      success: res => {
        console.log(res.data);
        // if (res.data.specificationList.length > 0) {  //说明有规格
        let arr = res.data.goodsProductList
        arr = arr.filter((a=>{
          return a.state == '启用'
        }))
          this.setData({
            popVisible: true,
            popItem: {
              id: res.data.info.id,
              name: res.data.info.name,
              brief: res.data.info.brief,
              specificationList: res.data.specificationList,
              goodsProductList:arr,
            }
          })
        // }
      }
    })
  },
  onCommit() {
    const checkArr = this.data.checkArr
    const popItem = this.data.popItem
    // if (checkArr.length == 0) {
    //   wx.showToast({
    //     title: '请选择规格',
    //     mask: true,
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return
    // } else {
      let arr = []
      checkArr.map((item) => {
        arr.push(popItem.goodsProductList[item])
      })
      console.log(arr);
      popItem.goodsProductList = arr

      var pages = getCurrentPages();
      var prevPage  = pages[pages.length - 2];
      prevPage.getItem(popItem)
      wx.navigateBack()
    // }
  },
  onClose() {
    this.setData({
      popVisible: false,
      checkArr: []
    })
  },
  onChangeCheckbox(e) {
    const { value } = e.detail
    // console.log(value);
    // const data = this.data.checkArr
    // const index = data.indexOf(value)
    // const current = index === -1 ? [...data, value] : data.filter((n) => n !== value)
    // console.log(current);
    // if (current.length > 3) {
    //   wx.showToast({
    //     title: '至多展示三个规格',
    //     mask: true,
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   return
    // }
    this.setData({
      checkArr: [value],
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.from == 'poster') {
      this.setData({
        poster: true,
        idList:JSON.parse(options.idList)
      })
    }
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