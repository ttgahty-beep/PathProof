import test from 'node:test';
import assert from 'node:assert';
import { db } from '../server/db.ts';
import { copilotService } from '../server/copilotService.ts';

test('PathProof Copilot — Test Suite', async (t) => {
  db.init(true);

  await t.test('TC-COP-01: Context assembly isolates authenticated student data', () => {
    const hamzaContext = copilotService.buildStudentContext(2);

    assert.strictEqual(hamzaContext.fullName, 'Hamza Tariq');
    assert.strictEqual(hamzaContext.university, 'NUST');
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

  await t.test('TC-COP-04: Roadmap proposal and explicit confirmation', async () => {
    const conv = copilotService.createConversation(2, 'Roadmap Request');

    const result = await copilotService.handleUserMessage(
      2,
      conv.conversation_id,
      'Create a 12-week roadmap for my frontend internship'
    );

    // Check that roadmap proposal action is present
    assert.strictEqual(result.assistantMessage.action_type, 'PROPOSE_ROADMAP');
    assert.ok(result.assistantMessage.action_payload !== null && result.assistantMessage.action_payload !== undefined);
    assert.ok(result.assistantMessage.action_payload.milestones.length >= 2);

    const initialRoadmapsCount = copilotService.getStudentRoadmaps(2).length;

    // Confirm the proposed action
    const confirmed = copilotService.confirmAction(
      2,
      result.assistantMessage.message_id,
      result.assistantMessage.action_payload!
    );

    assert.ok(confirmed !== null);
    assert.strictEqual(confirmed.user_id, 2);
    assert.ok(confirmed.milestones.length >= 2);

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
});
