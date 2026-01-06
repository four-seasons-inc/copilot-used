// Filters.tsx
import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import dayjs from "dayjs";
import useSWR from "swr";
import { appMap } from "@/utils/agg";

type FiltersProps = {
  user: string;
  setUser: (v: string) => void;
  app: string;
  setApp: (v: string) => void;
  range: string;
  setRange: (v: string) => void;
  month: string;
  setMonth: (v: string) => void;
};

const fetcher = async (url: string) => fetch(url).then((res) => res.json());

export const Filters: React.FC<FiltersProps> = ({
  user,
  setUser,
  app,
  setApp,
  range,
  setRange,
  month,
  setMonth,
}) => {
  const { data = [], isLoading } = useSWR(`/api/users`, fetcher);
  const now = dayjs();
  return (
    <div className="flex flex-wrap gap-4 items-center mb-6">
      {/* ユーザー */}
      <div>
        <label className="text-sm text-muted-foreground">ユーザー</label>
        <Select value={user} onValueChange={setUser}>
          <SelectTrigger className="w-3xs">
            <SelectValue placeholder="ユーザーを選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {!isLoading &&
              data.map((user: any) => {
                return (
                  <SelectItem value={user.userPrincipalName} key={user.id}>
                    {user.displayName}
                    <span className="text-[11px]">
                      ({user.userPrincipalName})
                    </span>
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>
      </div>

      {/* アプリ */}
      <div>
        <label className="text-sm text-muted-foreground">アプリ</label>
        <Select value={app} onValueChange={setApp}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="アプリを選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {Object.keys(appMap).map((k) => {
              return (
                <SelectItem key={k} value={k}>
                  {appMap[k]}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* 期間 */}
      <div>
        <label className="text-sm text-muted-foreground">期間</label>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="期間を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3d">直近 3 日</SelectItem>
            <SelectItem value="7d">直近 7 日</SelectItem>
            <SelectItem value="1m">直近 30 日</SelectItem>
            <SelectItem value="3m">直近 90 日</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 月別 */}
      <div>
        <label className="text-sm text-muted-foreground">月別</label>
        <Select
          value={month || `${now.format("YYYY/MM/02")}`}
          onValueChange={setMonth}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="月を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={`${now.format("YYYY/MM/02")}`}>--</SelectItem>
            {[...Array(6)].map((_, i) => {
              const d = now.subtract(i, "month");
              return (
                <SelectItem key={i} value={`${d.format("YYYY/MM/01")}`}>
                  {d.format("YYYY年MM月")}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
