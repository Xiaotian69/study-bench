#!/usr/bin/env node
// Bundles all course content JSON into wx-miniprogram/data/all-chapters.js
// Run: node scripts/build-wx-data.js

const fs = require('fs');
const path = require('path');

const CONTENT_BASE = path.join(__dirname, '../content/courses/math-analysis');
const OUTPUT_FILE = path.join(__dirname, '../wx-miniprogram/data/all-chapters.js');

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.warn('  [warn] Could not read:', filePath, '-', e.message);
    return null;
  }
}

function adaptGradingRubric(rubric) {
  if (!Array.isArray(rubric)) return [];
  return rubric.map(item => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') {
      const pts = item.points != null ? '[' + item.points + '分] ' : '';
      return pts + (item.criterion || '');
    }
    return String(item);
  });
}

function getPrompt(ex) {
  return ex.problem || ex.prompt || ex.problemStatement || '';
}

function adaptExercise(ex) {
  const kpIds = Array.isArray(ex.knowledgePointIds)
    ? ex.knowledgePointIds
    : ex.knowledgePointId
    ? [ex.knowledgePointId]
    : [];

  return {
    id: ex.id,
    title: ex.title || null,
    difficulty: ex.difficulty || 'basic',
    type: ex.type || 'computation',
    prompt: getPrompt(ex),
    hints: Array.isArray(ex.hints) ? ex.hints : [],
    gradingRubric: adaptGradingRubric(ex.gradingRubric),
    commonMistakes: Array.isArray(ex.commonMistakes) ? ex.commonMistakes : [],
    knowledgePointIds: kpIds,
    knowledgePointId: ex.knowledgePointId || kpIds[0] || null,
  };
}

const DIAGRAM_TYPE_LABELS = {
  'number-line': '数轴图示',
  'sequence-on-number-line': '数列数轴',
  'two-panel-sequence-plot': '数列对比',
  'subsequence-highlight': '子列图示',
  'monotone-sequence-plot': '单调数列',
  'bounded-strip': '有界性图示',
  'cartesian-epsilon-delta': 'ε-δ 图示',
  'function-plot-asymptote': '渐近线图示',
  'piecewise-function-plot': '分段函数',
  'multi-curve-plot': '函数曲线',
  'function-plot': '函数曲线',
  'area-under-curve': '面积图示',
  'region-2d': '平面区域',
  geometric: '几何图示',
  table: '表格图示',
};

function getDiagramDisplayKind(type) {
  if (type === 'table') return 'table';
  if (type.includes('sequence') || type === 'bounded-strip' || type === 'subsequence-highlight') return 'sequence';
  if (type === 'number-line') return 'number-line';
  if (type.includes('function') || type.includes('curve') || type.includes('epsilon') || type.includes('asymptote')) return 'cartesian';
  if (type === 'geometric' || type === 'region-2d') return 'geometric';
  return 'concept';
}

function adaptDiagram(diagram) {
  const type = diagram.type || 'concept';
  return {
    id: diagram.id,
    title: diagram.title || '教学图示',
    type,
    typeLabel: DIAGRAM_TYPE_LABELS[type] || '教学图示',
    displayKind: getDiagramDisplayKind(type),
    description: diagram.description || '',
    parameters: diagram.parameters || {},
    renderHints: diagram.renderHints || {},
    teacherNotes: Array.isArray(diagram.teacherNotes) ? diagram.teacherNotes : [],
    studentPrompt: diagram.studentPrompt || '',
    knowledgePointIds: Array.isArray(diagram.knowledgePointIds) ? diagram.knowledgePointIds : [],
  };
}

function getDiagramsForKnowledgePoint(kp, allDiagrams) {
  const explicitIds = Array.isArray(kp.diagramIds) ? kp.diagramIds : [];
  const byId = new Map(allDiagrams.map(diagram => [diagram.id, diagram]));
  const result = [];
  const seen = new Set();

  for (const id of explicitIds) {
    const diagram = byId.get(id);
    if (diagram && !seen.has(diagram.id)) {
      result.push(diagram);
      seen.add(diagram.id);
    }
  }

  for (const diagram of allDiagrams) {
    if (diagram.knowledgePointIds.includes(kp.id) && !seen.has(diagram.id)) {
      result.push(diagram);
      seen.add(diagram.id);
    }
  }

  return result;
}

