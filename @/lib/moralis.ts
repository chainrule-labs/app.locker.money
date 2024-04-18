import Moralis from "moralis";

export const getPortfolio = async (walletAddress: string) => {
  try {
    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY!,
    });
  } catch (e) {
    // Moraolis probably already started
    console.warn(e);
  }

  try {
    const response = await Moralis.EvmApi.wallets.getWalletNetWorth({
      excludeSpam: true,
      excludeUnverifiedContracts: true,
      address: walletAddress,
    });

    console.log(response.result);
    // return response.
    return response.result;
  } catch (e) {
    console.error(e);
  }

  throw new Error("Could not get portfolio");
};
