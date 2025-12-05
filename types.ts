export type ByAppClass = Record<string, number>;

export type AiInteraction = {
  id: string;
  userId: string;
  interactionType: "userPrompt" | "aiResponse" | string;
  createdDateTime: Date;
  appClass: string;
};

export interface UserUsage {
  _id: string;
  id: string;
  displayName: string;
  promptTotal: number;
  byAppClass: ByAppClass;
}

export type RouteParams<T extends string> = {
  params: Promise<Record<T, string>>;
};

export type ChartItem = {
  date: string;
  count: number;
};

export type LogsApiResponse = {
  filterBy?: string | null;
  value?: string | null;
  range?: string | null;
  month?: string | null;
  user?: string | null;
  app?: string | null;
  total: number;
  chartData: ChartItem[];
  logs: UserUsage[];
};
