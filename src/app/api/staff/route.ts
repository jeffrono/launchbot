import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, error } from "@/lib/api";

// GET /api/staff — list all internal staff members
export async function GET() {
  const staff = await prisma.staffMember.findMany({
    orderBy: { name: "asc" },
  });
  return json(staff);
}

// POST /api/staff — create a staff member
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, role, bookingUrl, photoUrl } = body;

  if (!name || !email) return error("Name and email are required");

  const member = await prisma.staffMember.create({
    data: {
      name,
      email,
      phone: phone || "",
      role: role || "Onboarding Specialist",
      bookingUrl: bookingUrl || "",
      photoUrl: photoUrl || "",
    },
  });

  return json(member, 201);
}
