export type ByAppClass = Record<string, number>;

export type AiInteraction = {
  id: string;
  userId: string;
  interactionType: "userPrompt" | "aiResponse" | string;
  createdDateTime: Date;
  appClass: string;
};

export interface UserUsage {
  id: string;
  userPrincipalName: string;
  displayName: string;
  promptTotal: number;
  byAppClass: ByAppClass;
}

export type RouteParams<T extends string> = {
  params: Promise<Record<T, string>>;
};
