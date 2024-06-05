"use server";

import { headers } from "next/headers";

export async function POST(request: Request) {
  console.log("beam-webhook");
  const headersList = headers();
  const authorization = headersList.get("authorization") || "";
  console.log("authorization", authorization);
  const [type, encoded] = authorization.split(" ");
  const auth = Buffer.from(encoded, "base64").toString("utf8");
  console.log("auth", auth);
  const [username, password] = auth?.split(":");

  if (password !== process.env.API_KEY) {
    console.warn("Wrong api-key");
    return new Response(`Wrong api-key`, {
      status: 400,
    });
  }

  const res = await request.json();
  console.log(res);

  return Response.json({ done: true });
}