function buildData() {
  const output = { volumes: [], chapters: {} };
  const volumeFiles = ['volume-1.json', 'volume-2.json'];

  for (const vf of volumeFiles) {
    const volume = readJson(path.join(CONTENT_BASE, vf));
    if (!volume) continue;
    console.log('Processing volume:', volume.title);

    const volMeta = {
      id: volume.id,
      courseId: volume.courseId,
      title: volume.title,
      chapters: [],
    };

    for (const ch of volume.chapters) {
      volMeta.chapters.push({
        id: ch.id,
        number: ch.number,
        title: ch.title,
        status: ch.status,
      });

      // Read chapter content
      const chapterFilePath = ch.chapterFile
        ? path.join(CONTENT_BASE, ch.chapterFile)
        : null;
      const chapterData = chapterFilePath ? readJson(chapterFilePath) : null;

      // Read exercises
      const exFilePath = ch.exercisesFile
        ? path.join(CONTENT_BASE, ch.exercisesFile)
        : null;
      const exerciseData = exFilePath ? readJson(exFilePath) : null;
      const allExercises = exerciseData && exerciseData.exercises
        ? exerciseData.exercises.map(adaptExercise)
        : [];

      // Read teaching diagrams
      const diagramFilePath = ch.diagramFile
        ? path.join(CONTENT_BASE, ch.diagramFile)
        : null;
      const diagramData = diagramFilePath ? readJson(diagramFilePath) : null;
      const allDiagrams = diagramData && Array.isArray(diagramData.diagrams)
        ? diagramData.diagrams.map(adaptDiagram)
        : [];

      // Build KP list
      let kps = [];
      if (chapterData && Array.isArray(chapterData.knowledgePoints)) {
        kps = chapterData.knowledgePoints.map(kp => {
          // Match exercises to this KP
          const kpExercises = allExercises.filter(ex =>
            ex.knowledgePointIds.includes(kp.id) ||
            ex.knowledgePointId === kp.id
          );
          return {
            id: kp.id,
            title: kp.title,
            learningGoals: Array.isArray(kp.learningGoals) ? kp.learningGoals : [],
            coreExplanation: kp.coreExplanation || '',
            socraticQuestions: Array.isArray(kp.socraticQuestions) ? kp.socraticQuestions : [],
            commonMistakes: Array.isArray(kp.commonMistakes) ? kp.commonMistakes : [],
            diagramIds: Array.isArray(kp.diagramIds) ? kp.diagramIds : [],
            diagrams: getDiagramsForKnowledgePoint(kp, allDiagrams),
            exercises: kpExercises,
          };
        });
      }

      // Get overview — try new-format (id present) or old-format field
      const overview = chapterData
        ? (chapterData.overview || '')
        : '';

      output.chapters[ch.id] = {
        id: ch.id,
        number: ch.number,
        title: ch.title,
        status: ch.status,
        courseId: volume.courseId,
        volumeId: volume.id,
        overview,
        knowledgePoints: kps,
      };

      const exCount = kps.reduce((s, k) => s + k.exercises.length, 0);
      const diagramCount = kps.reduce((s, k) => s + k.diagrams.length, 0);
      console.log(
        '  ch' + ch.number + ' ' + ch.title +
        ' — ' + kps.length + ' KPs, ' + exCount + ' exercises, ' + diagramCount + ' diagrams'
      );
    }

    output.volumes.push(volMeta);
  }

  const totalChapters = Object.keys(output.chapters).length;
  const totalKps = Object.values(output.chapters)
    .reduce((s, ch) => s + ch.knowledgePoints.length, 0);
  const totalExercises = Object.values(output.chapters)
    .reduce((s, ch) => s + ch.knowledgePoints
      .reduce((ss, kp) => ss + kp.exercises.length, 0), 0);

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  const js =
    '// Auto-generated by scripts/build-wx-data.js — do not edit manually\n' +
    '// Run: node scripts/build-wx-data.js\n' +
    'module.exports = ' + JSON.stringify(output, null, 2) + ';\n';
  fs.writeFileSync(OUTPUT_FILE, js, 'utf-8');

  const sizeKb = Math.round(fs.statSync(OUTPUT_FILE).size / 1024);
  console.log('\nDone!');
  console.log('  ' + totalChapters + ' chapters, ' + totalKps + ' KPs, ' + totalExercises + ' exercises');
  console.log('  Output: ' + OUTPUT_FILE + ' (' + sizeKb + ' KB)');
}

buildData();
