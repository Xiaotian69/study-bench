const app = getApp();
const { loadKpProgress } = require('../../utils/progress');

Page({
  data: {
    chapter: null,
    loading: true,
  },
  onLoad(options) {
    this._load(options.chapterId);
  },
  onShow() {
    // Refresh progress badges when returning from study page
    if (this.data.chapter) {
      this._refreshProgress();
    }
  },
  _load(chapterId) {
    const chapter = app.globalData.chapters[chapterId];
    if (!chapter) {
      wx.showToast({ title: '章节不存在', icon: 'error' });
      return;
    }
    wx.setNavigationBarTitle({ title: chapter.title });
    this.setData({ chapter: this._enrich(chapter), loading: false });
  },
  _enrich(chapter) {
    const kps = chapter.knowledgePoints.map(kp => {
      const prog = loadKpProgress(chapter.id, kp.id);
      return {
        ...kp,
        studied: !!prog.studied,
        bestScore: prog.bestExScore != null ? prog.bestExScore : null,
        exercisesAttempted: prog.exercisesAttempted || 0,
      };
    });
    const studiedCount = kps.filter(k => k.studied).length;
    return { ...chapter, knowledgePoints: kps, studiedCount };
  },
  _refreshProgress() {
    const chapter = app.globalData.chapters[this.data.chapter.id];
    if (chapter) this.setData({ chapter: this._enrich(chapter) });
  },
  goToStudy(e) {
    const { kpid, chapterid } = e.currentTarget.dataset;
    wx.navigateTo({ url: '/pages/study/study?chapterId=' + chapterid + '&kpId=' + kpid });
  },
});
