import { useState } from "react";
import { SudokuRecord } from "@/types/record";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export function useRecords() {
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);

  const saveRecord = async (record: SudokuRecord): Promise<{ data: any; error: any }> => {
    setLoading(true);
    const { data, error } = await supabase
      .from("records")
      .upsert(record, {
        onConflict: "user_id,solved_at,board_hash"
      });

    setLoading(false);

    if (error) {
      console.error("Error saving record:", error.message);
      return { data: null, error };
    }

    return { data, error: null };
  };

  // 날짜 범위 & 단일 날짜 처리
  const fetchRecordsByDate = async (
    userId: string,
    startDate: string,
    endDate?: string
  ): Promise<{ data: SudokuRecord[] | null; error: any }> => {
    setLoading(true);
  
    let query = supabase
      .from("records")
      .select("*")
      .eq("user_id", userId);

    query = endDate
    ? query.gte("solved_at", startDate).lte("solved_at", endDate)
    : query.eq("solved_at", startDate);
  
    const { data, error } = await query.order("solved_at", { ascending: false });
  
    setLoading(false);
  
    if (error) {
      console.error("Error fetching records:", error.message);
      return { data: null, error };
    }
  
    return { data: data as SudokuRecord[], error: null };
  };

  const fetchAverageTimeByDifficulty = async (userId: string) => {
    setLoading(true);
  
    const { data, error } = await supabase
      .rpc("get_average_time_by_difficulty", { user_id: userId });
  
    setLoading(false);
  
    if (error) {
      console.error("Error fetching average times:", error.message);
      return { data: null, error };
    }
  
    return { data, error: null };
  };

  return { saveRecord, fetchRecordsByDate, fetchAverageTimeByDifficulty, loading };
};