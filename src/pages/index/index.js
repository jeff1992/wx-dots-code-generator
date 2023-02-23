// index.js

// 获取应用实例
const app = getApp()

Page({
  data: {
    rows: 16,
    cols: 16,
    hexCode: '',
    binCode: '',
    orgHexCode: '',
    orgBinCOde: '',
    leds: []
  },
  onLoad() {
    this.generateLeds()
    this.generateCode()
  },
  onLedTap(e) {
    let {cols, leds} = this.data
    let row = e.currentTarget.dataset.row * 1
    let col = e.currentTarget.dataset.col * 1
    let index = row * cols + col
    let led = leds[index]
    this.setData({
      [`leds[${index}].on`]: !led.on
    })
    this.generateCode()
  },
  onColsChanged(e) {
    let cols = e.detail * 1
    this.setData({ cols })
    this.generateLeds()
    this.generateCode()
  },
  onRowsChanged(e) {
    let rows = e.detail * 1
    this.setData({ rows })
    this.generateLeds()
    this.generateCode()
  },
  generateLeds() {
    let leds = []
    let {rows, cols} = this.data
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        leds.push({
          on: false
        })
      }
    }
    this.setData({ leds })
  },
  generateCode() {
    let {rows, cols, leds} = this.data
    let hexLines = [], binLines = [], orgHexCOde = '', orgBinCOde = ''
    for (let row = 0; row < rows; row++) {
      let hexLine = '', binLine = ''
      for (let col = 0; col < cols; col+=8) {
        let val = 0
        for (let i = 0; i < 8; i++) {
          val <<= 1
          let index = row * cols + col + i
          if (leds[index].on)
            val |= 1
        }
        hexLine += ('0x' + val.toString(16).padStart(2, '0'))
        hexLine += ', '

        binLine += ('0b' + val.toString(2).padStart(8, '0'))
        binLine += ', '
      }
      hexLines.push(hexLine)
      binLines.push(binLine)
    }
    this.setData({
      hexCode: hexLines.map(m => `<div>${m}</div>`).join(''),
      binCode: binLines.map(m => `<div>${m}</div>`).join(''),
      orgHexCode: hexLines.join('\r\n'),
      orgBinCode: binLines.join('\r\n')
    })
  },
  copyHexCode() {
    wx.setClipboardData({
      data: this.data.orgHexCode,
      success: () => {
        wx.showToast({
          title: '复制成功'
        })
      }
    })
  },
  copyBinCode() {
    wx.setClipboardData({
      data: this.data.binCode,
      success: () => {
        wx.showToast({
          title: '复制成功'
        })
      }
    })
  },
  onShareAppMessage() {
    
  }
})
