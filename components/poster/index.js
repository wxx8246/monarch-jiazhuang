// show() = init() 参数详解 
// canvasData 绘制对象数组
// cover canvas背景图
// canvasId 海报id 非必须，id可缓存图片
// data.path 当前缓存的图片路径 store[0].path id缓存的图片路径

let app = getApp();

Component({
  data: {
    id: 'poster', //canvas的id
    showPoster: false,
    store: {},
    hidden: true,
    num: 0, // 当前第个图片
    imageUrlNum: 1, // 海报图片数量
    collectCls: 'love-o',
    canvasText: '', // 保存图片文字
    isSaveAll: false, // 是否保存全部图片
  },
  externalClasses: ['poster-class', 'poster-save-class', 'poster-share-class'],
  properties: {
    shareText: {
      type: String,
      value: ''
    },
  },

  methods: {
    /**复制内容至粘贴板 */
    copyTipText() {
      let {
        shareText
      } = this.data
      wx.setClipboardData({
        data: shareText || '这个真的不错，我已经领了，扫码就能领，另外活动的力度也很大，需要的朋友可以报名参加活动哦',
      })
    },
    // 初始化函数
    init(res) {
      let bol = false
      if (!res.saveAlling) {
        if (this.data.store[res.canvasId]) {
          bol = true
          this.setData({
            path: this.data.store[res.canvasId].path,
            canvasWidth: value.canvasWidth,
            canvasHeight: value.canvasHeight
          })
          wx.hideToast()
        }
      }
      if (!bol) {

        try {
          if (res.toast) {
            wx.showToast({
              title: '生成海报中',
              icon: 'loading',
              mask: true,
              duration: 10000
            })
          }
          if (this.data.hidden) this.setData({
            hidden: false
          })
          if (res.canvasData) this._asyncImage(res.canvasData)
          this._drawPoster(res)
        } catch (err) {
          if (res.fail && typeof (res.fail) === "function") {
            res.fail({
              msg: err.message
            })
          }
        }
      } else if (this.data.path && bol) {
        if (res.toast) {
          this.setData({
            showPoster: true
          })
        }
        if (res.success && typeof (res.success) === "function") {
          res.success({
            data: this.data
          })


        }
      }
    },
    stop() {},
    loadNextPoster() {
      let {
        imageUrlNum,
        num
      } = this.data
      num++
      console.log(num, imageUrlNum)
      if (num == imageUrlNum) {
        return
      }
      this.setData({
        num
      })
      this.triggerEvent('parentEvent', {
        num
      })
    },
    loadLastPoster() {
      let {
        num
      } = this.data
      num--
      console.log(num)
      if (num < 0) {
        return
      }
      this.setData({
        num
      })
      this.triggerEvent('parentEvent', {
        num
      })
    },
    savePoster() {
      let that = this
      if (that.data.path) {
        wx.saveImageToPhotosAlbum({
          filePath: that.data.path,
          success: () => {
            wx.hideToast()
            wx.showModal({
              title: '海报保存成功',
              showCancel: false,
              content: '海报已成功保存到手机相册~'
            })
            that.triggerEvent('savePoster')
          },
          fail: (err) => {
            wx.hideToast()
            if (err.errMsg.indexOf('auth') > -1) {
              wx.showModal({
                title: '提示',
                content: '需要您授权相册权限后才能保存，请打开权限',
                showCancel: false,
                confirmText: '好',
                success: res => {
                  wx.openSetting()
                }
              })
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '您当前微信版本不支持使用该功能，请升级到最新微信版本后重试。'
        })
      }
    },
    saveAllPoster() {
      this.setData({
        num: 0
      })
      this.triggerEvent('parentEvent', {
        saveAlling: true,
        num: 0
      })
    },
    _bindOpenSetting(res) {
      if (res.detail.authSetting['scope.writePhotosAlbum']) {
        wx.showToast({
          title: '现可保存图片了~',
          icon: 'success'
        })
        this.setData({
          openSetting: false
        })
      }
    },
    show(res) {
      if (res) {
        this.init({
          ...res,
          id: `poster${res.canvasId||0}`,
          toast: true
        })
        return
      }
      this.setData({
        showPoster: true
      })
    },
    close() {
      this.setData({
        showPoster: false,
        num: 0,
        store: {}
      })
      this.triggerEvent('closePoster')
    },
    // 微信获取图片文件路径
    _downLoadPosterImg(url) {
      url += `?r=${+new Date()}`
      let promise = new Promise((resolve, reject) => {
        wx.downloadFile({
          url,
          success: (res) => {
            resolve(res.tempFilePath);
          },
          fail: (err) => {
            console.log(err, 'err');
            reject(err)
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: err.errMsg,
            })
          }
        })
      })
      return promise;
    },

    // 生成海报
    _drawPoster(query) {
      let that = this
      let ctx = wx.createCanvasContext(that.data.id, that)

      if (query.cover) {

        that._downLoadPosterImg(query.cover.url).then((res) => {
          wx.getImageInfo({
            src: res,
            success(value) {

              let imgWidth = value.width
              let imgHeight = value.height
              let width = query.cover.width ? that._convertRPXToPx(query.cover.width) : that.data.canvasWidth
              ctx.setTextBaseline('top')

              that.setData({
                canvasWidth: width,
                canvasHeight: imgHeight * (width / imgWidth)
              })
              // 画背景图片
              ctx.drawImage(res, 0, 0, that.data.canvasWidth, that.data.canvasHeight)

              Promise.all(that.asyncImage).then(() => {
                that._drawing(query, ctx)
              }).catch(err => {
                console.error(err)
              })
            }
          })
        })
      } else if (query.shape) {

        let height = query.shape.height ? that._convertRPXToPx(query.shape.height) : that.data.canvasHeight
        let width = query.shape.width ? that._convertRPXToPx(query.shape.width) : that.data.canvasWidth
        ctx.setTextBaseline('top')

        that.setData({
          canvasWidth: width,
          canvasHeight: height
        })
        ctx.setFillStyle(query.shape.background)
        ctx.fillRect(0, 0, width, height)
        Promise.all(that.asyncImage).then(() => {
          that._drawing(query, ctx)
        }).catch(err => {
          console.error(err)
        })
      }

    },

    _drawing(query, ctx) {
      console.log('_drawing', query.num, query.saveAlling)
      let that = this
      let convertRPXToPx = that._convertRPXToPx
      that.setData({
        imageUrlNum: query.imageUrlNum || 1,
        num: query.num || 0,
        saveAlling: query.saveAlling || false,
        isSaveAll: query.isSaveAll || false,
        canvasId: query.canvasId,
        canvasText: query.canvasText
      })

      // 绘制canvasData
      if (query.canvasData) {
        query.canvasData.forEach(value => {
          switch (value.type) {
            case 'img':
              ctx.save()
              ctx.beginPath()
              if (value.border == 'circle') {
                let radius = value.width <= value.height ? value.width : value.height
                if (value.width >= value.height) {
                  value.x = value.x - (value.width - value.height) / 2
                } else {
                  value.y = value.y - (value.height - value.width) / 2
                }
                ctx.arc(convertRPXToPx(value.x + value.width / 2), convertRPXToPx(value.y + value.height / 2), convertRPXToPx(radius / 2), 0, 2 * Math.PI)
                ctx.setFillStyle('#fff')
                ctx.fill()
                ctx.clip()
              }
              ctx.drawImage(value.content, convertRPXToPx(value.x), convertRPXToPx(value.y), convertRPXToPx(value.width), convertRPXToPx(value.height))
              ctx.restore()
              break;
            case 'text':
              ctx.setFillStyle(value.color);
              if (value.textAlign) ctx.setTextAlign(value.textAlign);
              if (value.baseLine) ctx.setTextBaseline(value.baseLine);
              let bold = value.bold ? value.bold : 'normal'
              let family = value.family ? value.family : 'Microsoft YaHei'
              ctx.font = `${bold} ${Math.floor(convertRPXToPx(value.fontSize))}px ${family}`
              let arr = that._newline(ctx, value.content, convertRPXToPx(value.width), value.row)
              let lineHeight = value.lineHeight ? value.lineHeight : Number(value.fontSize) * 1.5
              arr.forEach((item, key) => {
                ctx.fillText(item, convertRPXToPx(value.x), convertRPXToPx(value.y + lineHeight * key))
              })
              break;
            case 'shape':
              ctx.save()
              ctx.beginPath()
              if (value.linearGradient) {
                var grad = ctx.createLinearGradient(value.linearGradient.x1,
                  value.linearGradient.y1,
                  value.linearGradient.x2,
                  value.linearGradient.y2); //创建一个渐变色线性对象
                grad.addColorStop(0, value.linearGradient.color1); //定义渐变色颜色
                grad.addColorStop(1, value.linearGradient.color2);
                ctx.setFillStyle(grad)
              } else {
                ctx.setFillStyle(value.background)
              }
              switch (value.shape) {
                case 'circle':
                  ctx.arc(convertRPXToPx(value.x), convertRPXToPx(value.y), convertRPXToPx(value.radius), 0, 2 * Math.PI)
                  ctx.fill()
                  break
                case 'rect':
                  ctx.fillRect(convertRPXToPx(value.x), convertRPXToPx(value.y), convertRPXToPx(value.width), convertRPXToPx(value.height))
                  break
                case 'round':
                  let radius = value.radius ? convertRPXToPx(value.radius) : 4
                  ctx.arc(convertRPXToPx(value.x) + radius, convertRPXToPx(value.y) + radius, radius, Math.PI, Math.PI * 3 / 2);
                  ctx.lineTo(convertRPXToPx(value.width) - radius + convertRPXToPx(value.x), convertRPXToPx(value.y));
                  ctx.arc(convertRPXToPx(value.width) - radius + convertRPXToPx(value.x), radius + convertRPXToPx(value.y), radius, Math.PI * 3 / 2, Math.PI * 2);
                  ctx.lineTo(convertRPXToPx(value.width) + convertRPXToPx(value.x), convertRPXToPx(value.height) + convertRPXToPx(value.y) - radius);
                  ctx.arc(convertRPXToPx(value.width) - radius + convertRPXToPx(value.x), convertRPXToPx(value.height) - radius + convertRPXToPx(value.y), radius, 0, Math.PI * 1 / 2);
                  ctx.lineTo(radius + convertRPXToPx(value.x), convertRPXToPx(value.height) + convertRPXToPx(value.y));
                  ctx.arc(radius + convertRPXToPx(value.x), convertRPXToPx(value.height) - radius + convertRPXToPx(value.y), radius, Math.PI * 1 / 2, Math.PI);
                  ctx.closePath();
                  ctx.fill();
                  ctx.strokeStyle = value.background;
                  ctx.stroke();
                  break;
              }
              ctx.restore()
              break;
          }
        })
      }

      ctx.draw(false, () => {
        console.log('query: ', query)
        setTimeout(() => {
          // 把canvas生成图片路径
          wx.canvasToTempFilePath({
            canvasId: 'poster',
            success: (res) => {

              that.setData({
                path: res.tempFilePath,
                showPoster: query.toast ? true : false
              })
              let store = that.data.store;
              store[query.canvasId] = {
                id: query.canvasId,
                path: res.tempFilePath,
                canvasWidth: that.data.canvasWidth,
                canvasHeight: that.data.canvasHeight,
                imageUrlNum: that.data.imageUrlNum,
                canvasText: that.data.canvasText
              }
              that.setData({
                store
              })

              if (that.data.saveAlling) {
                wx.saveImageToPhotosAlbum({
                  filePath: that.data.store[query.canvasId].path,
                  success: () => {

                    if (query.imageUrlNum - 1 === query.num) {
                      wx.showModal({
                        title: '海报已全部保存成功',
                        showCancel: false,
                        content: '海报已成功保存到手机相册~'
                      })
                    } else {
                      that.triggerEvent('parentEvent', {
                        saveAlling: true,
                        num: query.num + 1
                      })
                    }
                  },
                  fail: (err) => {
                    wx.hideToast()
                    if (err.errMsg.indexOf('auth') > -1) {
                      wx.showModal({
                        title: '提示',
                        content: '需要您授权相册权限后才能保存，请打开权限',
                        showCancel: false,
                        confirmText: '好',
                        success: res => {
                          wx.openSetting()
                        }
                      })
                    }
                  }
                })
              }
              wx.hideToast()
              if (query.success && typeof (query.success) === "function") {

                query.success({
                  data: that.data
                })
              }
            },
            fail: (err) => {

            }
          }, that)
        }, 300);
      })
    },
    _convertRPXToPx(rpx) {
      const {
        windowWidth
      } = wx.getSystemInfoSync();
      let px = rpx * windowWidth / 750;
      return px;
    },
    _newline(ctx, str, width, row) { // 自动换行
      let arr = [],
        str1 = '',
        newArr
      if (width) {
        for (let i = 0; i < str.length; i++) {
          if (i == str.length - 1) {
            let str2 = str1 + str[i]
            if (ctx.measureText(str2).width < width) {
              arr.push(str2)
            } else {
              arr.push(str1)
              str1 = str[i]
              arr.push(str1)
            }
          } else {
            let str2 = str1 + str[i]
            if (ctx.measureText(str2).width > width) {
              arr.push(str1)
              str1 = str[i]
            } else {
              str1 = str2
            }
          }
        }
      } else {
        arr.push(str)
      }
      newArr = row ? arr.slice(0, row) : arr
      if (row && arr.length > row) {
        let len = newArr[row - 1].length
        let lastStr = newArr[row - 1][len - 1]
        let pattern = new RegExp("[\u4E00-\u9FA5]+")
        newArr[row - 1] = pattern.test(lastStr) ? newArr[row - 1].substring(0, newArr[row - 1].length - 1) + '...' : newArr[row - 1].substring(0, newArr[row - 1].length - 2) + '...'
      }
      return newArr
    },
    // 处理异步加载图片问题
    _asyncImage(arr) {
      this.asyncImage = []
      console.log(arr)
      arr.forEach(value => {
        if (value.type === 'img') {
          let p = this._downLoadPosterImg(value.content).then(res => {
            value.content = res
          })
          this.asyncImage.push(p)
        }
      })
    },
    touchMove() {} //阻止默认滚动事件
  }
})