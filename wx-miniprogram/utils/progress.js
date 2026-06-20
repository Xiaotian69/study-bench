// Persistent progress tracking via wx.setStorageSync
// Key scheme: ma_progress_<chapterId>_<kpId> for KP state
//             ma_chat_<chapterId>_<kpId> for chat history
//             ma_ex_<exerciseId> for exercise attempts

const PREFIX = 'ma_';

// ── KP Progress ──────────────────────────────────────────────

function kpKey(chapterId, kpId) {
  return PREFIX + 'kp_' + chapterId + '_' + kpId;
}

/**
 * Returns { studied, exercisesAttempted, lastScore, lastStudied }
 */
function loadKpProgress(chapterId, kpId) {
  try {
    return wx.getStorageSync(kpKey(chapterId, kpId)) || {};
  } catch (e) {
    return {};
  }
}

function markKpStudied(chapterId, kpId) {
  try {
    const current = loadKpProgress(chapterId, kpId);
    wx.setStorageSync(kpKey(chapterId, kpId), {
      ...current,
      studied: true,
      lastStudied: Date.now(),
    });
  } catch (e) { /* storage might be full */ }
}

// ── Exercise Attempts ─────────────────────────────────────────

function exKey(exerciseId) {
  return PREFIX + 'ex_' + exerciseId;
}

/**
 * Returns array of { score, verdict, ts } sorted newest-first
 */
function loadExerciseAttempts(exerciseId) {
  try {
    return wx.getStorageSync(exKey(exerciseId)) || [];
  } catch (e) {
    return [];
  }
}

function saveExerciseAttempt(chapterId, kpId, exerciseId, result) {
  try {
    const attempts = loadExerciseAttempts(exerciseId);
    attempts.unshift({ score: result.score, verdict: result.verdict, ts: Date.now() });
    // Keep at most 10 attempts per exercise
    wx.setStorageSync(exKey(exerciseId), attempts.slice(0, 10));

    // Update KP progress with highest score
    const best = attempts.reduce((m, a) => Math.max(m, a.score || 0), 0);
    const current = loadKpProgress(chapterId, kpId);
    wx.setStorageSync(kpKey(chapterId, kpId), {
      ...current,
      studied: true,
      lastExScore: result.score,
      bestExScore: best,
      exercisesAttempted: (current.exercisesAttempted || 0) + 1,
      lastStudied: Date.now(),
    });
  } catch (e) { /* storage might be full */ }
}

function getBestScore(exerciseId) {
  const attempts = loadExerciseAttempts(exerciseId);
  if (!attempts.length) return null;
  return attempts.reduce((m, a) => Math.max(m, a.score || 0), 0);
}

// ── Chapter Summary ───────────────────────────────────────────

/**
 * Returns { studiedCount, totalCount, avgScore } for a chapter
 */
function loadChapterProgress(chapter) {
  const kps = chapter.knowledgePoints || [];
  let studiedCount = 0;
  let scoreSum = 0;
  let scoreCount = 0;

  for (const kp of kps) {
    const prog = loadKpProgress(chapter.id, kp.id);
    if (prog.studied) studiedCount++;
    if (prog.bestExScore != null) {
      scoreSum += prog.bestExScore;
      scoreCount++;
    }
  }

  return {
    studiedCount,
    totalCount: kps.length,
    avgScore: scoreCount > 0 ? Math.round(scoreSum / scoreCount) : null,
    pct: kps.length > 0 ? Math.round(studiedCount / kps.length * 100) : 0,
  };
}

// ── Chat History ──────────────────────────────────────────────

function chatKey(chapterId, kpId) {
  return PREFIX + 'chat_' + chapterId + '_' + kpId;
}

function saveChat(chapterId, kpId, messages) {
  try {
    // Keep last 40 messages to stay within storage limits
    wx.setStorageSync(chatKey(chapterId, kpId), messages.slice(-40));
  } catch (e) { /* storage might be full */ }
}

function loadChat(chapterId, kpId) {
  try {
    return wx.getStorageSync(chatKey(chapterId, kpId)) || null;
  } catch (e) {
    return null;
  }
}

// ── API Key Override ──────────────────────────────────────────

const API_KEY_STORAGE = PREFIX + 'apikey';

function saveApiKeyOverride(key) {
  try {
    if (key && key.trim()) {
      wx.setStorageSync(API_KEY_STORAGE, key.trim());
    } else {
      wx.removeStorageSync(API_KEY_STORAGE);
    }
  } catch (e) { /* ignore */ }
}

function loadApiKeyOverride() {
  try {
    return wx.getStorageSync(API_KEY_STORAGE) || null;
  } catch (e) {
    return null;
  }
}

// ── Reset all progress ─────────────────────────────────────────

function clearAllProgress() {
  try {
    const info = wx.getStorageInfoSync();
    const keys = (info && info.keys) || [];
    for (const key of keys) {
      if (key.startsWith(PREFIX) && key !== API_KEY_STORAGE) {
        wx.removeStorageSync(key);
      }
    }
  } catch (e) { /* ignore */ }
}

module.exports = {
  loadKpProgress,
  markKpStudied,
  loadExerciseAttempts,
  saveExerciseAttempt,
  getBestScore,
  loadChapterProgress,
  saveChat,
  loadChat,
  saveApiKeyOverride,
  loadApiKeyOverride,
  clearAllProgress,
};
