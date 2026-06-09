const app = getApp();
const { chatRequest } = require('../../utils/api');
const { saveChat, loadChat } = require('../../utils/progress');

function buildOpeningMessage(kp) {
  if (!kp) return '你好！我是你的数学分析 AI 助教。有什么想问的？';
  const goal = kp.learningGoals && kp.learningGoals.length ? kp.learningGoals[0] : '';
  return '你好！我们今天学习「' + kp.title + '」。' +
    (goal ? '本节核心目标：' + goal + '。' : '') +
    '\n\n这个知识点你目前哪里还不太清楚？或者想从哪里开始？';
}

Page({
  data: {
    kp: null,
    kpTitle: '',
    chapterId: '',
    kpId: '',
    messages: [],
    inputText: '',
    sending: false,
    scrollTop: 0,
    _lastScrollTop: 0,
  },
  onLoad(options) {
    const { chapterId, kpId } = options;
    const chapter = app.globalData.chapters[chapterId];
    const kp = chapter && chapter.knowledgePoints.find(k => k.id === kpId);
    const title = kp ? kp.title : 'AI 老师';
    wx.setNavigationBarTitle({ title: 'AI 老师 · ' + title });

    // Try to restore previous chat session for this KP
    const saved = loadChat(chapterId, kpId);
    const messages = (saved && saved.length > 0)
      ? saved
      : [{ role: 'assistant', content: buildOpeningMessage(kp) }];

    this.setData({
      kp: kp || null,
      kpTitle: title,
      chapterId,
      kpId,
      messages,
    });
    this._scrollToBottom(false);
  },
  onInputChange(e) {
    this.setData({ inputText: e.detail.value });
  },
  sendMessage() {
    const { inputText, messages, kp, sending } = this.data;
    if (sending || !inputText.trim()) return;

    const userMsg = { role: 'user', content: inputText.trim() };
    const newMessages = [...messages, userMsg];
    this.setData({ messages: newMessages, inputText: '', sending: true });
    this._scrollToBottom(true);

    chatRequest(newMessages, kp, {
      onSuccess: (reply) => {
        const updated = [...this.data.messages, { role: 'assistant', content: reply }];
        this.setData({ messages: updated, sending: false });
        saveChat(this.data.chapterId, this.data.kpId, updated);
        this._scrollToBottom(true);
      },
      onError: (msg) => {
        const updated = [
          ...this.data.messages,
          { role: 'assistant', content: '⚠️ ' + msg + '\n\n请检查网络或稍后重试。' },
        ];
        this.setData({ messages: updated, sending: false });
        this._scrollToBottom(true);
      },
    });
  },
  clearChat() {
    wx.showModal({
      title: '重置对话',
      content: '清除本次对话记录，重新开始？',
      success: (res) => {
        if (!res.confirm) return;
        const opening = buildOpeningMessage(this.data.kp);
        const messages = [{ role: 'assistant', content: opening }];
        this.setData({ messages, inputText: '', sending: false });
        saveChat(this.data.chapterId, this.data.kpId, messages);
        this._scrollToBottom(false);
      },
    });
  },
  _scrollToBottom(animate) {
    // Use query to get actual scroll height
    const query = this.createSelectorQuery();
    query.select('.messages-inner').boundingClientRect();
    query.select('.messages-area').boundingClientRect();
    query.exec((res) => {
      if (!res[0] || !res[1]) return;
      const innerHeight = res[0].height;
      const areaHeight = res[1].height;
      const newTop = Math.max(0, innerHeight - areaHeight + 100);
      if (newTop !== this.data._lastScrollTop) {
        this.setData({ scrollTop: newTop, _lastScrollTop: newTop });
      }
    });
  },
});
