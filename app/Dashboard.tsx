import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserLogData {
  id: string;
  userPrincipalName: string;
  displayName: string;
  promptTotal: number;
  byAppClass: Record<string, number>;
}

interface DashboardProps {
  logs: UserLogData[];
}

export default function Dashboard({ logs }: DashboardProps) {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Copilot Used Dashboard</h1>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {logs.map((user) => (
          <Card key={user.id} className="border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {user.displayName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{user.userPrincipalName}</p>
              <p className="mt-2 font-medium">
                Total Prompts: {user.promptTotal}
              </p>

              <div className="mt-4 space-y-1">
                <h3 className="text-sm font-semibold">By App Class:</h3>
                <ul className="text-sm text-gray-700">
                  {Object.entries(user.byAppClass).map(([app, count]) => (
                    <li key={app} className="flex justify-between">
                      <span>{app}</span>
                      <span>{count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
