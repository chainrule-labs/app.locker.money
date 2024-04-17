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
  tokenName: text("token_name").notNull(),
  tokenSymbol: text("token_symbol").notNull(),
  amount: text("amount").notNull(),
  lockerId: integer("locker_id")
    .references(() => lockers.id)
    .notNull(),
});
