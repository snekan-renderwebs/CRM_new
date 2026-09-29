import { NextRequest, NextResponse } from "next/server";

import { getAuthUser } from "../../../lib/auth";
import { db } from "../../../lib/db";

export async function GET(
  request: NextRequest
) {
  try {
   
    const authUser = await getAuthUser(
      request
    );

    if (!authUser) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const userId = authUser.userId;


   
    const [
      totalContacts,
      totalLeads,
      totalTasks,

      pendingTasks,

      completedTasks,

      newLeads,
      contactedLeads,
      qualifiedLeads,
      lostLeads,

      recentLeads,

      upcomingTasks,
    ] = await Promise.all([

      
      db.contact.count({
        where: {
          userId,
        },
      }),

      
      db.lead.count({
        where: {
          userId,
        },
      }),

      
      db.task.count({
        where: {
          userId,
        },
      }),

      
      db.task.count({
        where: {
          userId,
          status: "PENDING",
        },
      }),

      db.task.count({
        where: {
          userId,
          status: "COMPLETED",
        },
      }),

      
      db.lead.count({
        where: {
          userId,
          status: "NEW",
        },
      }),

      
      db.lead.count({
        where: {
          userId,
          status: "CONTACTED",
        },
      }),

      
      db.lead.count({
        where: {
          userId,
          status: "QUALIFIED",
        },
      }),

      
      db.lead.count({
        where: {
          userId,
          status: "LOST",
        },
      }),

      
      db.lead.findMany({
        where: {
          userId,
        },

        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          status: true,
          createdAt: true,
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 5,
      }),

     
      db.task.findMany({
        where: {
          userId,

          status: {
            not: "COMPLETED",
          },

          dueDate: {
            not: null,
          },
        },

        select: {
          id: true,
          title: true,
          dueDate: true,
          priority: true,
          status: true,
        },

        orderBy: {
          dueDate: "asc",
        },

        take: 5,
      }),
    ]);


    
    return NextResponse.json({
      summary: {
        totalContacts,
        totalLeads,
        totalTasks,
        pendingTasks,
        completedTasks,
      },

      leadStatus: {
        new: newLeads,
        contacted: contactedLeads,
        qualified: qualifiedLeads,
        lost: lostLeads,
      },

      recentLeads,

      upcomingTasks,
    });

  } catch (error) {

    console.error(
      "Dashboard API error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to load dashboard data",
      },
      {
        status: 500,
      }
    );
  }
}