export async function findSceneAnswerRows(connection) {
  const [rows] = await connection.query(
    `
      SELECT
        sm.id AS scene_id,
        sm.scene_code,
        sm.interaction_type,
        sm.interaction_key,
        so.id AS option_id,
        so.option_text,
        so.score
      FROM scenes_metadata sm
      LEFT JOIN scene_options so ON so.scene_id = sm.id
      ORDER BY sm.id ASC, so.id ASC
    `,
  );
  return rows;
}

export async function insertParticipant(connection, { userName, age }) {
  const [result] = await connection.query(
    `
      INSERT INTO survey_participants (user_name, age, total_score, result_analysis)
      VALUES (?, ?, 0, '')
    `,
    [userName, age],
  );

  return result.insertId;
}

export async function insertUserResponse(connection, { participantId, sceneId, optionId, answerText }) {
  await connection.query(
    `
      INSERT INTO user_responses (participant_id, scene_id, option_id, answer_text)
      VALUES (?, ?, ?, ?)
    `,
    [participantId, sceneId, optionId, answerText],
  );
}

export async function updateParticipantResult(connection, { participantId, totalScore, resultAnalysis }) {
  await connection.query(
    `
      UPDATE survey_participants
      SET total_score = ?, result_analysis = ?
      WHERE id = ?
    `,
    [totalScore, resultAnalysis, participantId],
  );
}
