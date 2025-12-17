import { useState } from 'react';
import { Send, Lightbulb, AlertCircle, CheckCircle2, Brain, MessageSquare, Plus, Search, Settings, Menu, X } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  comprehensionCheck?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

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
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col overflow-hidden`}
      >
        {sidebarOpen && (
          <>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900 dark:text-white">채팅 목록</h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              
              {/* New Chat Button */}
              <button
                onClick={handleNewChat}
                className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                새 채팅
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="채팅 검색"
                  className="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-2">
              <div className="mb-2 px-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">내 채팅</p>
              </div>
              <div className="space-y-1">
                {filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors group ${
                      activeChatId === chat.id
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 mt-0.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm line-clamp-1 ${
                          activeChatId === chat.id
                            ? 'text-blue-700 dark:text-blue-400'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {chat.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {formatTimestamp(chat.timestamp)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm text-gray-700 dark:text-gray-300">
                <Settings className="w-4 h-4" />
                설정
              </button>
            </div>
          </>
        )}
      </div>

      {/* Toggle Sidebar Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute left-0 top-4 p-2 bg-white dark:bg-gray-800 rounded-r-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      )}

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6" />
              <div>
                <h2>AI 러닝 세션</h2>
                <p className="text-sm text-blue-100">질문을 통해 성장하는 시간</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  {message.comprehensionCheck && (
                    <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">이해도 체크</p>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                          이해했어요 ✓
                        </button>
                        <button className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors">
                          다시 설명해주세요
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">생각하는 중...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="질문을 입력하세요..."
                className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Learning Tips Sidebar */}
        <div className="space-y-6">
          {/* Current Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              오늘의 학습
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">질문 횟수</span>
                  <span className="text-gray-900 dark:text-gray-100">12회</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">이해도</span>
                  <span className="text-gray-900 dark:text-gray-100">85%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Tips */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl shadow-lg p-6 border border-purple-100 dark:border-purple-800">
            <h3 className="text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              학습 팁
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 mt-0.5">•</span>
                <span className="text-gray-700 dark:text-gray-300">답을 바로 요구하지 말고, 문제 해결 과정을 질문하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 mt-0.5">•</span>
                <span className="text-gray-700 dark:text-gray-300">이해가 안 되면 즉시 "다시 설명해주세요"를 눌러주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 mt-0.5">•</span>
                <span className="text-gray-700 dark:text-gray-300">스스로 먼저 생각하고, AI는 가이드로 활용하세요</span>
              </li>
            </ul>
          </div>

          {/* Alert */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl shadow-lg p-6 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-amber-900 dark:text-amber-100 mb-1">주의하세요</h4>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  AI가 제공하는 답변을 무조건 복사하지 말고, 이해하고 자신의 언어로 표현해보세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}