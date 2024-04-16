"use server";

export async function POST(request: Request) {
  console.log("moralis-tx-stream");

  const res = await request.json();
  console.log(res);
  return Response.json({ done: true });
}
