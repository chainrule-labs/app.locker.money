# Locker Dashboard

Save every time you interact or get paid on-chain.

- Web: [app.locker.money](https://app.lockher.money)

## Why Locker

# TODO

## Getting started

Prerequisites:

- NeonDB
- WalletConnect
- Clerk
- ZeroDev
- Moralis

```sh
# setup environment
cp .env.example .env.development.local

# install dependencies
yarn install

# Generate stream ID
yarn stream:gen

# Run migrations on DB
yarn drizzle:push

# run
yarn dev
```

## Details

### Moralis Stream ID

[Moralis Streams](https://docs.moralis.io/streams-api/evm) are used for getting realtime updates about deposits into Lockers. A single stream is used for processing updates across all chains and addresses. That stream must be created manually and added to your `.env` as `MORALIS_STREAM_ID`. To generate the stream id, `yarn stream:gen`.

### Drizzle Studio

Use `yarn drizzle:studio` then visit [local.drizzle.studio](https://local.drizzle.studio) for

---

### How it's made

- NextJS
- ZeroDev kernels for Lockers
- Moralis for on-chain tx webhooks
- Basic authentication with [﻿Clerk](https://clerk.com/docs) .
- [﻿Tailwind CSS](https://tailwindcss.com/) for utility class styling.
- [﻿Shadcn UI](https://ui.shadcn.com/) for UI components.
- Postgres database on [﻿Neon](https://neon.tech/) .
- [﻿Drizzle ORM](https://orm.drizzle.team/) for managing and interacting with data.
- [Zephyr template](https://github.com/zenzen-sol/zephyr)

Here's a diagram detailing how all these pieces come together. ![Locker Overview](./docs/flow.png)

### Deployment addresses

Locker uses the ZeroDev SDK to spin up bespoke smart accounts (Lockers) with scoped permissions. As such, we do not have any on-chain factory contracts. Here are contract addresses of some of the Lockers we created while testing. Every time a user creates a Locker, they will generate a similar on-chain contract.

# TODO

| Chain            | Address |
| ---------------- | ------- |
| Gnosis Mainnet   | -       |
| Ethereum Sepolia | -       |
| Arbitrum Sepolia | -       |
| Base Sepolia     | -       |
| Linea Sepolia    | -       |

### Usage

# TODO

### Next steps

- Add state to Lockers
- Non-4337, token allowance based flow
- Dynamically allow-list Lockers for paymaster.
