import { AiInteraction } from "@/types";

export function summarizeUser(interactions: AiInteraction[]) {
  const prompts = interactions.filter(
    (i) => i.interactionType === "userPrompt"
  );

  const by = (field: "appClass") => {
    const map = new Map<string, number>();
    for (const i of prompts) {
      const k = (i[field] || "").toLowerCase();
      if (!k) continue;
      map.set(k, (map.get(k) || 0) + 1);
    }
    return Object.fromEntries(map);
  };

  return {
    promptTotal: prompts.length,
    byAppClass: by("appClass"),
  };
}
