import {
  ConfidentialClientApplication,
  ClientCredentialRequest,
} from "@azure/msal-node";

const msalClient = new ConfidentialClientApplication({
  auth: {
    clientId: process.env.CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.CLIENT_SECRET!,
  },
});

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

export async function getAppToken() {
  const now = Date.now();
  if (cachedToken && now < cachedToken.expiresAt - 60_000) {
    return cachedToken.accessToken;
  }
  const req: ClientCredentialRequest = { scopes: [process.env.GRAPH_SCOPE!] };
  const res = await msalClient.acquireTokenByClientCredential(req);
  if (!res?.accessToken) throw new Error("Failed to acquire Graph token");
  cachedToken = {
    accessToken: res.accessToken,
    expiresAt: res.expiresOn ? res.expiresOn.getTime() : now + 55 * 60_000,
  };
  return res.accessToken;
}
