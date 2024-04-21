import {
  SUPPORTED_CHAIN_EXPLORERS,
  SUPPORTED_CHAIN_NAMES,
} from "@/lib/constants";
import { clerkClient } from "@clerk/nextjs";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendDepositReceivedEmail = async ({
  locker,
  tx,
}: {
  locker: any;
  tx: any;
}) => {
  const { userId } = locker;

  const chainName = SUPPORTED_CHAIN_NAMES[tx.chainId];
  const chainExplorer = SUPPORTED_CHAIN_EXPLORERS[tx.chainId];

  // Send email
  const user = await clerkClient.users.getUser(userId);
  console.log("User", user);

  const amountStr = `${tx.amount} ${tx.tokenSymbol}`;
  const link = `${process.env.API_HOST}/tx/${tx.hash}`;
  const to = user.emailAddresses[0].emailAddress;
  const emailHTML = `<div style="font-family: Arial, sans-serif; color: #333; text-align: start; background-color: #F7F7F7; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <img src="${process.env.API_HOST}/iconLockerTransOvals.png" alt="Locker Logo" style="width: 100px; height: auto; margin-bottom: 20px;">
      <h2 style="color: #3040EE;">Payment received</h2>
      <p>Your locker with address <a href="${chainExplorer}/address/${tx.toAddress}" style="color: #3040EE;">${tx.toAddress}</a> just received ${amountStr} on the ${chainName} network.</p>
      <a href="${link}" style="color: #ffffff; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 20px; padding: 10px 15px; background-color: #3040EE; border-radius: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">Go to your Locker dashboard</a>
      <hr style="border-color: #E5E5E5; border-style: solid; border-width: 1px 0 0;">
      <p style="font-size: small; color: #666;">You received this email because you are registered with Locker. If you believe this was an error, please <a href="mailto:support@chainrule.io" style="color: #3040EE;">contact us</a>.</p>
    </div>
  </div>`;
  await resend.emails.send({
    from: "Locker <contact@noreply.locker.money>",
    to,
    subject: `Received ${amountStr} in Locker`,
    html: emailHTML,
  });

  console.log("Email sent to " + to);
};
