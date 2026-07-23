import { db } from "./index";
import { sql } from "drizzle-orm";

/**
 * On Vercel there is no migration step you can run against the production
 * database at build time (the DATABASE_URL is only available at runtime).
 * This helper idempotently creates the enums + tables on the first request
 * of a cold start, then caches the result so it never runs again.
 */
let ready: Promise<void> | null = null;

async function run() {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE quote_status AS ENUM ('pending','estimated','approved','rejected');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE payment_status AS ENUM ('pending','succeeded','failed');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS quotes (
      id serial PRIMARY KEY,
      reference text NOT NULL UNIQUE,
      name text NOT NULL,
      email text NOT NULL,
      phone text,
      service_type text NOT NULL,
      project_details text NOT NULL,
      address text,
      square_footage integer,
      budget text,
      timeline text,
      estimated_amount numeric(10,2),
      status quote_status NOT NULL DEFAULT 'pending',
      created_at timestamp NOT NULL DEFAULT now()
    );
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS payments (
      id serial PRIMARY KEY,
      reference text NOT NULL UNIQUE,
      quote_id integer REFERENCES quotes(id) ON DELETE NO ACTION,
      name text NOT NULL,
      email text NOT NULL,
      amount numeric(10,2) NOT NULL,
      description text,
      method text NOT NULL DEFAULT 'card',
      status payment_status NOT NULL DEFAULT 'pending',
      transaction_id text,
      created_at timestamp NOT NULL DEFAULT now()
    );
  `);
}

export function ensureDb(): Promise<void> {
  if (!ready) {
    ready = run().catch((err) => {
      ready = null; // allow a retry on the next call if it failed
      throw err;
    });
  }
  return ready;
}
