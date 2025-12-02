"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const ranges = [
  { key: 3, label: "3日" },
  { key: 7, label: "7日" },
  { key: 30, label: "1ヶ月" },
  { key: 90, label: "3ヶ月" },
  { key: 180, label: "6ヶ月" },
  { key: 365, label: "1年" },
];

interface Props {
  value: number;
}

export default function TimeRangeSelector({ value }: Props) {
  const route = useRouter();
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {ranges.map((r) => (
        <Button
          key={r.key}
          size={"sm"}
          variant={value === r.key ? "default" : "outline"}
          className={cn(
            "w-16 cursor-pointer text-xs",
            value === r.key && "pointer-events-none"
          )}
          onClick={() => {
            route.push(`/?range=${r.key}`);
          }}
        >
          {r.label}
        </Button>
      ))}
    </div>
  );
}
