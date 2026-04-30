import {
  buildRagUserPrompt,
  RAG_ANALYSIS_SYSTEM_PROMPT,
} from '../prompts/ragPrompt.js';

export async function buildResultAnalysis({ participant, totalScore, choiceAnswers, textAnswers }) {
  const apiKey = process.env.OPENAI_API_KEY ?? '';
  const model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

  if (!apiKey) {
    return 'OPENAI_API_KEY가 설정되지 않아 자동 분석이 비활성화되었습니다. server/prompts/ragPrompt.js의 프롬프트를 조정한 뒤 API 키를 입력해 주세요.';
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      messages: [
        { role: 'system', content: RAG_ANALYSIS_SYSTEM_PROMPT },
        {
          role: 'user',
          content: buildRagUserPrompt({
            participant,
            totalScore,
            choiceAnswers,
            textAnswers,
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM 분석 호출 실패: ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error('LLM 분석 결과가 비어 있습니다.');
  }

  return content;
}
