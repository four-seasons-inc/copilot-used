import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { AiInteraction, UserUsage } from "@/types";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { NextRequest, NextResponse } from "next/server";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

function getDateRange(range: string) {
  const map: Record<string, number> = {
    "3d": 3,
    "7d": 7,
    "1m": 30,
    "3m": 90,
  };
  const days = map[range] ?? 30;
  return {
    start: dayjs().subtract(days, "day").startOf("day").toDate(),
    end: dayjs().endOf("day").toDate(),
  };
}

function getMonthRange(monthParam: string | null) {
  const now = dayjs(monthParam || undefined);

  return {
    start: now.startOf("month").toDate(),
    end: now.endOf("month").toDate(),
  };
}
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fillMissingDates(
  start: string,
  end: string,
  data: { date: string; count: number }[]
) {
  const result: { date: string; count: number }[] = [];

  const map = new Map(data.map((i) => [i.date, i.count]));

  let current = dayjs(start);
  const last = dayjs(end);

  while (current.isBefore(last) || current.isSame(last, "day")) {
    const d = current.format("YYYY-MM-DD");
    result.push({
      date: d,
      count: map.get(d) ?? 0,
    });
    current = current.add(1, "day");
  }

  return result;
}

export async function GET(req: NextRequest) {
  const ss = await getSession();
  if (!ss) return new Response("Unauthorized", { status: 401 });
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const { searchParams } = new URL(req.url);

  const filterBy = searchParams.get("filterBy");
  const value = searchParams.get("value");
  const range = searchParams.get("range");
  const month = searchParams.get("month");
  const user = searchParams.get("user");
  const app = searchParams.get("app");

  // 1) xây điều kiện filter
  const match: any = {};

  if (value && filterBy) match[filterBy] = value;

  // 2) range theo tháng hoặc theo số ngày
  let dateRange = getMonthRange(month);
  if (range) dateRange = getDateRange(range);

  match.createdDateTime = {
    $gte: dateRange.start,
    $lte: dateRange.end,
  };

  if (user && user.trim() !== "all") match.userPrincipalName = user;
  if (app && app.trim() !== "all")
    match.appClass = new RegExp(
      escapeRegExp(`IPM.SkypeTeams.Message.Copilot.${app}`),
      "i"
    );
  const logs = await db
    .collection("logs")
    .aggregate<UserUsage>([
      { $match: match },
      {
        $group: {
          _id: "$userPrincipalName",
          id: { $first: "$userId" },
          displayName: { $first: "$displayName" },
          promptTotal: { $sum: 1 },
          byAppClass: {
            $push: "$appClass",
          },
        },
      },
      {
        $addFields: {
          byAppClass: {
            $arrayToObject: {
              $map: {
                input: { $setUnion: ["$byAppClass", []] },
                as: "ac",
                in: {
                  k: "$$ac",
                  v: {
                    $size: {
                      $filter: {
                        input: "$byAppClass",
                        cond: { $eq: ["$$this", "$$ac"] },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      { $sort: { promptTotal: -1 } },
    ])
    .toArray();
  // 3) aggregation để group theo ngày
  const raw = await db
    .collection<AiInteraction>("logs")
    .aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdDateTime" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray();

  const compact = raw.map((r) => ({
    date: r._id,
    count: r.count,
  }));
  // 4) format lại output
  let chartData: { date: string; count: number }[] = [];
  if (compact.length === 0) {
    chartData = [];
  } else {
    const minDate = compact[0].date; // Already sorted ASC
    const maxDate = compact[compact.length - 1].date;

    chartData = fillMissingDates(minDate, maxDate, compact);
  }

  const total = chartData.reduce((acc, cur) => acc + cur.count, 0);

  return NextResponse.json({
    filterBy,
    value,
    range,
    month,
    user,
    app,
    total,
    chartData,
    logs,
  });
}
