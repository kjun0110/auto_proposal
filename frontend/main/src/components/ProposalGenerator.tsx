import { useState } from 'react';
import { Sparkles, FileText, Download, Copy, Check, Save } from 'lucide-react';
import { motion } from 'motion/react';

interface ProposalGeneratorProps {
  theme: 'light' | 'dark';
}

export function ProposalGenerator({ theme }: ProposalGeneratorProps) {
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [objectives, setObjectives] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const mockProposal = `# ${projectName || '프로젝트 제안서'}

## 1. 프로젝트 개요
본 제안서는 ${projectType || '사업'} 분야의 혁신적인 프로젝트를 위한 것입니다.

## 2. 사업 목적
${objectives || '본 프로젝트는 다음과 같은 목적을 달성하고자 합니다:\n- 혁신적인 기술 개발\n- 시장 경쟁력 강화\n- 고객 만족도 향상'}

## 3. 사업 내용
### 3.1 추진 배경
현재 시장 환경에서 디지털 전환과 AI 기술의 중요성이 날로 증대되고 있습니다. 본 프로젝트는 이러한 시장 요구에 부응하여 혁신적인 솔루션을 제공하고자 합니다.

### 3.2 주요 내용
- **기술 개발**: 최신 AI 및 머신러닝 기술을 활용한 솔루션 개발
- **시장 진출**: 국내외 시장을 대상으로 한 전략적 진출
- **파트너십**: 주요 기업들과의 협력 체계 구축

## 4. 추진 일정
- **전체 기간**: ${duration || '12개월'}
- **1단계** (1-3개월): 기획 및 설계
- **2단계** (4-8개월): 개발 및 테스트
- **3단계** (9-12개월): 출시 및 마케팅

## 5. 소요 예산
- **총 예산**: ${budget || '5억원'}
- 인건비: 40%
- 개발비: 35%
- 마케팅비: 15%
- 기타 운영비: 10%

## 6. 기대 효과
### 6.1 경제적 효과
- 매출 증대: 연간 10억원 이상 예상
- 일자리 창출: 20명 이상의 신규 고용

### 6.2 기술적 효과
- 독자적 기술 확보
- 특허 출원 5건 이상
- 기술 경쟁력 향상

## 7. 결론
본 프로젝트는 혁신적인 기술과 전략적 접근을 통해 시장에서의 경쟁 우위를 확보하고, 지속 가능한 성장을 이루어낼 것입니다.`;

      setGeneratedContent(mockProposal);
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!generatedContent) return;
    const htmlContent = generatedContent
      .replace(/\n/g, '<br>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const doc = `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>제안서</title><!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]--><style>body{font-family:Malgun Gothic,sans-serif;padding:2rem;line-height:1.6}h1{font-size:1.5rem}h2{font-size:1.25rem;margin-top:1.5rem}h3{font-size:1.1rem;margin-top:1rem}</style></head><body>${htmlContent}</body></html>`;
    const blob = new Blob(['\ufeff' + doc], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `제안서_${new Date().toISOString().slice(0, 10)}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 h-full">
      <div className="mb-6">
        <h2 className={`text-3xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>AI 제안서 작성</h2>
        <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>AI를 활용한 자동 제안서 생성</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        {/* Left Panel - Input */}
        <div className={`rounded-2xl p-6 border overflow-y-auto ${
          theme === 'dark'
            ? 'bg-[#2C2C2E] border-white/10'
            : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-6">
            <FileText className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>입력 정보</h3>
          </div>

          <div className="space-y-4">
            {/* Project Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                프로젝트명 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="예: AI 기반 스마트 솔루션 개발"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-500 transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#1C1C1E] border-white/10 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>

            {/* Project Type */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                사업 유형 <span className="text-red-400">*</span>
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-500 transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#1C1C1E] border-white/10 text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              >
                <option value="">선택하세요</option>
                <option value="기술개발">기술개발</option>
                <option value="사업화">사업화</option>
                <option value="연구개발">연구개발</option>
                <option value="마케팅">마케팅</option>
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                예산 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="예: 5억원"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-500 transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#1C1C1E] border-white/10 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>

            {/* Duration */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                추진 기간 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="예: 12개월"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-500 transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#1C1C1E] border-white/10 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>

            {/* Objectives */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                사업 목표
              </label>
              <textarea
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                placeholder="프로젝트의 주요 목표를 입력하세요..."
                rows={6}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-500 transition-colors resize-none ${
                  theme === 'dark'
                    ? 'bg-[#1C1C1E] border-white/10 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  <span>생성 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>AI로 생성하기</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Panel - Output */}
        <div className={`rounded-2xl p-6 border flex flex-col ${
          theme === 'dark'
            ? 'bg-[#2C2C2E] border-white/10'
            : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`} />
              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>생성된 제안서</h3>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={!generatedContent}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  generatedContent
                    ? theme === 'dark'
                      ? 'bg-white/10 hover:bg-white/15 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    : theme === 'dark'
                      ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
                title="Word 문서로 저장"
              >
                <Save className="w-4 h-4" />
                저장
              </button>
              {generatedContent && (
                <>
                  <button
                    onClick={handleCopy}
                    className={`p-2 rounded-xl transition-all ${
                      theme === 'dark'
                        ? 'bg-white/5 hover:bg-white/10'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    title="복사"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                    )}
                  </button>
                  <button
                    className={`p-2 rounded-xl transition-all ${
                      theme === 'dark'
                        ? 'bg-white/5 hover:bg-white/10'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    title="다운로드"
                  >
                    <Download className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {generatedContent ? (
              <div className="prose prose-invert max-w-none">
                <pre className={`whitespace-pre-wrap leading-relaxed font-sans ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {generatedContent}
                </pre>
              </div>
            ) : (
              <div className={`h-full flex items-center justify-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>좌측 입력 정보를 작성하고</p>
                  <p>"AI로 생성하기" 버튼을 눌러주세요</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}