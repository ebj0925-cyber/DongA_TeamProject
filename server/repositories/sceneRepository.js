import { dbPool } from '../config/db.js';

export async function findSceneRows() {
  const [rows] = await dbPool.query(
    `
      SELECT
        sm.id AS scene_id,
        sm.scene_code,
        sm.title,
        sm.narration,
        sm.interaction_type,
        sm.interaction_key,
        sm.interaction_label,
        so.id AS option_id,
        so.option_text,
        so.score,
        so.next_scene_code
      FROM scenes_metadata sm
      LEFT JOIN scene_options so ON so.scene_id = sm.id
      ORDER BY sm.id ASC, so.id ASC
    `,
  );

  return rows;
}
