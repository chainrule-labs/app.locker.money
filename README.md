# Locker Dashboard

Save every time you interact or get paid on-chain.

- Web: [app.locker.money](https://app.lockher.money)

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

TODO:

- Architecture diagram
- Deployment addresses
- Usage instructions
