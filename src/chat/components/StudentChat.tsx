import { useState } from 'react';
import { Brain } from 'lucide-react';
import { ChatSidebar } from '@/chat/components/ChatSidebar';
import { ChatMessages } from '@/chat/components/ChatMessages';
import { ChatComposer } from '@/chat/components/ChatComposer';
import { LearningInsights } from '@/chat/components/LearningInsights';
import type { ChatSession, Message } from '@/chat/types';

export function StudentChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: '안녕하세요! 저는 여러분의 AI 러닝 파트너입니다. 단순히 답을 알려드리는 것이 아니라, 스스로 생각하고 문제를 해결할 수 있도록 도와드릴게요. 무엇을 배우고 싶으신가요?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeChatId, setActiveChatId] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock chat sessions
  const [chatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'TypeScript React 환경 설정',
      lastMessage: 'TypeScript와 React를 함께 사용하려면...',
      timestamp: new Date(),
    },
    {
      id: '2',
      title: 'LangChain vs LangGraph',
      lastMessage: 'LangChain과 LangGraph의 차이점에 대해...',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
      id: '3',
      title: 'Spring AI vs FastAPI',
      lastMessage: 'Spring AI와 FastAPI의 장단점을...',
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
    },
    {
      id: '4',
      title: 'Spring AI LangGraph 통합',
      lastMessage: 'Spring AI에서 LangGraph를 통합하는 방법...',
      timestamp: new Date(Date.now() - 259200000), // 3 days ago
    },
    {
      id: '5',
      title: 'MongoDB 데이터 모델링 패턴',
      lastMessage: 'MongoDB에서 효율적인 데이터 모델링...',
      timestamp: new Date(Date.now() - 345600000), // 4 days ago
    },
    {
      id: '6',
      title: '백엔드 아키텍처 설계',
      lastMessage: '확장 가능한 백엔드 아키텍처를...',
      timestamp: new Date(Date.now() - 432000000), // 5 days ago
    },
    {
      id: '7',
      title: '채팅 기록 저장 DB',
      lastMessage: '채팅 기록을 효율적으로 저장하려면...',
      timestamp: new Date(Date.now() - 518400000), // 6 days ago
    },
  ]);

  const filteredChats = chatSessions.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `좋은 질문이에요! 이 문제를 해결하기 위해 먼저 다음을 생각해보세요:\n\n1. 문제의 핵심이 무엇인가요?\n2. 어떤 접근 방식을 시도해볼 수 있을까요?\n3. 이전에 비슷한 문제를 풀어본 경험이 있나요?\n\n한 단계씩 함께 풀어나가봐요!`,
        timestamp: new Date(),
        comprehensionCheck: true,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsThinking(false);
    }, 1500);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'ai',
        content: '안녕하세요! 저는 여러분의 AI 러닝 파트너입니다. 단순히 답을 알려드리는 것이 아니라, 스스로 생각하고 문제를 해결할 수 있도록 도와드릴게요. 무엇을 배우고 싶으신가요?',
        timestamp: new Date(),
      },
    ]);
    setActiveChatId(Date.now().toString());
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return '오늘';
    if (diffInDays === 1) return '어제';
    if (diffInDays < 7) return `${diffInDays}일 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-12rem)] relative">
      <ChatSidebar
        isOpen={sidebarOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        chats={filteredChats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
        onToggle={setSidebarOpen}
        formatTimestamp={formatTimestamp}
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6" />
              <div>
                <h2>AI 러닝 세션</h2>
                <p className="text-sm text-blue-100">질문을 통해 성장하는 시간</p>
              </div>
            </div>
          </div>

          <ChatMessages messages={messages} isThinking={isThinking} />
          <ChatComposer value={input} onChange={setInput} onSend={handleSend} />
        </div>

        <LearningInsights />
      </div>
    </div>
  );
}
