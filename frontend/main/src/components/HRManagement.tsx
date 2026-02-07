import { useState } from 'react';
import { Search, Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HRManagementProps {
  theme: 'light' | 'dark';
}

// Mock data
const statsData = [
  { icon: Users, label: '총 직원', value: '248', change: '+12', color: 'from-blue-500 to-blue-600' },
  { icon: UserCheck, label: '출근', value: '231', change: '+5', color: 'from-green-500 to-green-600' },
  { icon: UserX, label: '부재', value: '17', change: '-3', color: 'from-orange-500 to-orange-600' },
  { icon: TrendingUp, label: '출석률', value: '93%', change: '+2%', color: 'from-purple-500 to-purple-600' },
];

const attendanceData = [
  { day: '월', attendance: 92 },
  { day: '화', attendance: 95 },
  { day: '수', attendance: 88 },
  { day: '목', attendance: 93 },
  { day: '금', attendance: 97 },
  { day: '토', attendance: 45 },
  { day: '일', attendance: 12 },
];

const employeesData = [
  { id: 1, name: '김철수', department: '개발팀', position: '시니어 개발자', status: '출근', attendance: '95%' },
  { id: 2, name: '이영희', department: '디자인팀', position: '리드 디자이너', status: '출근', attendance: '98%' },
  { id: 3, name: '박민수', department: '마케팅팀', position: '마케팅 매니저', status: '출근', attendance: '92%' },
  { id: 4, name: '정수진', department: '인사팀', position: 'HR 매니저', status: '부재', attendance: '88%' },
  { id: 5, name: '강동원', department: '개발팀', position: '주니어 개발자', status: '출근', attendance: '96%' },
  { id: 6, name: '송지은', department: '디자인팀', position: 'UI/UX 디자이너', status: '출근', attendance: '94%' },
  { id: 7, name: '윤상호', department: '영업팀', position: '영업 대표', status: '출근', attendance: '91%' },
  { id: 8, name: '한소희', department: '개발팀', position: '프론트엔드 개발자', status: '부재', attendance: '89%' },
];

export function HRManagement({ theme }: HRManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employeesData.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-3xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>인사관리</h2>
        <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>직원 현황 및 출석 관리</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`rounded-2xl p-6 border transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-[#2C2C2E] border-white/10 hover:border-white/20'
                  : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                  <p className={`text-3xl font-semibold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                  <p className="text-green-500 text-sm mt-2">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attendance Chart */}
      <div className={`rounded-2xl p-6 border ${
        theme === 'dark'
          ? 'bg-[#2C2C2E] border-white/10'
          : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <h3 className={`text-xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>주간 출석 현황</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#333' : '#e5e7eb'} />
            <XAxis dataKey="day" stroke={theme === 'dark' ? '#888' : '#6b7280'} />
            <YAxis stroke={theme === 'dark' ? '#888' : '#6b7280'} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1C1C1E' : '#ffffff',
                border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
                borderRadius: '12px',
                color: theme === 'dark' ? '#fff' : '#000'
              }}
            />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Employee List */}
      <div className={`rounded-2xl p-6 border ${
        theme === 'dark'
          ? 'bg-[#2C2C2E] border-white/10'
          : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>직원 목록</h3>
          
          {/* Search */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:border-blue-500 transition-colors ${
                theme === 'dark'
                  ? 'bg-[#1C1C1E] border-white/10 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                <th className={`text-left py-3 px-4 font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>이름</th>
                <th className={`text-left py-3 px-4 font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>부서</th>
                <th className={`text-left py-3 px-4 font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>직급</th>
                <th className={`text-left py-3 px-4 font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>상태</th>
                <th className={`text-left py-3 px-4 font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>출석률</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className={`border-b transition-colors ${
                    theme === 'dark'
                      ? 'border-white/5 hover:bg-white/5'
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {employee.name.charAt(0)}
                      </div>
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{employee.name}</span>
                    </div>
                  </td>
                  <td className={`py-4 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{employee.department}</td>
                  <td className={`py-4 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{employee.position}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        employee.status === '출근'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-orange-500/20 text-orange-400'
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className={`py-4 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{employee.attendance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}