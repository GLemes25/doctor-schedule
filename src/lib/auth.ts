import {
  accountsTable,
  sessionsTable,
  usersTable,
  userToClinicsTable,
  verificationsTable,
} from "@/db/schema";
import { headers } from "next/headers";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const authSchema = {
  usersTable,
  sessionsTable,
  accountsTable,
  verificationsTable,
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [
    customSession(async ({ user, session }) => {
      const [userClinic] = await db.query.userToClinicsTable.findMany({
        where: eq(userToClinicsTable.userId, user.id),
        with: {
          clinic: true,
        },
      });

      const clinic = userClinic?.clinic;

      // TODO: Adapatar para o usuario ter multiplas clinicas
      return {
        user: {
          ...user,
          clinic: clinic
            ? {
                id: clinic.id,
                name: clinic.name,
              }
            : null,
        },
        session,
      };
    }),
  ],

  user: {
    modelName: "usersTable",
  },
  session: {
    modelName: "sessionsTable",
  },
  account: {
    modelName: "accountsTable",
  },
  verification: {
    modelName: "verificationsTable",
  },

  emailAndPassword: {
    enabled: true,
  },
});

export const requiereAuthAndClinic = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }
  const clinics = session.user.clinic;

  if (!clinics) {
    redirect("/clinic-form");
  }
  return session;
};
