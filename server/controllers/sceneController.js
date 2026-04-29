import { getScenes } from '../services/sceneService.js';

export async function getSceneList(req, res) {
  try {
    const scenes = await getScenes();
    res.json({
      ok: true,
      total: scenes.length,
      scenes,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: '씬 데이터를 불러오지 못했습니다.',
      error: error.message,
    });
  }
}
