const app = getApp();
const { loadChapterProgress } = require('../../utils/progress');

const STATUS_LABEL = {
  'sample-ready': '完整',
  draft: '草稿',
  planned: '待整理',
};

Page({
  data: {
    volumes: [],
    loading: true,
  },
  onLoad() {
    this._buildData();
  },
  onShow() {
    // Refresh progress every time the page is shown
    this._buildData();
  },
  _buildData() {
    const { volumes, chapters } = app.globalData;
    const enriched = volumes.map(vol => ({
      ...vol,
      chapters: vol.chapters.map(ch => {
        const chData = chapters[ch.id];
        const prog = chData ? loadChapterProgress(chData) : { studiedCount: 0, totalCount: 0, pct: 0 };
        return {
          ...ch,
          statusLabel: STATUS_LABEL[ch.status] || ch.status,
          studiedCount: prog.studiedCount,
          totalCount: prog.totalCount,
          pct: prog.pct,
          hasProgress: prog.studiedCount > 0,
        };
      }),
    }));
    this.setData({ volumes: enriched, loading: false });
  },
  goToChapter(e) {
    wx.navigateTo({ url: '/pages/chapter/chapter?chapterId=' + e.currentTarget.dataset.id });
  },
  goToSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' });
  },
});
