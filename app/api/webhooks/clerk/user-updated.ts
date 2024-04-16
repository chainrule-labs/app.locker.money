import type { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const res = (await request.json()) as WebhookEvent;
  console.log("user-updated");
  console.log(res);
  return Response.json({ res });
}
