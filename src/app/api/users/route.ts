import {
  NextRequest,
  NextResponse,
} from "next/server";

import bcrypt from "bcryptjs";

import { db } from "../../../lib/db";

import {
  getAuthUser,hasRole,
} from "../../../lib/auth";

import {
  createUserSchema,
} from "../../../schemas/user";


export async function GET(
  request: NextRequest
) {
  try {
    const user =
      getAuthUser(request);

    // JWT check
    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Role check
    if (!hasRole(user, ["ADMIN"])) {
  return NextResponse.json(
    {
      message: "Forbidden. Admin access required.",
    },
    { status: 403 }
  );
}

    const { searchParams } =
      new URL(request.url);

    const search =
      searchParams.get("search")?.trim() || "";

    const pageParam =
      Number(searchParams.get("page")) || 1;

    const limitParam =
      Number(searchParams.get("limit")) || 10;

    const page = Math.max(
      1,
      pageParam
    );

    const limit = Math.min(
      Math.max(1, limitParam),
      100
    );

    const skip =
      (page - 1) * limit;

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
          ],
        }
      : {};

    const [
      users,
      total,
    ] = await Promise.all([
      db.user.findMany({
        where,

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },

        orderBy: {
          createdAt: "desc",
        },

        skip,
        take: limit,
      }),

      db.user.count({
        where,
      }),
    ]);

    const totalPages =
      Math.ceil(total / limit);

    return NextResponse.json({
      users,

      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/users error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to fetch users",
      },
      {
        status: 500,
      }
    );
  }
}


export async function POST(
  request: NextRequest
) {
  try {
    const user =
      getAuthUser(request);

    // JWT check
    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Role check
    if (!hasRole(user, ["ADMIN"])) {
  return NextResponse.json(
    {
      message: "Forbidden. Admin access required.",
    },
    { status: 403 }
  );
}

    const body =
      await request.json();

    const validation =
      createUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message:
            "Validation failed",

          errors:
            validation.error.flatten()
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
      password,
      role,
    } = validation.data;

    // Check duplicate email
    const existingUser =
      await db.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
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

    // Hash password
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const newUser =
      await db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },

        // Never return password
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return NextResponse.json(
      {
        message:
          "User created successfully",

        user: newUser,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/users error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to create user",
      },
      {
        status: 500,
      }
    );
  }
}