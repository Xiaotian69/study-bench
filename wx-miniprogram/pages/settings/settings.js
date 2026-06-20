const { loadApiKeyOverride, saveApiKeyOverride, loadChapterProgress, loadExerciseAttempts, clearAllProgress } = require('../../utils/progress');
const defaultConfig = require('../../config');

Page({
  data: {
    apiKey: '',
    hasOverride: false,
    saved: false,
    stats: null,  // { kpStudied, kpTotal, exAttempted, avgScore }
  },
  onLoad() {
    const override = loadApiKeyOverride();
    this.setData({
      apiKey: override || '',
      hasOverride: !!override,
    });
    this._computeStats();
  },
  _computeStats() {
    const app = getApp();
    const { volumes, chapters } = app.globalData;
    if (!volumes || !volumes.length) return;
    let kpStudied = 0, kpTotal = 0, exAttempted = 0, scoreSum = 0, scoreCount = 0;
    for (const vol of volumes) {
      for (const ch of vol.chapters) {
        const chData = chapters[ch.id];
        if (!chData) continue;
        const prog = loadChapterProgress(chData);
        kpStudied += prog.studiedCount;
        kpTotal += prog.totalCount;
        if (prog.avgScore != null) { scoreSum += prog.avgScore; scoreCount++; }
        for (const kp of chData.knowledgePoints) {
          for (const ex of kp.exercises) {
            if (loadExerciseAttempts(ex.id).length > 0) exAttempted++;
          }
        }
      }
    }
    this.setData({
      stats: {
        kpStudied,
        kpTotal,
        exAttempted,
        avgScore: scoreCount > 0 ? Math.round(scoreSum / scoreCount) : null,
      },
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
  resetProgress() {
    wx.showModal({
      title: '清空学习记录',
      content: '将清除所有已学进度、练习记录和聊天记录（不影响 API Key）。此操作不可撤销。',
      confirmText: '清空',
      confirmColor: '#c62828',
      success: (res) => {
        if (!res.confirm) return;
        clearAllProgress();
        this.setData({ stats: null });
        wx.showToast({ title: '已清空', icon: 'success', duration: 2000 });
      },
    });
  },
  maskKey(key) {
    if (!key || key.length < 8) return key;
    return key.slice(0, 5) + '·'.repeat(8) + key.slice(-4);
  },
  shareApp() {
    wx.showShareMenu({ withShareTicket: false, menus: ['shareAppMessage', 'shareTimeline'] });
  },
  onShareAppMessage() {
    return {
      title: '数学分析学习助手 — 22章完整讲义 · AI批改练习',
      path: '/pages/index/index',
    };
  },
  onShareTimeline() {
    return { title: '数学分析：AI辅助的大学数学学习小程序' };
  },
});
