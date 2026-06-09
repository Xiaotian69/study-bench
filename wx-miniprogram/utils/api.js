const config = require('../config');
const { loadApiKeyOverride } = require('./progress');

const CHAT_URL = config.DEEPSEEK_BASE_URL.replace(/\/+$/, '') + '/chat/completions';

function getApiKey() {
  return loadApiKeyOverride() || config.DEEPSEEK_API_KEY;
}

function buildSystemPrompt(kp) {
  const lines = [
    '你是一位数学分析苏格拉底式助教，辅导大学生学习。',
    '核心原则：优先提问引导而非直接给答案；一次只问一个问题；语气友好鼓励；数学公式用 LaTeX。',
    '',
  ];
  if (kp && kp.title) lines.push('当前知识点：' + kp.title);
  if (kp && kp.learningGoals && kp.learningGoals.length) {
    lines.push('\n学习目标：');
    kp.learningGoals.forEach((g, i) => lines.push((i + 1) + '. ' + g));
  }
  if (kp && kp.coreExplanation) {
    const snippet = kp.coreExplanation.slice(0, 500);
    lines.push('\n核心概念（摘要）：\n' + snippet + (kp.coreExplanation.length > 500 ? '…' : ''));
  }
  if (kp && kp.socraticQuestions && kp.socraticQuestions.length) {
    lines.push('\n可用追问示例（选择性使用，不直接照读）：');
    kp.socraticQuestions.slice(0, 3).forEach(q => lines.push('· ' + q));
  }
  if (kp && kp.commonMistakes && kp.commonMistakes.length) {
    lines.push('\n常见误区（注意引导学生避免）：');
    kp.commonMistakes.slice(0, 3).forEach(m => lines.push('· ' + m));
  }
  return lines.join('\n');
}

function buildGradePrompt(exercise, studentAnswer) {
  const rubricText = exercise.gradingRubric && exercise.gradingRubric.length
    ? exercise.gradingRubric.join('\n')
    : '整体正确性、逻辑清晰、步骤完整';

  return [
    '你是一位严格但友好的数学分析助教，请批改以下学生作答。',
    '',
    '【题目】',
    exercise.prompt,
    '',
    '【评分标准】',
    rubricText,
    '',
    '【学生答案】',
    studentAnswer,
    '',
    '请严格按如下 JSON 格式返回，不要输出任何其他内容：',
    '{"verdict":"excellent"|"good"|"partial"|"incorrect","score":整数0到100,"feedback":"对学生答案的评语（指出优点和具体不足，数学符号用LaTeX）","missingPoints":["缺少的要点1","缺少的要点2"]}',
  ].join('\n');
}

function chatRequest(messages, kp, callbacks) {
  const systemPrompt = buildSystemPrompt(kp);
  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    })),
  ];

  wx.request({
    url: CHAT_URL,
    method: 'POST',
    header: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + getApiKey(),
    },
    data: {
      model: config.DEEPSEEK_MODEL,
      messages: apiMessages,
      temperature: 0.5,
      max_tokens: 1024,
    },
    success(res) {
      if (res.statusCode !== 200) {
        callbacks.onError('服务器返回 ' + res.statusCode);
        return;
      }
      const content = res.data && res.data.choices && res.data.choices[0] &&
        res.data.choices[0].message && res.data.choices[0].message.content;
      if (!content) {
        callbacks.onError('AI 返回内容为空');
        return;
      }
      callbacks.onSuccess(content);
    },
    fail(err) {
      callbacks.onError('网络错误：' + (err.errMsg || '请检查网络连接'));
    },
  });
}

function gradeRequest(exercise, studentAnswer, callbacks) {
  const gradePrompt = buildGradePrompt(exercise, studentAnswer);

  wx.request({
    url: CHAT_URL,
    method: 'POST',
    header: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + getApiKey(),
    },
    data: {
      model: config.DEEPSEEK_MODEL,
      messages: [
        { role: 'user', content: gradePrompt },
      ],
      temperature: 0.2,
      max_tokens: 800,
    },
    success(res) {
      if (res.statusCode !== 200) {
        callbacks.onError('服务器返回 ' + res.statusCode);
        return;
      }
      const raw = res.data && res.data.choices && res.data.choices[0] &&
        res.data.choices[0].message && res.data.choices[0].message.content;
      if (!raw) {
        callbacks.onError('AI 返回内容为空');
        return;
      }
      try {
        // Extract JSON from potential markdown code block
        const jsonStr = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        const result = JSON.parse(jsonStr);
        callbacks.onSuccess(result);
      } catch (e) {
        callbacks.onError('解析批改结果失败，原始返回：' + raw.slice(0, 100));
      }
    },
    fail(err) {
      callbacks.onError('网络错误：' + (err.errMsg || '请检查网络连接'));
    },
  });
}

module.exports = { chatRequest, gradeRequest, buildSystemPrompt };
