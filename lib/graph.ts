import { summarizeUser } from "./aggregate";
import { graph } from "./axiosGraph";
import dayjs from "dayjs";
import clientPromise from "@/lib/mongodb";
import { AiInteraction, UserUsage } from "@/types";

export async function getUsers(): Promise<
  {
    id: string;
    userPrincipalName: string;
    displayName: string;
  }[]
> {
  const { data } = await graph(
    `/v1.0/users?$select=id,userPrincipalName,displayName&$count=true&$filter=endswith(userPrincipalName,%27@0004s.com%27)and surname ne null`
  );

  return data.value;
}
async function getLogsForUser(userId: string) {
  const logs: AiInteraction[] = [];
  const startDate = dayjs().add(-3, "day").toISOString();
  const endDate = dayjs().toISOString();
  let nextUrl = `/beta/copilot/users/${userId}/interactionHistory/getAllEnterpriseInteractions?$filter=createdDateTime gt ${startDate} and createdDateTime lt ${endDate}&$top=100`;
  while (nextUrl) {
    try {
      const { data } = await graph(nextUrl);
      if (data.value && data.value.length > 0) {
        logs.push(
          ...data.value.map((v: AiInteraction) => ({
            id: v.id,
            appClass: v.appClass,
            interactionType: v.interactionType,
            createdDateTime: dayjs(v.createdDateTime).toDate(),
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
export async function asyncDb() {
  const users = await getUsers();
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const newUserUpsert = users.map((user) => ({
    updateOne: {
      filter: {
        id: user.id,
      },
      update: {
        $setOnInsert: {
          ...user,
        },
      },
      upsert: true,
    },
  }));
  console.log(newUserUpsert);
  await db.collection("users").bulkWrite(newUserUpsert, {
    ordered: false,
  });
  for (const user of users) {
    try {
      const logs = await getLogsForUser(user.id);
      if (logs.length === 0) continue;

      const operations = logs.map((log) => ({
        updateOne: {
          filter: { id: log.id }, // tìm theo id
          update: {
            $setOnInsert: {
              ...log,
              userId: user.id,
              userPrincipalName: user.userPrincipalName,
              displayName: user.displayName,
              insertedAt: new Date(),
            },
          },
          upsert: true,
        },
      }));
      await db.collection("logs").bulkWrite(operations, {
        ordered: false,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
export async function getLogsForUsers(range = 30) {
  const users = await getUsers();
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const customAgo = dayjs().subtract(range, "day").toDate();
  const arr: UserUsage[] = [];
  for (const user of users) {
    try {
      const logs = await db
        .collection<AiInteraction>("logs")
        .find({ userId: user.id, createdDateTime: { $gte: customAgo } })
        .toArray();
      if (logs.length === 0) continue;
      arr.push({
        ...user,
        ...summarizeUser(logs),
      });
    } catch (error) {
      console.log(error);
    }
  }
  return arr.sort((a, b) => b.promptTotal - a.promptTotal);
}
export async function getUsersFromDB() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  try {
    const users = await db
      .collection<AiInteraction>("users")
      .find({})
      .toArray();
    return users;
  } catch (error) {
    return [];
  }
}
