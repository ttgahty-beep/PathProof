import { RoadmapMilestone, RoadmapPayload } from '../types/index.ts';

export interface ParsedCopilotResponse {
  content: string;
  actionType: 'NONE' | 'PROPOSE_ROADMAP';
  actionPayload: RoadmapPayload | null;
}

/**
 * Extracts and validates an optional <<<ROADMAP_JSON: ... >>> block from a Copilot model response.
 * Handles markdown code fences inside the tag and normalizes milestone fields safely.
 */
export function parseRoadmapProposalFromResponse(rawText: string): ParsedCopilotResponse {
  const text = (rawText || '').trim();
  const tagRegex = /<<<ROADMAP_JSON:\s*([\s\S]*?)>>>/;
  const roadmapMatch = text.match(tagRegex);

  if (!roadmapMatch) {
    return {
      content: text,
      actionType: 'NONE',
      actionPayload: null,
    };
  }

  let cleanContent = text.replace(tagRegex, '').trim();
  let jsonCandidate = roadmapMatch[1].trim();

  // Strip optional markdown code fences (e.g. ```json ... ```)
  jsonCandidate = jsonCandidate
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  // Extract outermost JSON object if extra commentary slipped inside the delimiters
  const firstBrace = jsonCandidate.indexOf('{');
  const lastBrace = jsonCandidate.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    jsonCandidate = jsonCandidate.slice(firstBrace, lastBrace + 1);
  }

  try {
    const parsed = JSON.parse(jsonCandidate);
    if (parsed && typeof parsed.title === 'string' && parsed.title.trim() && Array.isArray(parsed.milestones) && parsed.milestones.length > 0) {
      const normalizedMilestones: RoadmapMilestone[] = parsed.milestones.map((m: any, idx: number) => ({
        week_number: Number(m?.week_number) > 0 ? Number(m.week_number) : idx * 3 + 1,
        title: typeof m?.title === 'string' && m.title.trim() ? m.title.trim() : `Milestone ${idx + 1}`,
        description: typeof m?.description === 'string' ? m.description.trim() : '',
        estimated_hours: Number(m?.estimated_hours) > 0 ? Number(m.estimated_hours) : 8,
        learning_activities: Array.isArray(m?.learning_activities)
          ? m.learning_activities.map((a: any) => String(a))
          : [],
        completion_criteria: typeof m?.completion_criteria === 'string' ? m.completion_criteria.trim() : '',
      }));

      const normalizedPayload: RoadmapPayload = {
        title: parsed.title.trim(),
        career_id: typeof parsed.career_id === 'number' ? parsed.career_id : undefined,
        career_title: typeof parsed.career_title === 'string' ? parsed.career_title : undefined,
        target_role:
          typeof parsed.target_role === 'string' && parsed.target_role.trim()
            ? parsed.target_role.trim()
            : 'Computing Professional',
        total_weeks: Number(parsed.total_weeks) > 0 ? Number(parsed.total_weeks) : 12,
        milestones: normalizedMilestones,
      };

      if (!cleanContent) {
        cleanContent = `I have prepared a structured **${normalizedPayload.total_weeks}-week** roadmap for **${normalizedPayload.target_role}**. Review the proposed milestones below and confirm to save it to your dashboard.`;
      }

      return {
        content: cleanContent,
        actionType: 'PROPOSE_ROADMAP',
        actionPayload: normalizedPayload,
      };
    }
  } catch {
    // Fall through to clean text without crashing
  }

  return {
    content: cleanContent || text,
    actionType: 'NONE',
    actionPayload: null,
  };
}
