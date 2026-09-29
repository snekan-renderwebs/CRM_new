import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "../../../lib/auth";
import { db } from "../../../lib/db";
import { contactSchema } from "../../../schemas/contact";

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);

if (!user) {
  return NextResponse.json(
    {
      message: "Unauthorized",
    },
    { status: 401 }
  );
}
    const body = await request.json();

    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid contact data",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const contact = await db.contact.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        company: result.data.company || null,
        jobTitle: result.data.jobTitle || null,
        userId: user.userId,
      },
    });

    return NextResponse.json(
      {
        message: "Contact created successfully",
        contact,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create contact error:", error);

    return NextResponse.json(
      {
        message: "Failed to create contact",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }
    const searchParams = request.nextUrl.searchParams;

    const search = searchParams.get("search")?.trim() || "";

    const pageParam = Number(
      searchParams.get("page") || "1"
    );

    const limitParam = Number(
      searchParams.get("limit") || "10"
    );

    const page = Math.max(pageParam, 1);
    const limit = Math.min(
      Math.max(limitParam, 1),
      100
    );

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              phone: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              company: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

    const [contacts, total] = await Promise.all([
      db.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),

      db.contact.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Get contacts error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch contacts",
      },
      { status: 500 }
    );
  }
}