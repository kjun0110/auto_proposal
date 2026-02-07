import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIHumanProps {
  theme: 'light' | 'dark';
}

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export function AIHuman({ theme }: AIHumanProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: '안녕하세요! 저는 Gemini AI 어시스턴트입니다. 무엇을 도와드릴까요?',
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsThinking(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      '좋은 질문이네요! 제가 도와드리겠습니다. AI 기술을 활용하면 업무 효율을 크게 향상시킬 수 있습니다.',
      '네, 이해했습니다. 해당 내용에 대해 자세히 설명드리겠습니다.',
      '흥미로운 주제입니다. 더 자세한 정보가 필요하시다면 말씀해 주세요.',
      '제 분석 결과에 따르면, 이 방법이 가장 효과적일 것 같습니다.',
      '물론입니다! 단계별로 설명드리겠습니다.',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const quickPrompts = [
    '공모사업 찾기',
    '제안서 작성 도움',
    '프로젝트 관리 팁',
    'AI 활용 방법',
  ];

  return (
    <div className="h-full w-full flex flex-col min-h-0 p-6 md:p-8">
      <div className="mb-6 shrink-0">
        <h2 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>AI 휴먼</h2>
        <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Gemini AI와 대화하기</p>
      </div>

      <div className={`flex-1 min-h-0 flex flex-col rounded-2xl overflow-hidden border min-w-0 ${
        theme === 'dark' ? 'bg-[#2C2C2E] border-white/10' : 'bg-white border-gray-200 shadow-sm'
      }`}>
          <div className={`flex-1 min-h-0 flex flex-col ${theme === 'dark' ? 'bg-[#2C2C2E]' : 'bg-white'}`}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 min-h-0">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={
                        message.type === 'user'
                          ? 'flex gap-4 max-w-[85%] flex-row-reverse'
                          : 'flex gap-4 max-w-[85%] flex-row'
                      }
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === 'user'
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                            : 'bg-gradient-to-br from-blue-500 to-purple-600'
                        }`}
                      >
                        {message.type === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-white" />
                        )}
                      </div>

                      {/* Message Content */}
                      <div>
                        <div
                          className={`px-5 py-4 rounded-2xl ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : theme === 'dark'
                                ? 'bg-[#1C1C1E] text-gray-100'
                                : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {message.content}
                        </div>
                        <p className={`text-xs mt-2 px-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{message.timestamp}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isThinking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-4 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className={`px-5 py-4 rounded-2xl ${
                      theme === 'dark' ? 'bg-[#1C1C1E]' : 'bg-gray-100'
                    }`}>
                      <div className="flex gap-1">
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-6 md:px-8 pb-5 shrink-0">
              <div className="flex flex-wrap gap-3">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(prompt)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      theme === 'dark'
                        ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input: 음성 버튼 + 입력창 + 전송 버튼 */}
            <div className={`p-5 md:p-6 border-t shrink-0 ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="flex gap-3 items-center">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`shrink-0 p-3 rounded-xl transition-all ${
                    isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  aria-label={isListening ? '음성 끄기' : '음성 입력'}
                >
                  {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
                </button>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.shiftKey && handleSendMessage()}
                  placeholder="메시지를 입력하세요..."
                  className={`flex-1 min-w-0 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#1C1C1E] border-white/10 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="shrink-0 p-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}