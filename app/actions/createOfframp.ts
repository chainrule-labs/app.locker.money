"use server";

// https://docs.stripe.com/testing
export default async function createOfframp() {
  console.log("Creating offramp...");
  const emailAddress = "marvin+beam10@chainrule.io";
  try {
    const url = "https://api.sandbox.ansiblelabs.xyz/accounts/individuals";
    const apiKey = process.env.BEAM_API_KEY;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kyc: {
          emailAddress,
        },
        walletAddress: "0xAF115955b028c145cE3A7367B25A274723C5104B",
        walletAddressChain: "Ethereum",
      }),
    });

    if (!response.ok) {
      // If the API responded with an error status, handle it here
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
    return data;
  } catch (error: any) {
    throw new Error(error.message || "An unexpected error occurred");
  }
}
