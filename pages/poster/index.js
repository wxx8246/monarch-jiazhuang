const http = require("../../utils/http.js")
const config = require("../../config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: 'https://litemall-5.obs.cn-south-1.myhuaweicloud.com/litemall/xiaochengxu/logo1.png',
    bottomImg: 'https://litemall-5.obs.cn-south-1.myhuaweicloud.com/litemall/xiaochengxu/1.png',
    productName: '',
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.poster = this.selectComponent('#posterComponent')
  },
  onChangeProductName(e) {
    let value = e.detail.value  //值
    this.setData({
      productName: value
    })
  },
  /**
  * 增加规格
  */
  addSpecification(e) {
    let list = this.data.list
    let id = e.currentTarget.dataset.id   //是哪个产品
    list.map(item => {
      if (item.id == id) {
        item.specificationList.push({
          specification: "",
          value: "",
        })
      }
    })
    this.setData({
      list
    })
  },
  /**
  * 移除规格
  */
  removeSpecification(e) {
    let list = this.data.list
    let id = e.currentTarget.dataset.id   //是哪个产品
    let index = e.currentTarget.dataset.index //是产品规格的第哪个
    list.map(item => {
      if (item.id == id) {
        item.specificationList.splice(index, 1)
      }
    })
    console.log(list);
    this.setData({
      list
    })
  },
  /**
  * input 改变值
  */
  onChangeInput(e) {
    let list = this.data.list
    let id = e.currentTarget.dataset.id   //是哪个产品
    let index = e.currentTarget.dataset.index //是产品规格的第哪个
    let type = e.currentTarget.dataset.type   //是产品规格的哪个字段
    let value = e.detail.value  //值
    list.map(item => {
      if (item.id == id) {
        item.specificationList[index][type] = value
      }
    })
    console.log(list);
    this.setData({
      list
    })
  },
  add() {
    let idList = this.data.list
    idList = idList.map(item => {
      return item.id
    })
    wx.navigateTo({
      url: "/pages/productSearch/index?from=poster&idList=" + JSON.stringify(idList)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //提交生成海报
  commitPoster() {
    let detail = {
      name: this.data.productName,
      list: this.data.list,
      logo: this.data.logo,
      bottomImg: this.data.bottomImg,
      imgMsg: '扫码了解更多详情'

    }
    console.log(detail);

    //加载基础数据
    let canvasData = [
      // {
      //   type: 'img',
      //   content: detail.logo, // logo
      //   x: (690 - 200) / 2,
      //   y: 60,
      //   width: 200,
      //   height: 100
      // },
      {
        type: 'text',
        content:' ', // logo
        x: (690 - 200) / 2,
        y: 60,
        width: 200,
        height: 100
      },
      {
        type: 'text',
        content: detail.name,  // 主标题
        x: 30,
        y: 60 + 100 + 60,
        textAlign: 'left',
        color: '#000000',
        fontSize: 32,
        width: 625,
        row: 1
      },

    ]

    //循环产品块
    detail.list.map((item, index) => {
      canvasData.push(
        {
          type: 'shape',
          shape: 'round',
          background: '#f2f2f2',
          x: 30,
          y: 60 + 100 + 60 + 50 + (index * 270),  //分割线
          width: 690 - 30 - 30,
          height: 2
        },
        {
          type: 'text',
          content: item.name, // 产品块的--产品名
          x: 30,
          y: 60 + 100 + 60 + 50 + 30 + (index * 270),
          textAlign: 'left',
          color: '#000000',
          fontSize: 38,
          bold: '550',
          width: 450,
          row: 1
        },

        {
          type: 'text',
          content: item.brief, // 产品块的--简介
          x: 30,
          y: 60 + 100 + 60 + 50 + 30 + 50 + (index * 270),
          textAlign: 'left',
          color: '#000000',
          fontSize: 24,
          width: 450,
          row: 1
        },
        {
          type: 'img',
          content: item.img, // 产品二维码图
          x: 690 - 30 - 180,
          y: 60 + 100 + 60 + 50 + 30 + (index * 270),
          width: 180,
          height: 180
        },
        {
          type: 'text',
          content: detail.imgMsg, // 产品二维码图--说明字段
          x: 690 - 30 - 180 + 20 + 3,
          y: 60 + 100 + 60 + 50 + 30 + 180 + 20 + (index * 270),
          textAlign: 'left',
          color: '#000000',
          fontSize: 18,
          width: 180,
          row: 1
        },
      )
      //循环规格
      item.specificationList.map((its, ind) => {
        if (!its.value || its.value == "") {
          return
        }
        canvasData.push(
          {
            type: 'text',
            content: its.specification, // 规格--名称
            x: 30,
            y: 60 + 100 + 60 + 50 + 30 + 40 + 50 + (ind * 50) + 12 + (index * 270),
            textAlign: 'left',
            color: '#000000',
            fontSize: 24,
            width: 290,
            row: 1
          },
          {
            type: 'text',
            content: "¥",
            x: 30 + 290 + 20,
            y: 60 + 100 + 60 + 50 + 30 + 40 + 50 + (ind * 50) + 12 + (index * 270),
            textAlign: 'left',
            color: '#000000',
            fontSize: 24,
            width: 20,
            row: 1
          },
          {
            type: 'text',
            content: its.value, // 规格--价格
            x: 30 + 290 + 20 + 16,
            y: 60 + 100 + 60 + 50 + 30 + 40 + 50 + (ind * 50) + (index * 270),
            textAlign: 'left',
            color: '#000000',
            fontSize: 40,
            width: 160,
            row: 1
          },
        )
      })
      canvasData.push({
        type: 'img',
        content: detail.bottomImg, // 产品底部图
        x: 0,
        y: 1200 - 80,
        width: 690,
        height: 80
      })
    })


    //加载poster
    this.poster.show({
      shape: {
        background: '#fff',
        width: 690,
        height: 1200
      },
      canvasData: canvasData,
      canvasId: new Date().getTime(),
      canvasText: '保存图片到相册'
    })

  },

  //获取每个产品
  getItem(item) {
    console.log(item);
    let list = this.data.list
    item.specificationList =  item.goodsProductList
    if(item.specificationList.length == 0){
      item.specificationList.push({
        value:'',
        specification:'',
      })
    }else{
      item.specificationList.map(a=>{
        a.value = a.price + '' + a.company
        a.specification = a.name
      })
    }
    list.push(item)
    this.setData({
      list
    }, this.getCode(item.id, (url) => {
      list.map(its => {
        if (its.id == item.id) {
          item.img = url
        }
      })
      this.setData({
        list
      })
    }))
  },
  removeItem(e) {
    let list = this.data.list
    let id = e.currentTarget.dataset.id   //是哪个产品
    list  = list.filter(item => {
      return item.id != id
    })
    console.log(list);
    this.setData({
      list
    })
  },
  getCode(id, callback) { // 获取二维码
    http.GET({
      url: config.apiUrl + '/wx/jz/getCode?goodsId=' + id + '&page=pages/productDetails/index',
      success: res => {
        callback(res.data)
      }
    })
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