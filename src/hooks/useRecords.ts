import { useState } from "react";
import { SudokuRecord } from "@/types/record";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export function useRecords() {
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);

  // ✅ 기록 저장 (중복 시 업데이트)
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

  // ✅ 기록 조회 (user_id 기준)
  const fetchRecords = async (userId: string): Promise<{ data: SudokuRecord[] | null; error: any }> => {
    setLoading(true);
    const { data, error } = await supabase
      .from("records")
      .select("*")
      .eq("user_id", userId)
      .order("solved_at", { ascending: false });

    setLoading(false);

    if (error) {
      console.error("Error fetching records:", error.message);
      return { data: null, error };
    }

    return { data: data as SudokuRecord[], error: null };
  };

  return { saveRecord, fetchRecords, loading };
};