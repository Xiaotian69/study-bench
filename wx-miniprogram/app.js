let allChapters = { volumes: [], chapters: {} };
try {
  allChapters = require('./data/all-chapters');
} catch (e) {
  console.error('[math-analysis] Data not built. Run: node scripts/build-wx-data.js');
}

App({
  globalData: {
    volumes: allChapters.volumes,
    chapters: allChapters.chapters,
    currentKp: null,   // { chapterId, kpId } — set when entering study page
  },
  onLaunch() {
    const onboarded = wx.getStorageSync('ma_onboarded');
    if (!onboarded) {
      // Delay so the app frame finishes mounting before redirect
      setTimeout(() => {
        wx.redirectTo({ url: '/pages/onboarding/onboarding' });
      }, 100);
    }
  }
});
