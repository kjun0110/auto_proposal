import { useState, useMemo, useRef, useEffect } from 'react';
import { RefreshCw, Search, ChevronDown, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';

interface ProjectCrawlingProps {
  theme: 'light' | 'dark';
}

interface Project {
  id: number;
  source: string;
  status: 'active' | 'crawling' | 'completed';
  title: string;
  category: string;
  startDate: string;
  deadline: string;
  infoCollectedAt: string;
  collectedAt: string;
  amount: string;
  timestamp: string;
  /** 크롤링 원문 URI. 있으면 자세히 보기 클릭 시 새 탭에서 열림 */
  url?: string;
}

function formatCollectedAt(datetime: string): string {
  const d = new Date(datetime.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return datetime;
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const h = d.getHours();
  const min = d.getMinutes();
  return `${y}년 ${m}월 ${day}일 ${h}시 ${min}분`;
}

type DateFilterType = 'startDate' | 'deadline' | 'infoCollectedAt';
type SortBy = 'startDate' | 'deadline' | 'infoCollectedAt';
type SortOrder = 'asc' | 'desc';
type ListTab = 'recruiting' | 'closed';

const projectsData: Project[] = [
  { id: 1, source: 'K-Startup', status: 'crawling', title: '2026년 스타트업 육성 지원 사업', category: '창업지원', startDate: '2026-01-15', deadline: '2026-02-28', infoCollectedAt: '2026-02-05', collectedAt: '2026-02-05 14:35', amount: '최대 5억원', timestamp: '방금 전' },
  { id: 2, source: 'Gov.kr', status: 'active', title: '중소기업 디지털 전환 지원 프로그램', category: '디지털전환', startDate: '2026-02-01', deadline: '2026-03-15', infoCollectedAt: '2026-02-04', collectedAt: '2026-02-04 11:20', amount: '최대 3억원', timestamp: '5분 전' },
  { id: 3, source: 'KOITA', status: 'active', title: 'AI 기술개발 및 사업화 지원', category: 'AI/ICT', startDate: '2026-01-20', deadline: '2026-02-20', infoCollectedAt: '2026-02-03', collectedAt: '2026-02-03 09:15', amount: '최대 10억원', timestamp: '15분 전' },
  { id: 4, source: 'K-Startup', status: 'completed', title: '혁신형 소상공인 지원 사업', category: '소상공인', startDate: '2026-01-10', deadline: '2026-03-01', infoCollectedAt: '2026-02-02', collectedAt: '2026-02-02 16:00', amount: '최대 2억원', timestamp: '1시간 전' },
  { id: 5, source: 'TIPS', status: 'crawling', title: '기술창업 기업 투자유치 지원', category: '투자연계', startDate: '2026-02-05', deadline: '2026-04-10', infoCollectedAt: '2026-02-07', collectedAt: '2026-02-07 15:42', amount: '최대 7억원', timestamp: '방금 전' },
  { id: 6, source: 'Gov.kr', status: 'active', title: '청년창업 사관학교 모집', category: '청년창업', startDate: '2026-01-25', deadline: '2026-02-25', infoCollectedAt: '2026-02-01', collectedAt: '2026-02-01 10:05', amount: '최대 1억원', timestamp: '30분 전' },
  { id: 7, source: 'KOITA', status: 'active', title: '글로벌 진출 스타트업 지원', category: '글로벌', startDate: '2026-02-10', deadline: '2026-03-20', infoCollectedAt: '2026-02-06', collectedAt: '2026-02-06 13:28', amount: '최대 15억원', timestamp: '2시간 전' },
  { id: 8, source: 'Gov.kr', status: 'active', title: '지역균형 R&D 혁신사업', category: 'AI/ICT', startDate: '2026-02-01', deadline: '2026-03-31', infoCollectedAt: '2026-02-05', collectedAt: '2026-02-05 09:00', amount: '최대 4억원', timestamp: '1일 전' },
  { id: 9, source: 'K-Startup', status: 'active', title: '예비창업자 패키지 지원', category: '창업지원', startDate: '2026-01-28', deadline: '2026-04-15', infoCollectedAt: '2026-02-04', collectedAt: '2026-02-04 14:22', amount: '최대 2천만원', timestamp: '2일 전' },
  { id: 10, source: 'TIPS', status: 'active', title: '딥테크 기술사업화 지원', category: '투자연계', startDate: '2026-02-08', deadline: '2026-05-01', infoCollectedAt: '2026-02-07', collectedAt: '2026-02-07 10:15', amount: '최대 8억원', timestamp: '방금 전' },
  { id: 11, source: 'KOITA', status: 'active', title: '스마트팩토리 구축 지원사업', category: '디지털전환', startDate: '2026-02-03', deadline: '2026-04-20', infoCollectedAt: '2026-02-06', collectedAt: '2026-02-06 16:45', amount: '최대 6억원', timestamp: '3시간 전' },
];

const CATEGORIES = ['전체', '창업지원', '디지털전환', 'AI/ICT', '소상공인', '투자연계', '청년창업', '글로벌'];
const PER_PAGE = 10;

function formatCrawledAt(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${h}:${min}`;
}


export function ProjectCrawling({ theme }: ProjectCrawlingProps) {
  const [lastCrawledAt, setLastCrawledAt] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilterType, setDateFilterType] = useState<DateFilterType>('infoCollectedAt');
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);
  const [dateTypeOpen, setDateTypeOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [listTab, setListTab] = useState<ListTab>('recruiting');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy>('infoCollectedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [searchQueryApplied, setSearchQueryApplied] = useState('');
  const [dateFilterTypeApplied, setDateFilterTypeApplied] = useState<DateFilterType>('infoCollectedAt');
  const [dateFromApplied, setDateFromApplied] = useState<string | null>(null);
  const [dateToApplied, setDateToApplied] = useState<string | null>(null);
  const [categoryFilterApplied, setCategoryFilterApplied] = useState('전체');

  const dateTypeRef = useRef<HTMLDivElement>(null);
  const dateFromInputRef = useRef<HTMLInputElement>(null);
  const dateToInputRef = useRef<HTMLInputElement>(null);

  const applyFilters = () => {
    setSearchQueryApplied(searchQuery);
    setDateFilterTypeApplied(dateFilterType);
    setDateFromApplied(dateFrom);
    setDateToApplied(dateTo);
    setCategoryFilterApplied(categoryFilter);
    setCurrentPage(1);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dateTypeRef.current && !dateTypeRef.current.contains(e.target as Node)) setDateTypeOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAndSortedProjects = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    let list = projectsData.filter(project => {
      if (listTab === 'recruiting') {
        if (project.deadline < today) return false;
      } else {
        if (project.deadline >= today) return false;
      }

      const matchSearch =
        !searchQueryApplied.trim() ||
        project.title.toLowerCase().includes(searchQueryApplied.toLowerCase()) ||
        project.source.toLowerCase().includes(searchQueryApplied.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQueryApplied.toLowerCase());
      if (!matchSearch) return false;

      if (dateFromApplied || dateToApplied) {
        const projectDate = dateFilterTypeApplied === 'infoCollectedAt' ? project.infoCollectedAt : project[dateFilterTypeApplied];
        if (dateFromApplied && projectDate < dateFromApplied) return false;
        if (dateToApplied && projectDate > dateToApplied) return false;
      }

      if (categoryFilterApplied !== '전체' && project.category !== categoryFilterApplied) return false;
      return true;
    });

    const key = sortBy === 'startDate' ? 'startDate' : sortBy === 'deadline' ? 'deadline' : 'infoCollectedAt';
    list = [...list].sort((a, b) => {
      const cmp = a[key].localeCompare(b[key]);
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [listTab, searchQueryApplied, dateFilterTypeApplied, dateFromApplied, dateToApplied, categoryFilterApplied, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProjects.length / PER_PAGE));
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredAndSortedProjects.slice(start, start + PER_PAGE);
  }, [filteredAndSortedProjects, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [listTab]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastCrawledAt(new Date());
      setIsRefreshing(false);
    }, 1500);
  };

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      'K-Startup': 'from-blue-500 to-blue-600',
      'Gov.kr': 'from-green-500 to-green-600',
      'KOITA': 'from-purple-500 to-purple-600',
      'TIPS': 'from-orange-500 to-orange-600',
    };
    return colors[source] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-3xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>공모사업 정보</h2>
        </div>
      </div>

      {/* 모집중/모집마감 + 최근 수집일·정렬 같은 라인 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className={`flex rounded-xl border overflow-hidden w-fit ${
          theme === 'dark' ? 'bg-[#2C2C2E] border-white/10' : 'bg-white border-gray-200'
        }`}>
          <button
            type="button"
            onClick={() => setListTab('recruiting')}
            className={`min-w-[7.5rem] px-5 py-2.5 text-sm font-medium transition-all ${
              listTab === 'recruiting'
                ? theme === 'dark' ? 'bg-white/10 text-white' : 'bg-blue-500 text-white'
                : theme === 'dark' ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            모집중
          </button>
          <button
            type="button"
            onClick={() => setListTab('closed')}
            className={`min-w-[7.5rem] px-5 py-2.5 text-sm font-medium transition-all ${
              listTab === 'closed'
                ? theme === 'dark' ? 'bg-white/10 text-white' : 'bg-blue-500 text-white'
                : theme === 'dark' ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            모집마감
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-all ${
              theme === 'dark'
                ? 'bg-[#2C2C2E] border-white/10 hover:border-white/20 text-white'
                : 'bg-white border-gray-200 hover:border-gray-300 text-gray-900'
            }`}
            title={sortOrder === 'asc' ? '오름차순 (클릭 시 내림차순)' : '내림차순 (클릭 시 오름차순)'}
          >
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{sortOrder === 'asc' ? '오름차순' : '내림차순'}</span>
            <span className={`p-1.5 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
              {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            </span>
          </button>
          <div className={`flex rounded-xl border overflow-hidden ${
            theme === 'dark' ? 'bg-[#2C2C2E] border-white/10' : 'bg-white border-gray-200'
          }`}>
            <button
              onClick={() => setSortBy('infoCollectedAt')}
              className={`px-4 py-2 text-sm transition-all ${
                sortBy === 'infoCollectedAt'
                  ? theme === 'dark' ? 'bg-white/10 text-white' : 'bg-blue-500 text-white'
                  : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              정보 수집일
            </button>
            <button
              onClick={() => setSortBy('startDate')}
              className={`px-4 py-2 text-sm transition-all ${
                sortBy === 'startDate'
                  ? theme === 'dark' ? 'bg-white/10 text-white' : 'bg-blue-500 text-white'
                  : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              모집 시작일
            </button>
            <button
              onClick={() => setSortBy('deadline')}
              className={`px-4 py-2 text-sm transition-all ${
                sortBy === 'deadline'
                  ? theme === 'dark' ? 'bg-white/10 text-white' : 'bg-blue-500 text-white'
                  : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              모집 마감일
            </button>
          </div>
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            최근 수집일: {lastCrawledAt ? formatCrawledAt(lastCrawledAt) : '—'}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-2 rounded-lg border transition-all ${
              theme === 'dark'
                ? 'bg-[#2C2C2E] border-white/10 hover:border-white/20'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''} ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
          </button>
        </div>
      </div>

      {/* Search + 필터 한 라인 */}
      <div className={`flex flex-wrap items-center gap-3 rounded-xl border p-2 ${
        theme === 'dark' ? 'bg-[#2C2C2E] border-white/10' : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-1 min-w-[180px] items-center gap-2">
          <Search className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyFilters(); } }}
            placeholder="사업명, 기관, 분야로 검색..."
            className={`flex-1 min-w-0 bg-transparent text-sm outline-none ${theme === 'dark' ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'}`}
          />
          <button
            type="button"
            onClick={applyFilters}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            검색
          </button>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className={`rounded-lg border px-3 py-2 text-sm outline-none ${
              theme === 'dark'
                ? 'bg-[#1C1C1E] border-white/10 text-white'
                : 'bg-gray-50 border-gray-200 text-gray-900'
            }`}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative" ref={dateTypeRef}>
            <button
              type="button"
              onClick={() => setDateTypeOpen(prev => !prev)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm min-w-[120px] justify-between ${
                theme === 'dark'
                  ? 'bg-[#1C1C1E] border-white/10 text-white hover:border-white/20'
                  : 'bg-gray-50 border-gray-200 text-gray-900 hover:border-gray-300'
              }`}
            >
              <span>{dateFilterType === 'infoCollectedAt' ? '정보 수집일' : dateFilterType === 'startDate' ? '모집 시작일' : '모집 마감일'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${dateTypeOpen ? 'rotate-180' : ''}`} />
            </button>
            {dateTypeOpen && (
              <div className={`absolute top-full left-0 mt-1 z-10 rounded-lg border shadow-lg min-w-[120px] overflow-hidden ${
                theme === 'dark' ? 'bg-[#2C2C2E] border-white/10' : 'bg-white border-gray-200'
              }`}>
                <button
                  type="button"
                  onClick={() => { setDateFilterType('infoCollectedAt'); setDateTypeOpen(false); }}
                  className={`block w-full text-left px-3 py-2 text-sm ${
                    dateFilterType === 'infoCollectedAt'
                      ? theme === 'dark' ? 'bg-white/10 text-white' : 'bg-blue-50 text-blue-600'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  정보 수집일
                </button>
                <button
                  type="button"
                  onClick={() => { setDateFilterType('startDate'); setDateTypeOpen(false); }}
                  className={`block w-full text-left px-3 py-2 text-sm ${
                    dateFilterType === 'startDate'
                      ? theme === 'dark' ? 'bg-white/10 text-white' : 'bg-blue-50 text-blue-600'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  모집 시작일
                </button>
                <button
                  type="button"
                  onClick={() => { setDateFilterType('deadline'); setDateTypeOpen(false); }}
                  className={`block w-full text-left px-3 py-2 text-sm ${
                    dateFilterType === 'deadline'
                      ? theme === 'dark' ? 'bg-white/10 text-white' : 'bg-blue-50 text-blue-600'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  모집 마감일
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
              <div
                role="button"
                tabIndex={0}
                onClick={() => dateFromInputRef.current?.showPicker?.() ?? dateFromInputRef.current?.click()}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dateFromInputRef.current?.showPicker?.() ?? dateFromInputRef.current?.click(); } }}
                className={`relative flex items-center gap-4 rounded-lg border pl-2 pr-2 py-1.5 min-w-[132px] w-[132px] h-9 cursor-pointer ${
                  theme === 'dark' ? 'bg-[#1C1C1E] border-white/10' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Calendar className={`w-4 h-4 flex-shrink-0 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`flex-1 text-sm truncate text-left ${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${!dateFrom ? (theme === 'dark' ? 'text-gray-500' : 'text-gray-400') : ''}`}>
                  {dateFrom || '시작일'}
                </span>
                <input
                  ref={dateFromInputRef}
                  type="date"
                  value={dateFrom ?? ''}
                  onChange={e => setDateFrom(e.target.value || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-none [color-scheme:auto]"
                  tabIndex={-1}
                  aria-hidden
                />
              </div>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>~</span>
              <div
                role="button"
                tabIndex={0}
                onClick={() => dateToInputRef.current?.showPicker?.() ?? dateToInputRef.current?.click()}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dateToInputRef.current?.showPicker?.() ?? dateToInputRef.current?.click(); } }}
                className={`relative flex items-center gap-4 rounded-lg border pl-2 pr-2 py-1.5 min-w-[132px] w-[132px] h-9 cursor-pointer ${
                  theme === 'dark' ? 'bg-[#1C1C1E] border-white/10' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Calendar className={`w-4 h-4 flex-shrink-0 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`flex-1 text-sm truncate text-left ${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${!dateTo ? (theme === 'dark' ? 'text-gray-500' : 'text-gray-400') : ''}`}>
                  {dateTo || '마감일'}
                </span>
                <input
                  ref={dateToInputRef}
                  type="date"
                  value={dateTo ?? ''}
                  onChange={e => setDateTo(e.target.value || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-none [color-scheme:auto]"
                  tabIndex={-1}
                  aria-hidden
                />
              </div>
            </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {paginatedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-xl p-5 border transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-[#2C2C2E] border-white/10 hover:border-white/20'
                  : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getSourceColor(project.source)} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                    {project.source.split('-')[0].substring(0, 2)}
                  </div>
                  {index !== paginatedProjects.length - 1 && (
                    <div className={`w-0.5 h-full min-h-[28px] mt-2 ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className={`text-lg font-semibold leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{project.title}</h3>
                    <span className="text-base flex-shrink-0">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>정보 수집일: </span>
                      <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{formatCollectedAt(project.collectedAt)}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>출처 : <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{project.source}</span></span>
                      <button
                        type="button"
                        onClick={() => { if (project.url) window.open(project.url, '_blank', 'noopener,noreferrer'); }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                          theme === 'dark'
                            ? 'bg-white/5 hover:bg-white/10 text-white border-white/30 hover:border-white/50'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border-gray-400 hover:border-gray-600'
                        } ${!project.url ? 'opacity-80 cursor-default' : 'cursor-pointer'}`}
                      >
                        자세히 보기
                      </button>
                      <button
                        type="button"
                        onClick={() => {}}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                          theme === 'dark'
                            ? 'bg-white/5 hover:bg-white/10 text-white border-white/30 hover:border-white/50'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border-gray-400 hover:border-gray-600'
                        } cursor-pointer`}
                      >
                        제안서 작성
                      </button>
                    </div>
                    <div className="flex items-center gap-5 text-base flex-wrap">
                      <span className="flex items-center gap-2">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>모집일:</span>
                        <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{project.startDate} ~ {project.deadline}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>지원금:</span>
                        <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{project.amount}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`flex items-center justify-center gap-2 pt-6 pb-2 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <button
            type="button"
            onClick={() => goToPage(Math.max(1, currentPage - 10))}
            disabled={currentPage <= 1}
            title="10페이지 이전"
            className={`min-w-[42px] h-11 rounded-lg border text-base font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              theme === 'dark'
                ? 'bg-[#2C2C2E] border-white/10 hover:border-white/20 hover:bg-white/5'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            &lt;&lt;
          </button>
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            title="이전 페이지"
            className={`min-w-[42px] h-11 rounded-lg border text-base font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              theme === 'dark'
                ? 'bg-[#2C2C2E] border-white/10 hover:border-white/20 hover:bg-white/5'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            &lt;
          </button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                className={`min-w-[42px] h-11 rounded-lg border text-base font-medium transition-all ${
                  currentPage === page
                    ? theme === 'dark'
                      ? 'bg-white/15 border-white/20 text-white'
                      : 'bg-blue-500 border-blue-500 text-white'
                    : theme === 'dark'
                      ? 'bg-[#2C2C2E] border-white/10 hover:border-white/20 text-gray-300'
                      : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            title="다음 페이지"
            className={`min-w-[42px] h-11 rounded-lg border text-base font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              theme === 'dark'
                ? 'bg-[#2C2C2E] border-white/10 hover:border-white/20 hover:bg-white/5'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            &gt;
          </button>
          <button
            type="button"
            onClick={() => goToPage(Math.min(totalPages, currentPage + 10))}
            disabled={currentPage >= totalPages}
            title="10페이지 다음"
            className={`min-w-[42px] h-11 rounded-lg border text-base font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              theme === 'dark'
                ? 'bg-[#2C2C2E] border-white/10 hover:border-white/20 hover:bg-white/5'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            &gt;&gt;
          </button>
        </div>
      )}
    </div>
  );
}
