"use client";

import DashboardChart from "@/components/DashboardChart";
import { Filters } from "@/components/Filters";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState<string>("all");
  const [app, setApp] = useState<string>("");
  const [range, setRange] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  useEffect(() => {
    if (month) {
      setRange("");
    }
  }, [month]);
  useEffect(() => {
    if (range) {
      setMonth("");
    }
  }, [range]);

  return (
    <div className="min-h-screen bg-gray-50 relative p-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <header>
          <h1 className="text-2xl font-bold">Copilot 利用状況ダッシュボード</h1>
        </header>
        <Filters
          user={user}
          setUser={setUser}
          app={app}
          setApp={setApp}
          range={range}
          setRange={setRange}
          month={month}
          setMonth={setMonth}
        />

        <DashboardChart user={user} app={app} range={range} month={month} />
      </div>
      <footer className="text-center p-4">
        Copyright ©{dayjs().year()}.Four Seasons inc. All Rights Reserved.
      </footer>
    </div>
  );
}
