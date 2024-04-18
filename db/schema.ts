import {
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const lockers = pgTable("lockers", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  seed: text("seed").notNull(),
  provider: text("provider").notNull(),
  // eventually we will support multiple lockers per EOA, but not yet
  ownerAddress: text("owner_address").notNull().unique(),
  lockerAddress: text("locker_address").notNull().unique(),
  createdAt: timestamp("created_at", {
    mode: "date",
    precision: 6,
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    precision: 6,
    withTimezone: true,
  })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  encryptedSessionKey: text("encrypted_session_key"),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  hash: text("hash").notNull(),
  chainId: numeric("chain_id").notNull(),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  timestamp: timestamp("updated_at", {
    mode: "date",
    precision: 6,
    withTimezone: true,
  }).notNull(),
  tokenAddress: text("token_address").notNull(),
  tokenName: text("token_name").notNull(),
  tokenSymbol: text("token_symbol").notNull(),

  // with decimals, eg 1 USDC = 1.000000
  amount: text("amount").notNull(),

  // without decimals, eg 1 USDC = 1000000
  amountRaw: text("amount_raw").notNull(),

  lockerId: integer("locker_id")
    .references(() => lockers.id)
    .notNull(),
});
