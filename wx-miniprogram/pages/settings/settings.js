const { loadApiKeyOverride, saveApiKeyOverride } = require('../../utils/progress');
const defaultConfig = require('../../config');

Page({
  data: {
    apiKey: '',
    hasOverride: false,
    saved: false,
  },
  onLoad() {
    const override = loadApiKeyOverride();
    this.setData({
      apiKey: override || '',
      hasOverride: !!override,
    });
  },
  onKeyInput(e) {
    this.setData({ apiKey: e.detail.value, saved: false });
  },
  saveKey() {
    const { apiKey } = this.data;
    const trimmed = apiKey.trim();
    saveApiKeyOverride(trimmed || null);
    this.setData({
      apiKey: trimmed,
      hasOverride: !!trimmed,
      saved: true,
    });
    wx.showToast({ title: trimmed ? '已保存' : '已重置为默认', icon: 'success', duration: 1500 });
  },
  resetKey() {
    wx.showModal({
      title: '重置 API Key',
      content: '清除自定义 Key，使用内置默认 Key？',
      success: (res) => {
        if (!res.confirm) return;
        saveApiKeyOverride(null);
        this.setData({ apiKey: '', hasOverride: false, saved: false });
        wx.showToast({ title: '已重置', icon: 'success', duration: 1500 });
      },
    });
  },
  maskKey(key) {
    if (!key || key.length < 8) return key;
    return key.slice(0, 5) + '·'.repeat(8) + key.slice(-4);
  },
});
