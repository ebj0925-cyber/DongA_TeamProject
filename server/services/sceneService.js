import { findSceneRows } from '../repositories/sceneRepository.js';

export async function getScenes() {
  const rows = await findSceneRows();
  const scenesByCode = new Map();

  rows.forEach((row) => {
    const sceneCode = row.scene_code;
    if (!scenesByCode.has(sceneCode)) {
      scenesByCode.set(sceneCode, {
        id: row.scene_id,
        sceneCode: row.scene_code,
        title: row.title,
        narration: row.narration,
        interaction: {
          type: row.interaction_type,
          key: row.interaction_key,
          label: row.interaction_label,
          options: [],
        },
      });
    }

    if (row.option_id) {
      scenesByCode.get(sceneCode).interaction.options.push({
        id: row.option_id,
        text: row.option_text,
        score: row.score,
        nextSceneCode: row.next_scene_code,
      });
    }
  });

  return [...scenesByCode.values()];
}
