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

function nowTs() { return Date.now(); }

function fmtTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return h + ':' + m;
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
    hasError: false,
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
      ? saved.map(m => ({ ...m, timeLabel: fmtTime(m.ts) }))
      : [{ role: 'assistant', content: buildOpeningMessage(kp), ts: nowTs(), timeLabel: fmtTime(nowTs()) }];

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

    const ts = nowTs();
    const userMsg = { role: 'user', content: inputText.trim(), ts, timeLabel: fmtTime(ts) };
    const newMessages = [...messages, userMsg];
    wx.vibrateShort({ type: 'light' });
    this.setData({ messages: newMessages, inputText: '', sending: true, hasError: false });
    this._scrollToBottom(true);
    this._sendToApi(newMessages, kp);
  },
  _sendToApi(messages, kp) {
    const { chapterId, kpId } = this.data;
    chatRequest(messages, kp, {
      onSuccess: (reply) => {
        const replyTs = nowTs();
        const updated = [
          ...this.data.messages,
          { role: 'assistant', content: reply, ts: replyTs, timeLabel: fmtTime(replyTs) },
        ];
        this.setData({ messages: updated, sending: false, hasError: false });
        saveChat(chapterId, kpId, updated);
        this._scrollToBottom(true);
      },
      onError: (msg) => {
        this.setData({ sending: false, hasError: true, lastErrorMsg: msg });
        this._scrollToBottom(true);
      },
    });
  },
  retryLastMessage() {
    const { messages, kp, sending } = this.data;
    if (sending) return;
    // Remove any trailing error-placeholder messages and retry
    const userMessages = messages.filter(m => m.role === 'user');
    if (!userMessages.length) return;
    this.setData({ sending: true, hasError: false });
    this._sendToApi(messages, kp);
  },
  clearChat() {
    wx.showModal({
      title: '重置对话',
      content: '清除本次对话记录，重新开始？',
      success: (res) => {
        if (!res.confirm) return;
        const opening = buildOpeningMessage(this.data.kp);
        const ts = nowTs();
        const messages = [{ role: 'assistant', content: opening, ts, timeLabel: fmtTime(ts) }];
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
