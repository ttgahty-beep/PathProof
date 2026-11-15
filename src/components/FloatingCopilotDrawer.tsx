import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../services/apiClient.ts';
import { CopilotMessage, RoadmapPayload, SafeUser } from '../types/index.ts';
import { ActionReviewModal } from './ActionReviewModal.tsx';
import { CopilotMessageContent } from './CopilotMessageContent.tsx';
import {
  MessageSquare,
  X,
  Send,
  Maximize2,
  Bot,
  User as UserIcon,
  RotateCw,
  Sparkles,
  ArrowRight,
  Check,
  Plus,
} from 'lucide-react';

interface Props {
  currentUser: SafeUser | null;
  onOpenFullTab: () => void;
}

export const FloatingCopilotDrawer: React.FC<Props> = ({ currentUser, onOpenFullTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);

  // Modal review state
  const [selectedRoadmapPayload, setSelectedRoadmapPayload] = useState<RoadmapPayload | null>(null);
  const [selectedActionId, setSelectedActionId] = useState<number | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset drawer state when persona changes
  useEffect(() => {
    setActiveConvId(null);
    setMessages([]);
  }, [currentUser?.user_id]);

  useEffect(() => {
    if (isOpen && messages.length === 0 && currentUser?.role === 'STUDENT') {
      loadInitialChat();
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, currentUser?.user_id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadInitialChat = async () => {
    if (!currentUser || currentUser.role !== 'STUDENT') return;
    try {
      const convs = await apiClient.getCopilotConversations();
      if (convs.length > 0) {
        setActiveConvId(convs[0].conversation_id);
        const data = await apiClient.getCopilotConversation(convs[0].conversation_id);
        setMessages(data.messages);
      }
    } catch (err) {
      console.warn('Floating copilot initial chat load error:', err);
    }
  };

  const handleStartNewChat = async () => {
    try {
      const conv = await apiClient.createCopilotConversation('Quick Copilot Chat');
      setActiveConvId(conv.conversation_id);
      setMessages([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch {
      setActiveConvId(null);
      setMessages([]);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setInputMessage('');
    setIsLoading(true);

    try {
      const convId = activeConvId || 0;
      const res = await apiClient.sendMessageToCopilot(convId, text);
      setActiveConvId(res.userMessage.conversation_id);
      setMessages((prev) => [...prev, res.userMessage, res.assistantMessage]);
    } catch (err: any) {
      const errorMsg: CopilotMessage = {
        message_id: Date.now(),
        conversation_id: activeConvId || 0,
        sender: 'copilot',
        content: `Error: ${err.message || 'Server error'}. Please try again.`,
        action_type: 'NONE',
        action_payload: null,
        created_at: new Date().toISOString(),
        is_fallback: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpenActionReview = (msg: CopilotMessage) => {
    if (msg.action_payload) {
      setSelectedRoadmapPayload(msg.action_payload);
      setSelectedActionId(msg.action_id || msg.message_id);
      setShowActionModal(true);
    }
  };

  const handleConfirmAction = async (editedPayload: RoadmapPayload) => {
    await apiClient.confirmCopilotAction(selectedActionId || 1, editedPayload);
    setSaveSuccessMsg(`Roadmap "${editedPayload.title}" confirmed and saved!`);
    setTimeout(() => setSaveSuccessMsg(null), 5000);
  };

  const quickPrompts = [
    'Analyze my career readiness',
    'Find my missing skills for Frontend',
    'Create 12-week roadmap',
  ];

  if (!currentUser || currentUser.role !== 'STUDENT') {
    return null;
  }

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#173629] text-white hover:bg-[#244B3A] rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer group border border-[#244B3A]"
          title="Open PathProof Copilot Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-[#D8E99A] group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D8E99A] animate-ping" />
          </div>
          <span className="text-xs font-bold tracking-tight">Copilot Mentor</span>
        </button>
      )}

      {/* Slide-over Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-[#F7F6F0] border-l border-[#E5E4DA] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="px-5 py-3.5 bg-[#173629] text-[#DCE8D9] flex items-center justify-between border-b border-[#0F241B]">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#D8E99A]" />
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  PathProof Copilot
                </h3>
                <p className="text-3xs text-[#A3B8AC]">Your personal career mentor</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleStartNewChat}
                className="p-1.5 text-[#A3B8AC] hover:text-white hover:bg-[#244B3A] rounded-lg transition-colors cursor-pointer"
                title="Start new chat"
                aria-label="Start new chat"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenFullTab();
                }}
                className="p-1.5 text-[#A3B8AC] hover:text-white hover:bg-[#244B3A] rounded-lg transition-colors cursor-pointer"
                title="Expand to full workspace tab"
                aria-label="Expand to full workspace tab"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#A3B8AC] hover:text-white hover:bg-[#244B3A] rounded-lg transition-colors cursor-pointer"
                title="Close drawer"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {saveSuccessMsg && (
            <div className="px-4 py-2 bg-[#DCE8D9] text-[#173629] text-xs font-medium flex items-center gap-2 border-b border-[#244B3A]/20">
              <Check className="w-3.5 h-3.5 text-[#244B3A]" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Chat Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF9F5]/60 text-xs">
            {messages.length === 0 && !isLoading && (
              <div className="text-center py-12 px-4 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#DCE8D9] text-[#173629] mx-auto flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-[#173629]">How can I help you today?</h4>
                <p className="text-2xs text-[#657064]">
                  Grounded in your semester coursework, recorded skills, and Pakistani market data.
                </p>
                <div className="space-y-1.5 pt-2">
                  {quickPrompts.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(q)}
                      className="w-full text-left p-2 bg-white border border-[#E5E4DA] hover:border-[#244B3A] rounded-lg text-2xs text-[#202A23] transition-colors cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.message_id}
                  className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-3xs ${
                      isUser ? 'bg-[#173629] text-white' : 'bg-[#DCE8D9] text-[#173629]'
                    }`}
                  >
                    {isUser ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[85%] p-3 rounded-xl shadow-2xs space-y-1.5 text-xs ${
                      isUser
                        ? 'bg-[#173629] text-white'
                        : 'bg-white text-[#202A23] border border-[#E5E4DA]'
                    }`}
                  >
                    <CopilotMessageContent content={msg.content} isUser={isUser} />

                    {msg.action_type === 'PROPOSE_ROADMAP' && msg.action_payload && (
                      <div className="p-2.5 bg-[#F7F6F0] border border-[#244B3A]/30 rounded-lg space-y-1.5 mt-2">
                        <div className="font-bold text-2xs text-[#173629]">
                          {msg.action_payload.title}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenActionReview(msg)}
                          className="w-full flex items-center justify-center gap-1 py-1.5 px-2 bg-[#173629] text-white text-3xs font-bold rounded-md hover:bg-[#244B3A] transition-colors cursor-pointer"
                        >
                          <span>Review & Save Roadmap</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 p-2 text-2xs text-[#657064]">
                <RotateCw className="w-3 h-3 animate-spin text-[#244B3A]" />
                <span>Copilot is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Strip */}
          <div className="px-4 py-2 bg-white border-t border-[#E5E4DA] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(qp)}
                className="px-2 py-0.5 bg-[#F7F6F0] hover:bg-[#DCE8D9] rounded text-3xs text-[#202A23] whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Drawer Composer */}
          <div className="p-3 bg-white border-t border-[#E5E4DA]">
            <div className="flex items-center gap-2 bg-[#F7F6F0] border border-[#E5E4DA] focus-within:border-[#244B3A] rounded-lg p-1.5">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about careers or roadmaps..."
                disabled={isLoading}
                className="flex-1 bg-transparent px-2 text-xs text-[#202A23] focus:outline-hidden"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="p-1.5 bg-[#173629] text-white hover:bg-[#244B3A] disabled:opacity-30 rounded-md transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

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
    </>
  );
};
