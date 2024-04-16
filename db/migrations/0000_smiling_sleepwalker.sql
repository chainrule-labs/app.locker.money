DO $$ BEGIN
 CREATE TYPE "logo_image_format" AS ENUM('png', 'svg');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"name" text NOT NULL,
	"user_id" text NOT NULL,
	"hint" text,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "accounts_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts_to_chains" (
	"account_id" integer NOT NULL,
	"chain_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chains" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"short_name" text,
	"info_url" text,
	"interface" text NOT NULL,
	"chain_spec" integer NOT NULL,
	"network_spec" integer NOT NULL,
	"parent_chain_spec" integer,
	"slip_spec" integer,
	"ens_registry" text,
	"layer" text,
	"ecosystem_id" integer,
	"native_coin_id" integer,
	CONSTRAINT "chains_name_unique" UNIQUE("name"),
	CONSTRAINT "chains_short_name_unique" UNIQUE("short_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ecosystems" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"ticker" text,
	CONSTRAINT "ecosystems_ticker_unique" UNIQUE("ticker")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "explorers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"spec" text,
	"chain_id" integer,
	CONSTRAINT "explorers_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lockers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"seed" text NOT NULL,
	"provider" text NOT NULL,
	"ownerAddress" text NOT NULL,
	"lockerAddress" text NOT NULL,
	CONSTRAINT "lockers_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "lockers_ownerAddress_unique" UNIQUE("ownerAddress"),
	CONSTRAINT "lockers_lockerAddress_unique" UNIQUE("lockerAddress")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"symbol" text NOT NULL,
	"decimals" numeric,
	CONSTRAINT "tokens_symbol_unique" UNIQUE("symbol")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"hash" text NOT NULL,
	"chainId" numeric NOT NULL,
	"fromAddress" text NOT NULL,
	"toAddress" text NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL,
	"tokenName" text NOT NULL,
	"tokenSymbol" text NOT NULL,
	"amount" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts_to_chains" ADD CONSTRAINT "accounts_to_chains_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts_to_chains" ADD CONSTRAINT "accounts_to_chains_chain_id_chains_id_fk" FOREIGN KEY ("chain_id") REFERENCES "chains"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chains" ADD CONSTRAINT "chains_ecosystem_id_ecosystems_id_fk" FOREIGN KEY ("ecosystem_id") REFERENCES "ecosystems"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chains" ADD CONSTRAINT "chains_native_coin_id_tokens_id_fk" FOREIGN KEY ("native_coin_id") REFERENCES "tokens"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "explorers" ADD CONSTRAINT "explorers_chain_id_chains_id_fk" FOREIGN KEY ("chain_id") REFERENCES "chains"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
