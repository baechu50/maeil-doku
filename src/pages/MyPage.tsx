import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import { useRecords } from "@/hooks/useRecords";
import { SudokuRecord, CalendarMap } from "@/types/record";
import { getStreakCount, getFastestRecord, formatTime, getMonthlyCalendarMap } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Brain,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DifficultyBadge = ({ difficulty, completed }: { difficulty: string; completed: boolean }) => {
  const colors = {
    easy: completed ? "bg-green-500" : "bg-gray-300",
    medium: completed ? "bg-yellow-500" : "bg-gray-300",
    hard: completed ? "bg-red-500" : "bg-gray-300",
  };

  return <div className={`w-2 h-2 rounded-full ${colors[difficulty as keyof typeof colors]}`} />;
};

export default function MyPage() {
  const user = useUser();
  const navigate = useNavigate();
  const { fetchRecordsByDate, fetchAverageTimeByDifficulty } = useRecords();

  const [yearandMonth, setYearandMonth] = useState<number[]>([
    new Date().getFullYear(),
    new Date().getMonth(),
  ]);
  const [todayRecords, setTodayRecords] = useState<SudokuRecord[]>([]);
  const [monthlyRecords, setMonthlyRecords] = useState<CalendarMap>({});
  const [averageStats, setAverageStats] = useState<
    {
      difficulty: string;
      avg_time: number;
      avg_hints: number;
    }[]
  >([]);
  const [streak, setStreak] = useState<number>(0);
  const [hoveredDate, setHoveredDate] = useState<{ day: number; x: number; y: number } | null>(
    null
  );

  const today = new Date().toLocaleDateString("sv-SE");
  const currentDate = new Date(yearandMonth[0], yearandMonth[1]);

  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
      return;
    }

    const firstDayofMonth = new Date(yearandMonth[0], yearandMonth[1], 1).toLocaleDateString(
      "sv-SE"
    );
    const lastDayofMonth = new Date(yearandMonth[0], yearandMonth[1] + 1, 0).toLocaleDateString(
      "sv-SE"
    );

    const fetchData = async () => {
      const todayResult = await fetchRecordsByDate(user.id, today);
      if (todayResult.data) setTodayRecords(todayResult.data);

      const monthResult = await fetchRecordsByDate(user.id, firstDayofMonth, lastDayofMonth);
      if (monthResult.data) {
        setMonthlyRecords(
          getMonthlyCalendarMap(monthResult.data, yearandMonth[0], yearandMonth[1])
        );
        setStreak(getStreakCount(monthResult.data));
      }

      const avgResult = await fetchAverageTimeByDifficulty(user.id);
      if (avgResult.data) setAverageStats(avgResult.data);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, yearandMonth]);

  const todayByDifficulty = {
    easy: getFastestRecord(todayRecords.filter((r) => r.difficulty === "easy")),
    medium: getFastestRecord(todayRecords.filter((r) => r.difficulty === "medium")),
    hard: getFastestRecord(todayRecords.filter((r) => r.difficulty === "hard")),
  };

  const avgByDifficulty = {
    easy: averageStats.find((s) => s.difficulty === "easy"),
    medium: averageStats.find((s) => s.difficulty === "medium"),
    hard: averageStats.find((s) => s.difficulty === "hard"),
  };

  const goToPreviousMonth = () => {
    setYearandMonth(([y, m]) => (m === 0 ? [y - 1, 11] : [y, m - 1]));
  };

  const goToNextMonth = () => {
    setYearandMonth(([y, m]) => (m === 11 ? [y + 1, 0] : [y, m + 1]));
  };

  return (
    <div className="min-h-screen p-4 pt-36">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">수도쿠 대시보드</h1>
          <p className="text-gray-600">
            반갑습니다 {user?.user_metadata.name || "사용자"}님, 오늘의 기록을 확인해보세요!
          </p>
        </div>

        {/* 연속 플레이 & 동기부여 메시지 */}
        <Card className="bg-[#7E24FD] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div>
                  <h3 className="text-xl font-bold">🔥 {streak}일 연속 플레이중 🔥</h3>
                </div>
              </div>
            </div>
            <p className="text-sm text-orange-100 mt-2">
              &ldquo;계속해서 매일 플레이하며 실력을 쌓아보세요!&rdquo;
            </p>
          </CardContent>
        </Card>

        {/* 오늘의 기록 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>오늘의 기록</span>
            </CardTitle>
            <CardDescription>오늘 플레이한 퍼즐들의 결과를 확인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(["easy", "medium", "hard"] as const).map((level) => {
                const record = todayByDifficulty[level];
                return (
                  <div key={level} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold capitalize">
                        {level === "easy" ? "초급" : level === "medium" ? "중급" : "고급"}
                      </h4>
                      {record ? (
                        <Badge variant="default" className="bg-green-300">
                          완료
                        </Badge>
                      ) : (
                        <Badge variant="secondary">미완료</Badge>
                      )}
                    </div>
                    {record && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-[#7E24FD]" />
                          <span className="text-2xl font-bold text-[#7E24FD]">
                            {formatTime(record.time_seconds)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Brain className="h-3 w-3" />
                            <span>힌트 {record.hints_used}개</span>
                          </div>
                          {/* 랭킹은 추후 추가 가능 */}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 전체 통계 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>전체 통계</span>
            </CardTitle>
            <CardDescription>난이도별 평균 성과를 확인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">난이도</th>
                    <th className="text-left py-2 px-4">평균 시간</th>
                    <th className="text-left py-2 px-4">평균 힌트</th>
                  </tr>
                </thead>
                <tbody>
                  {(["easy", "medium", "hard"] as const).map((level) => {
                    const stats = avgByDifficulty[level];
                    return (
                      <tr key={level} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold">
                          {level === "easy" ? "초급" : level === "medium" ? "중급" : "고급"}
                        </td>
                        <td className="py-3 px-4">
                          {stats?.avg_time ? formatTime(Math.floor(stats.avg_time)) : "-"}
                        </td>
                        <td className="py-3 px-4">
                          {stats?.avg_hints ? Number(stats.avg_hints).toFixed(1) : "-"}개
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 달력 */}
        <Card className="relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>이번 달 기록</span>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={goToPreviousMonth} className="p-1 hover:bg-gray-100 rounded">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-semibold text-lg min-w-[80px] text-center">
                  {`${String(currentDate.getFullYear()).slice(2)}년 ${currentDate.getMonth() + 1}월`}
                </span>
                <button onClick={goToNextMonth} className="p-1 hover:bg-gray-100 rounded">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <CardDescription>날짜별 퍼즐 완료 현황을 확인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 범례 */}
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>초급</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>중급</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>고급</span>
                </div>
              </div>

              {/* 달력 헤더 */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-600">
                {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                  <div key={day} className="p-2">
                    {day}
                  </div>
                ))}
              </div>
              {/* 달력 본체 */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 42 }).map((_, i) => {
                  const firstDay = new Date(yearandMonth[0], yearandMonth[1], 1);
                  const startDayOfWeek = firstDay.getDay();
                  const calendarStartDate = new Date(firstDay);
                  calendarStartDate.setDate(firstDay.getDate() - startDayOfWeek + i);

                  const dateStr = calendarStartDate.toLocaleDateString("sv-SE");
                  const records = monthlyRecords[dateStr];
                  const isToday = dateStr === today;
                  const isCurrentMonth = calendarStartDate.getMonth() === yearandMonth[1];
                  const day = calendarStartDate.getDate();

                  return (
                    <div
                      key={dateStr}
                      role="button"
                      tabIndex={0}
                      className={`aspect-square p-1 text-xs cursor-pointer rounded transition-colors relative
          ${isToday ? "bg-blue-100 border-2 border-blue-500" : ""}
          ${isCurrentMonth ? "hover:bg-gray-100" : "text-gray-400 hover:bg-gray-50"}
          ${!isCurrentMonth ? "opacity-50" : ""}
        `}
                      onMouseEnter={(e) => {
                        if (records && isCurrentMonth) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredDate({
                            day,
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                          });
                        }
                      }}
                      onMouseLeave={() => setHoveredDate(null)}
                    >
                      <div className="h-full flex flex-col items-center justify-between">
                        <span className="font-semibold">{day}</span>
                        {records && (
                          <div className="flex space-x-0.5">
                            <DifficultyBadge
                              difficulty="easy"
                              completed={records.easy.length > 0}
                            />
                            <DifficultyBadge
                              difficulty="medium"
                              completed={records.medium.length > 0}
                            />
                            <DifficultyBadge
                              difficulty="hard"
                              completed={records.hard.length > 0}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 호버 팝업 */}
              {hoveredDate && (
                <div
                  className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm min-w-[200px] max-w-xs pointer-events-none"
                  style={{
                    left: `${Math.min(hoveredDate.x, window.innerWidth - 160)}px`, // 오른쪽 잘림 방지
                    top: `${hoveredDate.y - 140}px`,
                    transform: "translateX(-30%)", // 가운데 정렬 유지
                  }}
                >
                  <div className="font-semibold mb-2 text-center">{hoveredDate.day}일 기록</div>
                  {(() => {
                    const targetDate = new Date(yearandMonth[0], yearandMonth[1], hoveredDate.day);
                    const dateStr = targetDate.toLocaleDateString("sv-SE");
                    const dateRecord = monthlyRecords[dateStr];
                    if (!dateRecord) return <p className="text-gray-500 text-center">기록 없음</p>;

                    return (
                      <div className="space-y-2">
                        {(["easy", "medium", "hard"] as const).map((level) => {
                          const rec = dateRecord[level]?.[0];
                          if (!rec) return null;
                          return (
                            <div
                              key={level}
                              className={`border-l-4 pl-2 ${
                                level === "easy"
                                  ? "border-green-500 text-green-600"
                                  : level === "medium"
                                    ? "border-yellow-500 text-yellow-600"
                                    : "border-red-500 text-red-600"
                              }`}
                            >
                              <div className="font-medium">
                                {level === "easy" ? "초급" : level === "medium" ? "중급" : "고급"}
                              </div>
                              <div className="text-xs text-gray-600">
                                시간: {formatTime(Math.floor(rec.time_seconds))} | 힌트:{" "}
                                {rec.hints_used}개
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
