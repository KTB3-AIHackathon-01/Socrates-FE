export interface Student {
  id: string;
  name: string;
  questionsCount: number;
  comprehensionRate: number;
  lastActive: string;
  trend: 'up' | 'down' | 'stable';
}

export interface DashboardStats {
  activeStudents: {
    count: number;
    changePercentage: number;
  };
  todayQuestions: {
    count: number;
    changePercentage: number;
  };
  averageComprehension: {
    rate: number;
    changePercentage: number;
  };
  participationRate: {
    rate: number;
    changePercentage: number;
  };
}

export interface LearningTrendData {
  date: string;
  questions: number;
  comprehension: number;
}

export interface QuestionTypeData {
  type: string;
  count: number;
}

export interface StudentActivity {
  id: string;
  topic: string;
  timestamp: string;
  comprehensionRate: number;
}

export interface StudentDetail {
  id: string;
  name: string;
  questionsCount: number;
  comprehensionRate: number;
  lastActive: string;
  recentActivities: StudentActivity[];
  aiRecommendation: string;
}

export interface GetDashboardStatsResponse {
  stats: DashboardStats;
}

export interface GetLearningTrendResponse {
  data: LearningTrendData[];
}

export interface GetQuestionTypesResponse {
  data: QuestionTypeData[];
}

export interface GetStudentsResponse {
  students: Student[];
  total: number;
}

export interface GetStudentDetailResponse {
  student: StudentDetail;
}

// 질문 키워드 빈도 TOP N
export interface KeywordFrequency {
  keyword: string;
  count: number;
}

// 주제별 질문 밀집도 (개념 히트맵)
export interface TopicQuestionSummary {
  topic: string;
  questionCount: number;
  sampleQuestions: string[];
}

// 특정 키워드 원본 질문 리스트
export interface KeywordQuestion {
  studentId: string;
  content: string;
  createdAt: string;
}

export interface DashboardAPIService {
  getDashboardStats(): Promise<GetDashboardStatsResponse>;
  getLearningTrend(period?: 'week' | 'month'): Promise<GetLearningTrendResponse>;
  getQuestionTypes(period?: 'week' | 'month'): Promise<GetQuestionTypesResponse>;
  getStudents(params?: { search?: string; page?: number; limit?: number }): Promise<GetStudentsResponse>;
  getStudentDetail(studentId: string): Promise<GetStudentDetailResponse>;

  // 인사이트 핵심 지표
  getKeywordFrequencies(params: { classId: string | number }): Promise<KeywordFrequency[]>;
  getTopicQuestionSummaries(params: { classId: string | number }): Promise<TopicQuestionSummary[]>;
  getKeywordQuestions(params: {
    classId: string | number;
    keyword: string;
  }): Promise<KeywordQuestion[]>;
}
