test("decoding", async () => {
  const msgEncoded = "dXNlcjpBQUE=";
  const msgDecoded = Buffer.from(msgEncoded, "base64").toString("utf8");
  expect(msgDecoded).toBe("user:AAA");
});

test("header decoding", () => {
  const header = "Basic dXNlcjpBQUE=";
  const [type, encoded] = header.split(" ");
});
