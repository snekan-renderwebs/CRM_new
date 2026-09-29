import {
  NextRequest,
  NextResponse,
} from "next/server";

import { db } from "../../../../lib/db";

import {
  getAuthUser,hasRole
} from "../../../../lib/auth";

import {
  updateUserSchema,
} from "../../../../schemas/user";

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
    // JWT authentication
    const admin =
      getAuthUser(request);

    if (!admin) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Role authorization
    if (!hasRole(admin, ["ADMIN"])) {
  return NextResponse.json(
    {
      message: "Forbidden. Admin access required.",
    },
    { status: 403 }
  );
}

    const { id } =
      await context.params;

    const user =
      await db.user.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.error(
      "GET /api/users/[id] error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to fetch user",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // JWT authentication
    const admin =
      getAuthUser(request);

    if (!admin) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Role authorization
    if (!hasRole(admin, ["ADMIN"])) {
  return NextResponse.json(
    {
      message: "Forbidden. Admin access required.",
    },
    { status: 403 }
  );
}

    const { id } =
      await context.params;

    // Check user exists
    const existingUser =
      await db.user.findUnique({
        where: {
          id,
        },
      });

    if (!existingUser) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // Request body
    const body =
      await request.json();

    // Zod validation
    const validation =
      updateUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message:
            "Validation failed",

          errors:
            validation.error
              .flatten()
              .fieldErrors,
        },
        {
          status: 400,
        }
      );
    }

    const {
      name,
      email,
      role,
    } = validation.data;

    // Check duplicate email
    const emailUser =
      await db.user.findFirst({
        where: {
          email,

          NOT: {
            id,
          },
        },
      });

    if (emailUser) {
      return NextResponse.json(
        {
          message:
            "A user with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    // Update user
    const user =
      await db.user.update({
        where: {
          id,
        },

        data: {
          name,
          email,
          role,
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return NextResponse.json({
      message:
        "User updated successfully",

      user,
    });
  } catch (error) {
    console.error(
      "PUT /api/users/[id] error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to update user",
      },
      {
        status: 500,
      }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // JWT authentication
    const admin =
      getAuthUser(request);

    if (!admin) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Role authorization
    if (admin.role !== "ADMIN") {
      return NextResponse.json(
        {
          message:
            "Forbidden. Admin access required.",
        },
        {
          status: 403,
        }
      );
    }

    const { id } =
      await context.params;

    // Prevent self deletion
    if (admin.userId === id) {
      return NextResponse.json(
        {
          message:
            "You cannot delete your own account.",
        },
        {
          status: 400,
        }
      );
    }

    // Check user exists
    const existingUser =
      await db.user.findUnique({
        where: {
          id,
        },
      });

    if (!existingUser) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // Delete user
    await db.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message:
        "User deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE /api/users/[id] error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to delete user",
      },
      {
        status: 500,
      }
    );
  }
}