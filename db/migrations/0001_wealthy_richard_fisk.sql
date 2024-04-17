DROP TABLE "accounts";--> statement-breakpoint
DROP TABLE "accounts_to_chains";--> statement-breakpoint
DROP TABLE "chains";--> statement-breakpoint
DROP TABLE "ecosystems";--> statement-breakpoint
DROP TABLE "explorers";--> statement-breakpoint
DROP TABLE "tokens";--> statement-breakpoint
ALTER TABLE "lockers" RENAME COLUMN "ownerAddress" TO "owner_address";--> statement-breakpoint
ALTER TABLE "lockers" RENAME COLUMN "lockerAddress" TO "locker_address";--> statement-breakpoint
ALTER TABLE "transactions" RENAME COLUMN "chainId" TO "chain_id";--> statement-breakpoint
ALTER TABLE "transactions" RENAME COLUMN "fromAddress" TO "from_address";--> statement-breakpoint
ALTER TABLE "transactions" RENAME COLUMN "toAddress" TO "to_address";--> statement-breakpoint
ALTER TABLE "transactions" RENAME COLUMN "tokenName" TO "token_name";--> statement-breakpoint
ALTER TABLE "transactions" RENAME COLUMN "tokenSymbol" TO "token_symbol";--> statement-breakpoint
ALTER TABLE "lockers" DROP CONSTRAINT "lockers_ownerAddress_unique";--> statement-breakpoint
ALTER TABLE "lockers" DROP CONSTRAINT "lockers_lockerAddress_unique";--> statement-breakpoint
ALTER TABLE "lockers" ADD COLUMN "created_at" timestamp (6) with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "lockers" ADD COLUMN "updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "locker_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_locker_id_lockers_id_fk" FOREIGN KEY ("locker_id") REFERENCES "lockers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "lockers" ADD CONSTRAINT "lockers_owner_address_unique" UNIQUE("owner_address");--> statement-breakpoint
ALTER TABLE "lockers" ADD CONSTRAINT "lockers_locker_address_unique" UNIQUE("locker_address");