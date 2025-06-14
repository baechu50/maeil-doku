import { useUser } from "@supabase/auth-helpers-react";

export default function MyPage() {
  const user = useUser();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">마이페이지</h1>
      {user ? (
        <div className="space-y-2">
          <p><strong>이메일:</strong> {user.email}</p>
          <p><strong>UID:</strong> {user.id}</p>
          <p>여기에서 기록 달력, 주간 리포트 등을 확인할 수 있게 확장 예정입니다.</p>
        </div>
      ) : (
        <p>로그인이 필요합니다.</p>
      )}
    </div>
  );
}