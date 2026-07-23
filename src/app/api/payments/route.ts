import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { ensureDb } from "@/db/init";
import { payments, quotes } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { generateReference } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  await ensureDb();
  const ref = req.nextUrl.searchParams.get("reference");
  if (ref) {
    const [payment] = await db.select().from(payments).where(eq(payments.reference, ref));
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }
    return NextResponse.json({ payment });
  }
  const all = await db.select().from(payments).orderBy(desc(payments.createdAt)).limit(100);
  return NextResponse.json({ payments: all });
}

/**
 * Simulated payment gateway. In production this route would create a Stripe
 * PaymentIntent and confirm it server-side. Here we validate the inputs,
 * "process" the charge with a short delay, and persist a succeeded record so
 * the fullstack flow (quote -> pay -> confirmation) is fully functional.
 */
export async function POST(req: NextRequest) {
  try {
    await ensureDb();
    const body = await req.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const amountRaw = Number(body.amount);
    const cardNumber = String(body.cardNumber ?? "").replace(/\s+/g, "");
    const expiry = String(body.expiry ?? "").trim();
    const cvc = String(body.cvc ?? "").trim();
    const quoteIdRaw = body.quoteId ? Number(body.quoteId) : null;
    const description = body.description ? String(body.description).trim() : null;
    const method = body.method ? String(body.method).trim() : "card";

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }
    if (!Number.isFinite(amountRaw) || amountRaw <= 0) {
      return NextResponse.json({ error: "A valid amount is required." }, { status: 400 });
    }
    if (!/^\d{13,19}$/.test(cardNumber)) {
      return NextResponse.json({ error: "Enter a valid card number." }, { status: 400 });
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      return NextResponse.json({ error: "Enter expiry as MM/YY." }, { status: 400 });
    }
    if (!/^\d{3,4}$/.test(cvc)) {
      return NextResponse.json({ error: "Enter a valid CVC." }, { status: 400 });
    }

    let quoteId: number | null = null;
    if (quoteIdRaw && Number.isFinite(quoteIdRaw)) {
      const [quote] = await db.select().from(quotes).where(eq(quotes.id, quoteIdRaw));
      if (quote) quoteId = quote.id;
    }

    // Simulate gateway latency.
    await new Promise((r) => setTimeout(r, 900));

    const reference = generateReference("PY");
    const transactionId = `txn_${Math.random().toString(36).slice(2, 12)}`;

    const [payment] = await db
      .insert(payments)
      .values({
        reference,
        quoteId,
        name,
        email,
        amount: amountRaw.toFixed(2),
        description,
        method,
        status: "succeeded",
        transactionId,
      })
      .returning();

    return NextResponse.json({ payment }, { status: 201 });
  } catch (err) {
    console.error("Failed to process payment", err);
    return NextResponse.json({ error: "Payment failed." }, { status: 500 });
  }
}
