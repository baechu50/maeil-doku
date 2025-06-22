import { useState } from "react";
import { SudokuRecord } from "@/types/record";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { PostgrestError } from "@supabase/supabase-js";

export function useRecords() {
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);

  const saveRecord = async (
    record: SudokuRecord
  ): Promise<{ data: SudokuRecord | null; error: PostgrestError | null }> => {
    setLoading(true);
    const { data, error } = await supabase.from("records").upsert(record, {
      onConflict: "user_id,solved_at,board_hash",
    });

    setLoading(false);

    if (error) {
      throw new Error(`기록 저장 중 오류가 발생했습니다: ${error.message}`);
    }

    return { data, error: null };
  };

  // 날짜 범위 & 단일 날짜 처리
  const fetchRecordsByDate = async (
    userId: string,
    startDate: string,
    endDate?: string
  ): Promise<{ data: SudokuRecord[] | null; error: PostgrestError | null }> => {
    setLoading(true);

    let query = supabase.from("records").select("*").eq("user_id", userId);

    query = endDate
      ? query.gte("solved_at", startDate).lte("solved_at", endDate)
      : query.eq("solved_at", startDate);

    const { data, error } = await query.order("solved_at", {
      ascending: false,
    });

    setLoading(false);

    if (error) {
      throw new Error(`기록을 불러오는 중 오류가 발생했습니다: ${error.message}`);
    }

    return { data: data as SudokuRecord[], error: null };
  };

  const fetchAverageTimeByDifficulty = async (userId: string) => {
    setLoading(true);

    const { data, error } = await supabase.rpc("get_average_time_by_difficulty", {
      user_id: userId,
    });

    setLoading(false);

    if (error) {
      throw new Error(`평균 시간을 불러오는 중 오류가 발생했습니다: ${error.message}`);
    }

    return { data, error: null };
  };

  const fetchPercentileByTime = async (
    difficulty: "easy" | "medium" | "hard",
    timeSeconds: number
  ): Promise<{ data: number | null; error: PostgrestError | null }> => {
    setLoading(true);

    const { data, error } = await supabase.rpc("get_percentile_by_time", {
      difficulty_input: difficulty,
      time_input: timeSeconds,
    });

    setLoading(false);

    if (error) {
      throw new Error(`백분위를 계산하는 중 오류가 발생했습니다: ${error.message}`);
    }

    return { data, error: null };
  };

  return {
    saveRecord,
    fetchRecordsByDate,
    fetchAverageTimeByDifficulty,
    fetchPercentileByTime,
    loading,
  };
}
