import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../services/apiClient.ts';
import {
  CopilotConversation,
  CopilotMessage,
  RoadmapPayload,
  SafeUser,
} from '../types/index.ts';
import { ActionReviewModal } from './ActionReviewModal.tsx';
import { CopilotMessageContent } from './CopilotMessageContent.tsx';
import {
  Send,
  Plus,
  Trash2,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Bot,
  User as UserIcon,
  Copy,
  Check,
  RotateCw,
  AlertCircle,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';

interface Props {
  currentUser: SafeUser | null;
  onNavigateToTab?: (tab: any) => void;
  onOpenReport?: (careerId: number) => void;
}

export const CopilotView: React.FC<Props> = ({ currentUser, onNavigateToTab }) => {
  const [conversations, setConversations] = useState<CopilotConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [contextData, setContextData] = useState<any>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<number | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<number, boolean>>({});
  const [confirmDeleteConvId, setConfirmDeleteConvId] = useState<number | null>(null);

  // Action review modal state
  const [selectedRoadmapPayload, setSelectedRoadmapPayload] = useState<RoadmapPayload | null>(null);
  const [selectedActionId, setSelectedActionId] = useState<number | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset and reload conversations & context whenever authenticated user changes
  useEffect(() => {
    setConversations([]);
    setActiveConvId(null);
    setMessages([]);
    setContextData(null);
    setLoadError(null);
    setConfirmDeleteConvId(null);

    if (currentUser?.user_id && currentUser.role === 'STUDENT') {
      loadConversations();
      loadContext();
    }
  }, [currentUser?.user_id, currentUser?.role]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadContext = async () => {
    if (!currentUser || currentUser.role !== 'STUDENT') return;
    try {
      const data = await apiClient.getCopilotStudentContext();
      setContextData(data);
    } catch (err) {
      console.warn('Could not load student context:', err);
    }
  };

  const loadConversations = async () => {
    if (!currentUser || currentUser.role !== 'STUDENT') return;
    setIsInitialLoading(true);
    setLoadError(null);
    try {
      const list = await apiClient.getCopilotConversations();
      setConversations(list);
      if (list.length > 0) {
        await selectConversation(list[0].conversation_id);
      } else {
        await handleCreateNewConversation();
      }
    } catch (err: any) {
      console.error('Failed to load conversations:', err);
      setLoadError(err?.message || 'Could not load Copilot conversations. Please try again.');
    } finally {
      setIsInitialLoading(false);
    }
  };

  const selectConversation = async (convId: number) => {
    try {
      setActiveConvId(convId);
      setConfirmDeleteConvId(null);
      const res = await apiClient.getCopilotConversation(convId);
      setMessages(res.messages);
    } catch (err: any) {
      console.error('Failed to select conversation:', err);
      setLoadError(err?.message || 'Failed to load conversation history.');
    }
  };

  const handleCreateNewConversation = async () => {
    try {
      setLoadError(null);
      const newConv = await apiClient.createCopilotConversation('New Career Mentorship');
      setConversations((prev) => [newConv, ...prev.filter((c) => c.conversation_id !== newConv.conversation_id)]);
      setActiveConvId(newConv.conversation_id);
      setMessages([]);
      setTimeout(() => textareaRef.current?.focus(), 100);
    } catch (err: any) {
      console.error('Failed to create conversation:', err);
      setLoadError(err?.message || 'Could not start a new conversation.');
    }
  };

  const handleDeleteConversation = async (e: React.MouseEvent, convId: number) => {
    e.stopPropagation();
    if (confirmDeleteConvId !== convId) {
      setConfirmDeleteConvId(convId);
      return;
    }

    setConfirmDeleteConvId(null);
    try {
      await apiClient.deleteCopilotConversation(convId);
      const remaining = conversations.filter((c) => c.conversation_id !== convId);
      setConversations(remaining);
      if (activeConvId === convId) {
        if (remaining.length > 0) {
          await selectConversation(remaining[0].conversation_id);
        } else {
          setActiveConvId(null);
          setMessages([]);
        }
      }
    } catch (err: any) {
      console.error('Failed to delete conversation:', err);
      setLoadError(err?.message || 'Could not delete conversation.');
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setInputMessage('');
    setIsLoading(true);
    setLoadError(null);

    try {
      const convId = activeConvId || 0;
      const res = await apiClient.sendMessageToCopilot(convId, text);
      const resolvedConvId = res.userMessage.conversation_id;

      setMessages((prev) => [...prev, res.userMessage, res.assistantMessage]);
      setActiveConvId(resolvedConvId);

      // Keep sidebar conversation list & title fresh
      const list = await apiClient.getCopilotConversations();
      setConversations(list);
    } catch (err: any) {
      console.error('Failed to send message:', err);
      const errorMsg: CopilotMessage = {
        message_id: Date.now(),
        conversation_id: activeConvId || 0,
        sender: 'copilot',
        content: `I encountered an unexpected issue processing your request: "${err.message || 'Server error'}". Please try asking again.`,
        action_type: 'NONE',
        action_payload: null,
        created_at: new Date().toISOString(),
        is_fallback: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = async (msgId: number, content: string) => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(content);
      } else {
        throw new Error('Clipboard unavailable');
      }
    } catch {
      try {
        const helper = document.createElement('textarea');
        helper.value = content;
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        document.body.appendChild(helper);
        helper.select();
        document.execCommand('copy');
        document.body.removeChild(helper);
      } catch {
        // Ignore if blocked in strict sandbox
      }
    }
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleOpenActionReview = (msg: CopilotMessage) => {
    if (msg.action_payload) {
      setSelectedRoadmapPayload(msg.action_payload);
      setSelectedActionId(msg.action_id || msg.message_id);
      setShowActionModal(true);
    }
  };

  const handleConfirmAction = async (editedPayload: RoadmapPayload) => {
    const actionId = selectedActionId || 1;
    await apiClient.confirmCopilotAction(actionId, editedPayload);
    setSaveSuccessMsg(`Roadmap "${editedPayload.title}" has been successfully added to your dashboard!`);
    setTimeout(() => setSaveSuccessMsg(null), 6000);
  };

  const suggestedPrompts = [
    'Analyze my career readiness for Frontend Developer',
    'Find my missing skills according to Pakistani employers',
    'Create a 12-week internship roadmap for me',
    'Review my capstone project README for my portfolio',
    'Compare Frontend vs Backend opportunities in Pakistan',
    'Suggest high-impact next steps for Semester 5',
  ];

  return (
    <div className="space-y-6">
      {/* View Header with Context Badge */}
      <div className="bg-white rounded-xl border border-[#E5E4DA] p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#173629]" />
              <span className="text-2xs font-bold uppercase tracking-wider text-[#657064]">
                PathProof Copilot
              </span>
              <span className="text-2xs text-[#A3B8AC]">·</span>
              <span className="text-2xs font-mono text-[#244B3A]">Gemini 4 Hydrogen Powered</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#173629]">
              Your Personal Career Mentor
            </h1>
            <p className="text-sm text-[#657064] mt-1 max-w-2xl">
              Personalized career guidance grounded in your university coursework, self-reported skills, and verified Pakistani market demand.
            </p>
          </div>

          {contextData && (
            <div className="bg-[#F7F6F0] p-3.5 rounded-lg border border-[#E5E4DA] text-xs space-y-1">
              <div className="font-semibold text-[#173629] flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-[#244B3A]" />
                <span>Grounded Profile Context</span>
              </div>
              <div className="text-[#657064]">
                <span>{contextData.university}</span> · <span>Semester {contextData.currentSemester}</span>
              </div>
              <div className="text-2xs text-[#244B3A] font-medium font-mono tabular-nums">
                Top Fit: {contextData.topAlignments[0]?.careerTitle || 'Frontend Developer'} ({contextData.topAlignments[0]?.alignmentScore ?? 85}%)
              </div>
            </div>
          )}
        </div>
      </div>

      {loadError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{loadError}</span>
          </div>
          <button
            type="button"
            onClick={() => loadConversations()}
            className="px-3 py-1 bg-rose-700 hover:bg-rose-800 text-white font-semibold rounded-md cursor-pointer shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {saveSuccessMsg && (
        <div className="bg-[#DCE8D9] border border-[#244B3A]/30 text-[#173629] px-4 py-3 rounded-lg text-sm flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#244B3A]" />
            <span className="font-medium">{saveSuccessMsg}</span>
          </div>
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('overview')}
              className="text-xs font-bold text-[#244B3A] underline hover:text-[#173629] cursor-pointer"
            >
              View in Overview
            </button>
          )}
        </div>
      )}

      {/* Main Workspace Split-Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Conversation History */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-[#E5E4DA] p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#657064]">
              Conversations
            </span>
            <button
              onClick={handleCreateNewConversation}
              className="flex items-center gap-1 text-xs font-bold text-white bg-[#173629] hover:bg-[#244B3A] px-2.5 py-1.5 rounded-md transition-colors shadow-2xs cursor-pointer"
              title="Start a fresh conversation"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Chat</span>
            </button>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto no-scrollbar">
            {conversations.length === 0 ? (
              <div className="text-xs text-[#657064] text-center py-6">
                No past chats yet. Start one above!
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = conv.conversation_id === activeConvId;
                const isPendingDelete = confirmDeleteConvId === conv.conversation_id;
                return (
                  <div
                    key={conv.conversation_id}
                    onClick={() => selectConversation(conv.conversation_id)}
                    className={`group flex items-center justify-between p-2.5 rounded-lg text-xs cursor-pointer transition-all ${
                      isActive
                        ? 'bg-[#173629] text-white font-semibold shadow-xs'
                        : 'text-[#202A23] hover:bg-[#F7F6F0]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#D8E99A]' : 'text-[#657064]'}`} />
                      <span className="truncate">{conv.title}</span>
                    </div>

                    {isPendingDelete ? (
                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteConversation(e, conv.conversation_id)}
                          className="px-1.5 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold cursor-pointer"
                          aria-label={`Confirm delete ${conv.title}`}
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteConvId(null);
                          }}
                          className="px-1.5 py-0.5 rounded bg-[#E5E4DA] text-[#202A23] text-[10px] font-semibold cursor-pointer"
                          aria-label="Cancel delete"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteConversation(e, conv.conversation_id)}
                        className={`opacity-70 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 p-1 rounded transition-opacity cursor-pointer ${
                          isActive
                            ? 'text-[#DCE8D9] hover:text-white hover:bg-[#244B3A]'
                            : 'text-[#657064] hover:text-rose-600'
                        }`}
                        title="Delete conversation"
                        aria-label={`Delete conversation ${conv.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-2 border-t border-[#E5E4DA] text-2xs text-[#657064] space-y-1">
            <div className="font-semibold text-[#202A23]">Career Copilot Safety</div>
            <p>
              Your conversations are private and only reference your authorized profile data.
            </p>
          </div>
        </div>

        {/* Right Column: Active Conversation Stream */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-[#E5E4DA] flex flex-col h-[650px] shadow-xs overflow-hidden">
          {/* Stream Header */}
          <div className="px-6 py-3.5 bg-[#FAF9F5] border-b border-[#E5E4DA] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#173629]" />
              <span className="text-xs font-bold text-[#173629]">
                {conversations.find((c) => c.conversation_id === activeConvId)?.title ||
                  'Active Career Mentorship'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-2xs text-[#657064]">
              <span>Response Mode:</span>
              <span className="font-mono text-[#244B3A] font-semibold">Context-Grounded</span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#F7F6F0]/40">
            {messages.length === 0 && !isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-12 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#DCE8D9] flex items-center justify-center text-[#173629]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#173629]">
                    Ask PathProof Copilot Anything
                  </h3>
                  <p className="text-xs text-[#657064] mt-1">
                    Ask questions about your career options, generate multi-week learning roadmaps, analyze missing skills, or review capstone projects.
                  </p>
                </div>

                <div className="w-full text-left space-y-2 pt-2">
                  <div className="text-2xs font-bold uppercase tracking-wider text-[#657064] text-center">
                    Quick Start Prompts
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestedPrompts.slice(0, 4).map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-left text-xs p-2.5 bg-white border border-[#E5E4DA] hover:border-[#244B3A] hover:bg-[#F7F6F0] rounded-lg text-[#202A23] transition-all cursor-pointer shadow-2xs"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.message_id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isUser
                        ? 'bg-[#173629] text-white'
                        : 'bg-[#DCE8D9] text-[#173629] border border-[#244B3A]/20'
                    }`}
                  >
                    {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Card */}
                  <div
                    className={`max-w-[85%] rounded-xl p-4 shadow-2xs text-xs space-y-2 ${
                      isUser
                        ? 'bg-[#173629] text-white'
                        : 'bg-white text-[#202A23] border border-[#E5E4DA]'
                    }`}
                  >
                    {/* Fallback badge */}
                    {msg.is_fallback && !isUser && (
                      <div className="flex items-center gap-1.5 text-2xs text-[#657064] pb-1 border-b border-[#E5E4DA]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Rule-Based Career Intelligence</span>
                      </div>
                    )}

                    {/* Markdown prose rendering */}
                    <CopilotMessageContent content={msg.content} isUser={isUser} />

                    {/* Action Card: Proposed Roadmap */}
                    {msg.action_type === 'PROPOSE_ROADMAP' && msg.action_payload && (
                      <div className="mt-3 p-3.5 bg-[#F7F6F0] border border-[#244B3A]/30 rounded-lg space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-2xs font-bold uppercase tracking-wider text-[#244B3A]">
                            Proposed Career Roadmap
                          </span>
                          <span className="px-2 py-0.5 text-2xs font-mono font-bold bg-[#DCE8D9] text-[#173629] rounded">
                            {msg.action_payload.total_weeks} WEEKS
                          </span>
                        </div>

                        <div className="font-bold text-sm text-[#173629]">
                          {msg.action_payload.title}
                        </div>

                        <div className="text-xs text-[#657064] flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#244B3A]" />
                            {msg.action_payload.milestones?.length || 0} Milestones
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#244B3A]" />
                            Target: {msg.action_payload.target_role}
                          </span>
                        </div>

                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => handleOpenActionReview(msg)}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#173629] hover:bg-[#244B3A] rounded-lg transition-colors cursor-pointer shadow-xs"
                          >
                            <span>Review & Save Roadmap in Modal</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Bottom Metadata & Copy Button */}
                    <div
                      className={`flex items-center justify-between pt-1 text-2xs ${
                        isUser ? 'text-[#A3B8AC]' : 'text-[#657064]'
                      }`}
                    >
                      <span>
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>

                      {!isUser && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyMessage(msg.message_id, msg.content)}
                            className="p-1 hover:text-[#202A23] rounded transition-colors cursor-pointer"
                            title="Copy response"
                          >
                            {copiedMsgId === msg.message_id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>

                          <button
                            onClick={() =>
                              setFeedbackGiven((prev) => ({ ...prev, [msg.message_id]: true }))
                            }
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              feedbackGiven[msg.message_id]
                                ? 'text-emerald-700 font-bold'
                                : 'hover:text-[#202A23]'
                            }`}
                            title="Mark as helpful"
                          >
                            {feedbackGiven[msg.message_id] ? '✓ Helpful' : 'Helpful?'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#DCE8D9] text-[#173629] flex items-center justify-center">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-[#E5E4DA] shadow-2xs text-xs text-[#657064] flex items-center gap-2">
                  <RotateCw className="w-3.5 h-3.5 animate-spin text-[#244B3A]" />
                  <span>Synthesizing student context and career intelligence...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Strip */}
          <div className="px-6 py-2 bg-[#FAF9F5] border-t border-[#E5E4DA] overflow-x-auto no-scrollbar flex items-center gap-2">
            <span className="text-2xs font-bold text-[#657064] uppercase tracking-wider shrink-0">
              Suggestions:
            </span>
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="text-2xs px-2.5 py-1 bg-white hover:bg-[#DCE8D9]/40 border border-[#E5E4DA] hover:border-[#244B3A] rounded-full text-[#202A23] whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Composer Input */}
          <div className="p-4 bg-white border-t border-[#E5E4DA]">
            <div className="relative flex items-end bg-[#F7F6F0] rounded-xl border border-[#E5E4DA] focus-within:border-[#244B3A] focus-within:ring-1 focus-within:ring-[#244B3A] transition-all p-2">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask PathProof Copilot about careers, missing skills, or request a roadmap... (Press Enter to send)"
                rows={2}
                disabled={isLoading}
                className="w-full bg-transparent text-xs text-[#202A23] placeholder-[#A3B8AC] resize-none focus:outline-hidden px-2 py-1 max-h-32"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="p-2.5 rounded-lg bg-[#173629] text-white hover:bg-[#244B3A] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0 ml-2"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-2xs text-[#657064] mt-2 px-1">
              <span>Shift + Enter for new line · Enter to send</span>
              <span>Evidence-based Career Decision Engine</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Review Modal */}
      {selectedRoadmapPayload && (
        <ActionReviewModal
          isOpen={showActionModal}
          payload={selectedRoadmapPayload}
          onClose={() => {
            setShowActionModal(false);
            setSelectedRoadmapPayload(null);
          }}
          onConfirm={handleConfirmAction}
        />
      )}
    </div>
  );
};
