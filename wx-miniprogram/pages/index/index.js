const app = getApp();
const { loadChapterProgress, loadKpProgress } = require('../../utils/progress');

const STATUS_LABEL = {
  'sample-ready': '完整',
  draft: '草稿',
  planned: '待整理',
};

Page({
  data: {
    volumes: [],
    recentKp: null,   // { chapterId, kpId, chapterTitle, kpTitle, chapterNum }
    loading: true,
  },
  onLoad() {
    this._buildData();
  },
  onShow() {
    this._buildData();
  },
  _buildData() {
    const { volumes, chapters } = app.globalData;

    // Find most recently studied KP
    let recentKp = null;
    let latestTs = 0;
    for (const vol of volumes) {
      for (const ch of vol.chapters) {
        const chData = chapters[ch.id];
        if (!chData) continue;
        for (const kp of chData.knowledgePoints) {
          const prog = loadKpProgress(ch.id, kp.id);
          if (prog.studied && (prog.lastStudied || 0) > latestTs) {
            latestTs = prog.lastStudied || 0;
            recentKp = {
              chapterId: ch.id,
              kpId: kp.id,
              chapterNum: ch.number,
              chapterTitle: ch.title,
              kpTitle: kp.title,
            };
          }
        }
      }
    }

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

    this.setData({ volumes: enriched, recentKp, loading: false });
  },
  goToChapter(e) {
    wx.navigateTo({ url: '/pages/chapter/chapter?chapterId=' + e.currentTarget.dataset.id });
  },
  continueStudy() {
    const { recentKp } = this.data;
    if (!recentKp) return;
    wx.navigateTo({
      url: '/pages/study/study?chapterId=' + recentKp.chapterId + '&kpId=' + recentKp.kpId,
    });
  },
  goToSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' });
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
