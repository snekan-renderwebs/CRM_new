import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "../../../../lib/auth";
import { db } from "../../../../lib/db";
import { contactSchema } from "../../../../schemas/contact";

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
    const user = getAuthUser(request);

if (!user) {
  return NextResponse.json(
    {
      message: "Unauthorized",
    },
    { status: 401 }
  );
}
    const { id } = await context.params;

    const contact = await db.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return NextResponse.json(
        { message: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ contact });
  } catch (error) {
    console.error("Get contact error:", error);

    return NextResponse.json(
      { message: "Failed to fetch contact" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
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
    const { id } = await context.params;

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

    const existingContact = await db.contact.findUnique({
      where: { id },
    });

    if (!existingContact) {
      return NextResponse.json(
        { message: "Contact not found" },
        { status: 404 }
      );
    }

    const contact = await db.contact.update({
      where: { id },
      data: {
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        company: result.data.company || null,
        jobTitle: result.data.jobTitle || null,
      },
    });

    return NextResponse.json({
      message: "Contact updated successfully",
      contact,
    });
  } catch (error) {
    console.error("Update contact error:", error);

    return NextResponse.json(
      { message: "Failed to update contact" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
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
    const { id } = await context.params;

    const existingContact = await db.contact.findUnique({
      where: { id },
    });

    if (!existingContact) {
      return NextResponse.json(
        { message: "Contact not found" },
        { status: 404 }
      );
    }

    await db.contact.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Delete contact error:", error);

    return NextResponse.json(
      { message: "Failed to delete contact" },
      { status: 500 }
    );
  }
}