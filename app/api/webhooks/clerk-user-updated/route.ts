"use server";

export async function POST(request: Request) {
  console.log("user-updated fool");

  const res = await request.json();
  console.log(res);
  return Response.json({ worked: true });
}
