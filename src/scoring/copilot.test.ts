import test from 'node:test';
import assert from 'node:assert';
import { db } from '../server/db.ts';
import { copilotService } from '../server/copilotService.ts';
import { parseRoadmapProposalFromResponse } from '../utils/copilotHelpers.ts';

test('PathProof Copilot — Test Suite', async (t) => {
  db.init(true);

  await t.test('TC-COP-01: Context assembly isolates authenticated student data', () => {
    const hamzaContext = copilotService.buildStudentContext(2);

    assert.strictEqual(hamzaContext.fullName, 'Hamza Tariq');
    assert.ok(hamzaContext.university.includes('NUST'));
    assert.strictEqual(hamzaContext.degreeProgram, 'BS Software Engineering');
    assert.ok(typeof hamzaContext.currentSemester === 'number' && hamzaContext.currentSemester >= 1);

    // Verify coursework contains Hamza's completed subjects
    assert.ok(hamzaContext.completedSubjects.length > 0);
    assert.ok(hamzaContext.completedSubjects.some((s) => s.name.includes('Web Technologies')));

    // Verify skills include level 3 React
    assert.ok(hamzaContext.skills.some((s) => s.name.includes('React') && s.level === 3));

    // Verify top alignments and Pakistani market citations are present
    assert.ok(hamzaContext.topAlignments.length > 0);
    assert.ok(hamzaContext.marketHighlights.length > 0);

    // Security check: Verify password hash is never exposed in context
    assert.strictEqual((hamzaContext as any).password_hash, undefined);
  });

  await t.test('TC-COP-02: Conversation creation, listing, and ownership', () => {
    // Hamza creates a conversation
    const conv = copilotService.createConversation(2, 'Test Internship Exploration');
    assert.ok(conv.conversation_id > 0);
    assert.strictEqual(conv.user_id, 2);

    // Hamza retrieves his conversations
    const list = copilotService.getConversations(2);
    assert.ok(list.some((c) => c.conversation_id === conv.conversation_id));

    // Ayesha (User 3) cannot view Hamza's conversation
    const unauthorized = copilotService.getConversation(conv.conversation_id, 3);
    assert.strictEqual(unauthorized, null);

    // Ayesha cannot delete Hamza's conversation
    const deleteAttempt = copilotService.deleteConversation(conv.conversation_id, 3);
    assert.strictEqual(deleteAttempt, false);

    // Hamza can view his conversation
    const authorized = copilotService.getConversation(conv.conversation_id, 2);
    assert.ok(authorized !== null);
    assert.strictEqual(authorized.conversation.conversation_id, conv.conversation_id);
  });

  await t.test('TC-COP-03: Message exchange with rule-based fallback intelligence', async () => {
    const conv = copilotService.createConversation(2, 'Skill Gap Inquiry');

    const result = await copilotService.handleUserMessage(
      2,
      conv.conversation_id,
      'What skills am I missing for Frontend Developer?'
    );

    assert.ok(result.userMessage);
    assert.strictEqual(result.userMessage.content, 'What skills am I missing for Frontend Developer?');
    assert.strictEqual(result.userMessage.sender, 'user');

    assert.ok(result.assistantMessage);
    assert.strictEqual(result.assistantMessage.sender, 'copilot');
    assert.ok(result.assistantMessage.content.length > 50);

    // Ensure content references actual student context or priority skills
    assert.ok(
      result.assistantMessage.content.includes('Semester 5') ||
      result.assistantMessage.content.includes('Frontend') ||
      result.assistantMessage.content.includes('Skill Gap')
    );
  });

  await t.test('TC-COP-04: Roadmap proposal, action_id tracking, and explicit confirmation', async () => {
    const conv = copilotService.createConversation(2, 'Roadmap Request');

    const result = await copilotService.handleUserMessage(
      2,
      conv.conversation_id,
      'Create a 12-week roadmap for my frontend internship'
    );

    // Check that roadmap proposal action and linked action_id are present
    assert.strictEqual(result.assistantMessage.action_type, 'PROPOSE_ROADMAP');
    assert.ok(typeof result.assistantMessage.action_id === 'number' && result.assistantMessage.action_id > 0);
    assert.ok(result.assistantMessage.action_payload !== null && result.assistantMessage.action_payload !== undefined);
    assert.ok(result.assistantMessage.action_payload.milestones.length >= 2);

    const pendingAction = db.tables.copilot_actions.find(
      (a) => a.action_id === result.assistantMessage.action_id
    );
    assert.ok(pendingAction);
    assert.strictEqual(pendingAction.status, 'PENDING');

    const initialRoadmapsCount = copilotService.getStudentRoadmaps(2).length;

    // Confirm the proposed action using linked action_id
    const confirmed = copilotService.confirmAction(
      2,
      result.assistantMessage.action_id!,
      result.assistantMessage.action_payload!
    );

    assert.ok(confirmed !== null);
    assert.strictEqual(confirmed.user_id, 2);
    assert.ok(confirmed.milestones.length >= 2);
    assert.strictEqual(pendingAction.status, 'CONFIRMED');
    assert.ok(pendingAction.confirmed_at !== null);

    // Verify roadmap is now in student database
    const updatedRoadmaps = copilotService.getStudentRoadmaps(2);
    assert.strictEqual(updatedRoadmaps.length, initialRoadmapsCount + 1);

    // Verify milestone toggle
    const firstMilestone = confirmed.milestones[0];
    assert.strictEqual(firstMilestone.is_completed, false);

    const toggled = copilotService.toggleMilestone(2, firstMilestone.milestone_id);
    assert.ok(toggled !== null);
    assert.strictEqual(toggled.is_completed, true);
  });

  await t.test('TC-COP-05: Seeded student roadmaps have synced milestones in student_roadmap_milestones', () => {
    const seededRoadmaps = copilotService.getStudentRoadmaps(2);
    assert.ok(seededRoadmaps.length >= 1);
    const firstSeeded = seededRoadmaps[0];
    assert.ok(firstSeeded.milestones.length >= 1);
    const toggled = copilotService.toggleMilestone(2, firstSeeded.milestones[0].milestone_id);
    assert.ok(toggled !== null);
    // Toggle back so seed state remains tidy
    copilotService.toggleMilestone(2, firstSeeded.milestones[0].milestone_id);
  });

  await t.test('TC-COP-06: parseRoadmapProposalFromResponse handles raw JSON, fenced JSON, malformed JSON, and plain text', () => {
    const rawResp = `Here is your roadmap plan.\n\n<<<ROADMAP_JSON:\n{"title":"Backend Plan","target_role":"Backend Developer","total_weeks":8,"milestones":[{"week_number":1,"title":"SQL Basics","description":"Learn indexing","estimated_hours":10,"learning_activities":["Write queries"],"completion_criteria":"Pass quiz"}]}\n>>>`;
    const parsedRaw = parseRoadmapProposalFromResponse(rawResp);
    assert.strictEqual(parsedRaw.actionType, 'PROPOSE_ROADMAP');
    assert.strictEqual(parsedRaw.content, 'Here is your roadmap plan.');
    assert.strictEqual(parsedRaw.actionPayload?.title, 'Backend Plan');
    assert.strictEqual(parsedRaw.actionPayload?.milestones.length, 1);

    const fencedResp = `Check this fenced roadmap.\n<<<ROADMAP_JSON:\n\`\`\`json\n{"title":"AI Engineer Track","target_role":"AI Engineer","total_weeks":12,"milestones":[{"title":"Linear Algebra"}]}\n\`\`\`\n>>>`;
    const parsedFenced = parseRoadmapProposalFromResponse(fencedResp);
    assert.strictEqual(parsedFenced.actionType, 'PROPOSE_ROADMAP');
    assert.strictEqual(parsedFenced.content, 'Check this fenced roadmap.');
    assert.strictEqual(parsedFenced.actionPayload?.target_role, 'AI Engineer');
    assert.strictEqual(parsedFenced.actionPayload?.milestones[0].week_number, 1);

    const malformedResp = `Plan overview.\n<<<ROADMAP_JSON:\n{not valid json\n>>>`;
    const parsedMalformed = parseRoadmapProposalFromResponse(malformedResp);
    assert.strictEqual(parsedMalformed.actionType, 'NONE');
    assert.strictEqual(parsedMalformed.actionPayload, null);
    assert.strictEqual(parsedMalformed.content, 'Plan overview.');

    const plainResp = 'Focus on TypeScript and React hooks this month.';
    const parsedPlain = parseRoadmapProposalFromResponse(plainResp);
    assert.strictEqual(parsedPlain.actionType, 'NONE');
    assert.strictEqual(parsedPlain.actionPayload, null);
    assert.strictEqual(parsedPlain.content, plainResp);
  });
});

