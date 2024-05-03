import dotenv from "dotenv";
import path from "path";

// {
//     "id": "f5d59089-5309-479b-abd7-b746bfa7eeed",
//     "partnerId": "df803fcb-34f0-413d-99ef-dc777e88e6a4",
//     "callbackUrl": "https://9358-2607-fb90-d51c-c8a1-d83d-9b1b-ca73-5552.ngrok-free.app/api/beam-webhook",
//     "authUsername": "user",
//     "status": "ACTIVE"
//   }

dotenv.config({ path: path.resolve(__dirname, "../.env.development.local") });
async function createBeamWebhook() {
  console.log("Creating webhook...");
  try {
    //     curl --request POST \
    //  --url https://api.sandbox.ansiblelabs.xyz/webhooks \
    //  --header 'Authorization: Bearer {key}' \
    //  --header 'accept: application/json' \
    //  --header 'content-type: application/json'
    const url = "https://api.sandbox.ansiblelabs.xyz/webhooks";
    const apiKey = process.env.BEAM_API_KEY;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authUsername: "user",
        authPassword: "AAA",
        callbackUrl:
          "https://9358-2607-fb90-d51c-c8a1-d83d-9b1b-ca73-5552.ngrok-free.app/api/webhooks/beam",
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

async function doIt() {
  await createBeamWebhook();
}

doIt();
