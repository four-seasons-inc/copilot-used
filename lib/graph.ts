import { summarizeUser } from "./aggregate";
import { graph } from "./axiosGraph";
import dayjs from "dayjs";

export type AiInteraction = {
  interactionType: "userPrompt" | "aiResponse" | string;
  createdDateTime: string;
  appClass: string;
};

export async function getUsers() {
  const { data } = await graph(
    `/v1.0/users?$select=id,userPrincipalName,displayName&$count=true&$filter=endswith(userPrincipalName,%27@0004s.com%27)and surname ne null`
  );

  return data.value;
}
async function getLogsForUser(userId: string) {
  const logs: AiInteraction[] = [];
  const startDate = dayjs().add(-1, "month").toISOString();
  const endDate = dayjs().toISOString();
  let nextUrl = `/beta/copilot/users/${userId}/interactionHistory/getAllEnterpriseInteractions?$filter=createdDateTime gt ${startDate} and createdDateTime lt ${endDate}&$top=100`;
  console.log(nextUrl);
  while (nextUrl) {
    try {
      const { data } = await graph(nextUrl);
      if (data.value && data.value.length > 0) {
        logs.push(
          ...data.value.map((v: AiInteraction) => ({
            appClass: v.appClass,
            interactionType: v.interactionType,
            createdDateTime: v.createdDateTime,
          }))
        );
        if (data["@odata.nextLink"]) nextUrl = data["@odata.nextLink"];
        else nextUrl = "";
      } else {
        nextUrl = "";
      }
    } catch (error) {
      console.log(error);
      nextUrl = "";
    }
  }
  return logs;
}
export async function getLogsForUsers() {
  const users = await getUsers();
  const arr: {
    id: string;
    userPrincipalName: string;
    displayName: string;
    promptTotal: number;
    byAppClass: {
      [k: string]: number;
    };
  }[] = [];
  for (const user of users) {
    try {
      const logs = await getLogsForUser(user.id);
      if (logs.length === 0) continue;
      arr.push({
        ...user,
        ...summarizeUser(logs),
      });
    } catch (error) {
      console.log(error);
    }
  }
  return arr;
}

export async function fetchInteractionsForUser(
  userId: string,
  fromIso: string,
  toIso: string,
  opts?: { appClassFilter?: string[] }
): Promise<AiInteraction[]> {
  const filterParts = [
    `createdDateTime ge ${fromIso}`,
    `createdDateTime lt ${toIso}`,
  ];
  if (opts?.appClassFilter?.length) {
    const orClause = opts.appClassFilter
      .map((v) => `appClass eq '${v}'`)
      .join(" or ");
    filterParts.push(`(${orClause})`);
  }

  let nextUrl =
    `/beta/copilot/users/${userId}/interactionHistory/getAllEnterpriseInteractions` +
    `?$top=100&$filter=${encodeURIComponent(filterParts.join(" and "))}`;

  const all: AiInteraction[] = [];

  while (nextUrl) {
    const { data } = await graph.get(nextUrl);
    if (Array.isArray(data.value)) all.push(...data.value);
    nextUrl = data["@odata.nextLink"] ?? "";
  }

  return all;
}
