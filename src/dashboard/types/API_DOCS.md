# Dashboard API 타입 명세

## 데이터 타입

### Student
학생 목록 테이블에 표시되는 학생 정보

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `string` | 학생 고유 ID |
| `name` | `string` | 학생 이름 |
| `questionsCount` | `number` | 총 질문 수 |
| `comprehensionRate` | `number` | 이해도 (0-100) |
| `lastActive` | `string` | 마지막 활동 시간 (예: "5분 전", "2시간 전") |
| `trend` | `'up' \| 'down' \| 'stable'` | 학습 추세 (상승/하락/유지) |

---

### DashboardStats
대시보드 상단 4개 통계 카드 데이터

| 필드 | 타입 | 설명 |
|------|------|------|
| `activeStudents` | `object` | 활성 학생 통계 |
| `activeStudents.count` | `number` | 활성 학생 수 (예: 128) |
| `activeStudents.changePercentage` | `number` | 전일 대비 변화율 (예: 12 = +12%) |
| `todayQuestions` | `object` | 오늘의 질문 통계 |
| `todayQuestions.count` | `number` | 오늘 질문 수 (예: 1247) |
| `todayQuestions.changePercentage` | `number` | 전일 대비 변화율 (예: 8 = +8%) |
| `averageComprehension` | `object` | 평균 이해도 통계 |
| `averageComprehension.rate` | `number` | 평균 이해도 (예: 86.5) |
| `averageComprehension.changePercentage` | `number` | 전일 대비 변화율 (예: 5 = +5%) |
| `participationRate` | `object` | 학습 참여율 통계 |
| `participationRate.rate` | `number` | 참여율 (예: 94.2) |
| `participationRate.changePercentage` | `number` | 전일 대비 변화율 (예: 15 = +15%) |

---

### LearningTrendData
주간 학습 추이 차트 데이터 (LineChart)

| 필드 | 타입 | 설명 |
|------|------|------|
| `date` | `string` | 날짜 레이블 (예: "월", "화", "수") |
| `questions` | `number` | 해당 날짜의 질문 수 |
| `comprehension` | `number` | 해당 날짜의 이해도 평균 |

**배열 예시:**
```typescript
[
  { date: '월', questions: 24, comprehension: 78 },
  { date: '화', questions: 32, comprehension: 82 },
  ...
]
```

---

### QuestionTypeData
질문 유형 분석 파이 차트 데이터

| 필드 | 타입 | 설명 |
|------|------|------|
| `type` | `string` | 질문 유형 (예: "개념 이해", "문제 해결", "심화 학습", "복습") |
| `count` | `number` | 해당 유형의 질문 수 |

**배열 예시:**
```typescript
[
  { type: '개념 이해', count: 45 },
  { type: '문제 해결', count: 38 },
  { type: '심화 학습', count: 22 },
  { type: '복습', count: 15 }
]
```

---

### StudentActivity
학생 상세 모달에 표시되는 최근 활동 내역

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `string` | 활동 고유 ID |
| `topic` | `string` | 학습 주제 (예: "Python 리스트 컴프리헨션 개념 학습") |
| `timestamp` | `string` | 활동 시간 (예: "15분 전", "1시간 전") |
| `comprehensionRate` | `number` | 해당 활동의 이해도 (0-100) |

---

### StudentDetail
학생 상세 정보 모달 데이터

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `string` | 학생 고유 ID |
| `name` | `string` | 학생 이름 |
| `questionsCount` | `number` | 총 질문 수 |
| `comprehensionRate` | `number` | 이해도 (0-100) |
| `lastActive` | `string` | 마지막 활동 시간 |
| `recentActivities` | `StudentActivity[]` | 최근 활동 내역 배열 (최대 3개 표시) |
| `aiRecommendation` | `string` | AI 추천사항 메시지 |

---

## API 응답 타입

### GetDashboardStatsResponse
**엔드포인트:** `GET /dashboard/stats`
**설명:** 대시보드 상단 통계 카드 데이터 조회

```typescript
{
  stats: DashboardStats
}
```

---

### GetLearningTrendResponse
**엔드포인트:** `GET /dashboard/learning-trend?period=week`
**설명:** 주간 학습 추이 데이터 조회
**파라미터:**
- `period`: `'week' | 'month'` (선택, 기본값: 'week')

```typescript
{
  data: LearningTrendData[]
}
```

---

### GetQuestionTypesResponse
**엔드포인트:** `GET /dashboard/question-types?period=week`
**설명:** 질문 유형 분석 데이터 조회
**파라미터:**
- `period`: `'week' | 'month'` (선택, 기본값: 'week')

```typescript
{
  data: QuestionTypeData[]
}
```

---

### GetStudentsResponse
**엔드포인트:** `GET /dashboard/students`
**설명:** 학생 목록 조회 (검색 및 페이지네이션 지원)
**파라미터:**
- `search`: `string` (선택) - 학생 이름 검색
- `page`: `number` (선택) - 페이지 번호
- `limit`: `number` (선택) - 페이지당 항목 수

```typescript
{
  students: Student[],
  total: number  // 전체 학생 수 (페이지네이션용)
}
```

---

### GetStudentDetailResponse
**엔드포인트:** `GET /dashboard/students/:studentId`
**설명:** 특정 학생의 상세 정보 조회

```typescript
{
  student: StudentDetail
}
```

---

## 사용 예시

```typescript
import { dashboardAPI } from '@/dashboard/api'

const stats = await dashboardAPI.getDashboardStats()

const weeklyTrend = await dashboardAPI.getLearningTrend('week')

const monthlyTrend = await dashboardAPI.getLearningTrend('month')

const questionTypes = await dashboardAPI.getQuestionTypes('week')

const students = await dashboardAPI.getStudents({
  search: '김',
  page: 1,
  limit: 10
})

const studentDetail = await dashboardAPI.getStudentDetail('student-id-123')
```
