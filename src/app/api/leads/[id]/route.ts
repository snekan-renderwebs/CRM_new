import { NextRequest, NextResponse } from "next/server";

import { db } from "../../../../lib/db";
import { getAuthUser } from "../../../../lib/auth";
import { createLeadSchema } from "../../../../schemas/lead";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const lead = await db.lead.findUnique({
      where: {
        id,
      },
    });

    if (!lead) {
      return NextResponse.json(
        { message: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      lead,
    });
  } catch (error) {
    console.error("Get lead error:", error);

    return NextResponse.json(
      { message: "Failed to fetch lead" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const existingLead = await db.lead.findUnique({
      where: {
        id,
      },
    });

    if (!existingLead) {
      return NextResponse.json(
        { message: "Lead not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const validation = createLeadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      phone,
      company,
      source,
      status,
      notes,
    } = validation.data;

    const lead = await db.lead.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        phone,
        company: company || null,
        source: source || null,
        status,
        notes: notes || null,
      },
    });

    return NextResponse.json({
      message: "Lead updated successfully",
      lead,
    });
  } catch (error) {
    console.error("Update lead error:", error);

    return NextResponse.json(
      { message: "Failed to update lead" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const existingLead = await db.lead.findUnique({
      where: {
        id,
      },
    });

    if (!existingLead) {
      return NextResponse.json(
        { message: "Lead not found" },
        { status: 404 }
      );
    }

    await db.lead.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Delete lead error:", error);

    return NextResponse.json(
      { message: "Failed to delete lead" },
      { status: 500 }
    );
  }
}