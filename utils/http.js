const config = require("../config.js")

//GET请求
function GET(requestHandler) {
  request('GET', requestHandler)
}
//POST请求
function POST(requestHandler) {
  request('POST', requestHandler)
}
//PUT请求
function PUT(requestHandler) {
  request('PUT', requestHandler)
}

function request(method, requestHandler) {
  wx.showLoading()
  //注意：可以对params加密等处理
  var params = requestHandler.params;
  var tokenData = wx.getStorageSync("token") || '';
  var switchType = wx.getStorageSync("switchType") || 1;
  wx.request({
    url: requestHandler.url,
    data: params,
    header: {
      Authorization: tokenData,
      switchType: switchType,
    },
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    success: function (res) {
      //注意：可以对参数解密等处理
      if (res.data.errno != 0) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: res.data.errmsg,
        })
      } else {
        requestHandler.success(res.data);
      }
    },
    fail:  res => {
      wx.showModal({
        title: '请求失败,请稍后重试',
        showCancel: false,
      })
      console.log("error=>", res);
    },
    complete: res => {
      wx.hideNavigationBarLoading();
      wx.hideLoading()
    }
  })
}

module.exports = {
  GET: GET,
  POST: POST,
  PUT: PUT
}