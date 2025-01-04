import { AppType } from "@/server";
import { hc } from "hono/client";
import { HTTPException } from "hono/http-exception";
import { ContentfulStatusCode } from "hono/utils/http-status";

const getBaseUrl = () => {
  // browser should use relative path
  if (typeof window !== "undefined") {
    return "";
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000/";
  }

  // if deployed to vercel, use vercel url
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // assume deployment to cloudflare workers otherwise, you'll get this URL after running
  // `npm run deploy`, which deploys your server to cloudflare
  return "https://<YOUR_DEPLOYED_WORKER_URL>/";
};

export const client = hc<AppType>(getBaseUrl(), {
  fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await fetch(input, { ...init, cache: "no-store" });

    if (!response.ok) {
      throw new HTTPException(response.status as ContentfulStatusCode, {
        message: response.statusText,
        res: response,
      });
    }

    const contentType = response.headers.get("Content-Type");

    response.json = async () => {
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (error) {
        console.error("Failed to parse response as JSON:", error);
        throw new Error("Invalid JSON response");
      }
    };

    return response;
  },
});
