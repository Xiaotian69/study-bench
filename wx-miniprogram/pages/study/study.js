const app = getApp();
const { gradeRequest } = require('../../utils/api');
const {
  markKpStudied,
  saveExerciseAttempt,
  getBestScore,
  loadKpProgress,
} = require('../../utils/progress');

Page({
  data: {
    chapter: null,
    kp: null,
    chapterId: '',
    kpId: '',
    kpIndex: 0,
    totalKps: 0,
    // Progress
    kpProgress: {},
    // Collapsibles
    showSocratic: false,
    showMistakes: false,
    // Tabs
    activeTab: 'learn', // 'learn' | 'exercise'
    // Exercise list — enriched with best score
    exercisesWithScore: [],
    exFilter: 'all', // 'all' | 'basic' | 'medium' | 'advanced' | 'todo'
    filteredExercises: [],
    // Exercise workspace
    selectedExIndex: -1,
    selectedEx: null,
    answer: '',
    hintLevel: 0,
    gradingStatus: 'idle', // 'idle' | 'submitting' | 'success' | 'error'
    gradingError: '',
    gradeResult: null,
    showRubric: false,
  },

  onLoad(options) {
    const { chapterId, kpId } = options;
    this._load(chapterId, kpId);
  },

  _load(chapterId, kpId) {
    const chapter = app.globalData.chapters[chapterId];
    if (!chapter) { wx.showToast({ title: '章节不存在', icon: 'error' }); return; }
    const kpIndex = chapter.knowledgePoints.findIndex(k => k.id === kpId);
    if (kpIndex < 0) { wx.showToast({ title: '知识点不存在', icon: 'error' }); return; }
    const kp = chapter.knowledgePoints[kpIndex];
    wx.setNavigationBarTitle({ title: kp.title });

    // Mark as studied
    markKpStudied(chapterId, kpId);
    const kpProgress = loadKpProgress(chapterId, kpId);

    // Enrich exercises with best score
    const exercisesWithScore = kp.exercises.map(ex => ({
      ...ex,
      bestScore: getBestScore(ex.id),
      diffLabel: ex.difficulty === 'basic' ? '基础' : ex.difficulty === 'medium' ? '中档' : '提升',
    }));

    this.setData({
      chapter,
      kp,
      chapterId,
      kpId,
      kpIndex,
      totalKps: chapter.knowledgePoints.length,
      kpProgress,
      exercisesWithScore,
      filteredExercises: exercisesWithScore,
      exFilter: 'all',
      showSocratic: false,
      showMistakes: false,
      activeTab: 'learn',
      selectedExIndex: -1,
      selectedEx: null,
      answer: '',
      hintLevel: 0,
      gradingStatus: 'idle',
      gradingError: '',
      gradeResult: null,
      showRubric: false,
    });
  },

  // ── Tab ──────────────────────────────────────────────────────
  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
  },

  // ── Collapsibles ─────────────────────────────────────────────
  toggleSocratic() { this.setData({ showSocratic: !this.data.showSocratic }); },
  toggleMistakes() { this.setData({ showMistakes: !this.data.showMistakes }); },

  // ── KP Navigation ────────────────────────────────────────────
  goPrevKp() {
    const { chapter, kpIndex } = this.data;
    if (kpIndex <= 0) return;
    wx.vibrateShort({ type: 'light' });
    const prev = chapter.knowledgePoints[kpIndex - 1];
    this._load(chapter.id, prev.id);
    wx.pageScrollTo({ scrollTop: 0, duration: 150 });
  },
  goNextKp() {
    const { chapter, kpIndex, totalKps } = this.data;
    if (kpIndex >= totalKps - 1) return;
    wx.vibrateShort({ type: 'light' });
    const next = chapter.knowledgePoints[kpIndex + 1];
    this._load(chapter.id, next.id);
    wx.pageScrollTo({ scrollTop: 0, duration: 150 });
  },

  // ── Exercise filter ──────────────────────────────────────────
  setExFilter(e) {
    const filter = e.currentTarget.dataset.filter;
    const { exercisesWithScore } = this.data;
    let filtered;
    if (filter === 'all') {
      filtered = exercisesWithScore;
    } else if (filter === 'todo') {
      filtered = exercisesWithScore.filter(ex => ex.bestScore == null);
    } else {
      filtered = exercisesWithScore.filter(ex => ex.difficulty === filter);
    }
    this.setData({ exFilter: filter, filteredExercises: filtered });
  },

  // ── Exercises ────────────────────────────────────────────────
  selectExercise(e) {
    const index = parseInt(e.currentTarget.dataset.index, 10);
    const ex = this.data.kp.exercises[index];
    if (!ex || index < 0) return;
    this.setData({
      selectedExIndex: index,
      selectedEx: ex,
      answer: '',
      hintLevel: 0,
      gradingStatus: 'idle',
      gradingError: '',
      gradeResult: null,
      showRubric: false,
    });
    wx.pageScrollTo({ scrollTop: 0, duration: 150 });
  },
  backToList() {
    this.setData({ selectedExIndex: -1, selectedEx: null });
    wx.pageScrollTo({ scrollTop: 0, duration: 150 });
  },
  onAnswerInput(e) {
    this.setData({ answer: e.detail.value });
  },
  getHint() {
    const { selectedEx, hintLevel } = this.data;
    if (!selectedEx || hintLevel >= selectedEx.hints.length) return;
    wx.vibrateShort({ type: 'light' });
    this.setData({ hintLevel: hintLevel + 1 });
  },
  toggleRubric() {
    this.setData({ showRubric: !this.data.showRubric });
  },
  submitForGrading() {
    const { selectedEx, answer, chapterId, kpId } = this.data;
    if (!selectedEx) return;
    if (!answer.trim()) {
      wx.showToast({ title: '请先写下解答', icon: 'none', duration: 1500 });
      return;
    }
    this.setData({ gradingStatus: 'submitting', gradingError: '', gradeResult: null });

    gradeRequest(selectedEx, answer, {
      onSuccess: (result) => {
        saveExerciseAttempt(chapterId, kpId, selectedEx.id, result);
        // Refresh exercise list scores
        const exercisesWithScore = this.data.kp.exercises.map(ex => ({
          ...ex,
          bestScore: getBestScore(ex.id),
          diffLabel: ex.difficulty === 'basic' ? '基础' : ex.difficulty === 'medium' ? '中档' : '提升',
        }));
        // Re-apply current filter
        const { exFilter } = this.data;
        const filteredExercises = exFilter === 'all' ? exercisesWithScore
          : exFilter === 'todo' ? exercisesWithScore.filter(ex => ex.bestScore == null)
          : exercisesWithScore.filter(ex => ex.difficulty === exFilter);
        const VERDICT_TITLES = {
          excellent: '非常棒！',
          good: '做得不错',
          partial: '部分正确',
          incorrect: '还需改进',
        };
        const enriched = { ...result, verdictTitle: VERDICT_TITLES[result.verdict] || '批改完成' };
        wx.vibrateShort({ type: 'medium' });
        this.setData({
          gradeResult: enriched,
          gradingStatus: 'success',
          exercisesWithScore,
          filteredExercises,
        });
        wx.pageScrollTo({ selector: '#grade-result', duration: 300 });
      },
      onError: (msg) => {
        this.setData({ gradingStatus: 'error', gradingError: 'AI 批改暂时不可用：' + msg });
      },
    });
  },

  // ── Chat ─────────────────────────────────────────────────────
  goToChat() {
    const { chapter, kp } = this.data;
    if (!chapter || !kp) return;
    wx.navigateTo({ url: '/pages/chat/chat?chapterId=' + chapter.id + '&kpId=' + kp.id });
  },
});
