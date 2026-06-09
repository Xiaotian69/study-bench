Page({
  data: {
    current: 0,
    slides: [
      {
        icon: '∫',
        title: '数学分析',
        subtitle: '大学本科·完整讲义',
        body: '22章覆盖实数到曲面积分，93个知识点，214道练习，体系完整、层次清晰。',
      },
      {
        icon: '✎',
        title: '系统练习',
        subtitle: '做题·批改·追踪',
        body: '每节附例题与练习，AI 即时批改并给出详细评分，学习进度一目了然。',
      },
      {
        icon: '≈',
        title: 'AI 答疑',
        subtitle: '苏格拉底式对话',
        body: '遇到不懂的知识点？AI 助教不给答案，而是引导你自己推导出来——真正学会，不是背会。',
      },
    ],
  },
  onChange(e) {
    this.setData({ current: e.detail.current });
  },
  next() {
    const { current, slides } = this.data;
    if (current < slides.length - 1) this.setData({ current: current + 1 });
  },
  start() {
    wx.setStorageSync('ma_onboarded', true);
    wx.redirectTo({ url: '/pages/index/index' });
  },
  skip() {
    wx.setStorageSync('ma_onboarded', true);
    wx.redirectTo({ url: '/pages/index/index' });
  },
});
