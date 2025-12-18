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

export interface DashboardAPIService {
  getDashboardStats(): Promise<GetDashboardStatsResponse>;
  getLearningTrend(period?: 'week' | 'month'): Promise<GetLearningTrendResponse>;
  getQuestionTypes(period?: 'week' | 'month'): Promise<GetQuestionTypesResponse>;
  getStudents(params?: { search?: string; page?: number; limit?: number }): Promise<GetStudentsResponse>;
  getStudentDetail(studentId: string): Promise<GetStudentDetailResponse>;
}
