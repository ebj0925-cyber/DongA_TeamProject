import { buildIsolationResult } from '../services/isolationService.js';

export async function analyzeIsolation(req, res) {
  const { sessionId, submittedAt, totalScenes, responses } = req.body || {};

  if (!sessionId || !responses || typeof responses !== 'object') {
    res.status(400).json({
      message: '잘못된 요청입니다. sessionId와 responses가 필요합니다.',
    });
    return;
  }

  try {
    const result = await buildIsolationResult({
      sessionId,
      submittedAt,
      totalScenes,
      responses,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: '응답 저장/분석 처리 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
}
