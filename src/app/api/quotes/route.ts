import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { ensureDb } from "@/db/init";
import { quotes } from "@/db/schema";
import { estimate, generateReference, getService } from "@/lib/pricing";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  await ensureDb();
  const ref = req.nextUrl.searchParams.get("reference");
  if (ref) {
    const [quote] = await db.select().from(quotes).where(eq(quotes.reference, ref));
    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }
    return NextResponse.json({ quote });
  }
  const all = await db.select().from(quotes).orderBy(desc(quotes.createdAt)).limit(100);
  return NextResponse.json({ quotes: all });
}

export async function POST(req: NextRequest) {
  try {
    await ensureDb();
    const body = await req.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const serviceType = String(body.serviceType ?? "").trim();
    const projectDetails = String(body.projectDetails ?? "").trim();
    const phone = body.phone ? String(body.phone).trim() : null;
    const address = body.address ? String(body.address).trim() : null;
    const budget = body.budget ? String(body.budget).trim() : null;
    const timeline = body.timeline ? String(body.timeline).trim() : null;
    const squareFootageRaw = Number(body.squareFootage);
    const squareFootage = Number.isFinite(squareFootageRaw) ? Math.round(squareFootageRaw) : null;

    if (!name || !email || !serviceType || !projectDetails) {
      return NextResponse.json(
        { error: "Name, email, service type and project details are required." },
        { status: 400 }
      );
    }

    if (!getService(serviceType)) {
      return NextResponse.json({ error: "Invalid service type." }, { status: 400 });
    }

    const result = estimate({ serviceType, squareFootage: squareFootage ?? 0 });
    const reference = generateReference("QT");

    const [quote] = await db
      .insert(quotes)
      .values({
        reference,
        name,
        email,
        phone,
        serviceType,
        projectDetails,
        address,
        squareFootage,
        budget,
        timeline,
        estimatedAmount: result.total.toFixed(2),
        status: "estimated",
      })
      .returning();

    return NextResponse.json({ quote, estimate: result }, { status: 201 });
  } catch (err) {
    console.error("Failed to create quote", err);
    return NextResponse.json({ error: "Failed to create quote." }, { status: 500 });
  }
}
