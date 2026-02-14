import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  time,
  timestamp,
} from "drizzle-orm/pg-core";

/* =========================
   ENUMS
========================= */

export const genderEnum = pgEnum("gender", ["male", "female"]);

/* =========================
   USERS
========================= */

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("users_email_idx").on(table.email),
  ]
);

/* =========================
   AUTH / SESSION
========================= */

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("session_user_id_idx").on(table.userId),
    index("session_expires_at_idx").on(table.expiresAt),
  ]
);

export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("account_user_id_idx").on(table.userId),
    index("account_provider_account_idx").on(
      table.providerId,
      table.accountId
    ),
  ]
);

export const verifications = pgTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("verification_identifier_idx").on(table.identifier),
    index("verification_expires_at_idx").on(table.expiresAt),
  ]
);

/* =========================
   CLINICS
========================= */

export const clinics = pgTable(
  "clinics",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("clinics_name_idx").on(table.name),
  ]
);

/* =========================
   USERS ↔ CLINICS (M:N)
========================= */

export const userToClinics = pgTable(
  "user_to_clinics",
  {
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    clinicId: text("clinic_id")
      .references(() => clinics.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.clinicId] }),
    index("user_to_clinics_user_id_idx").on(table.userId),
    index("user_to_clinics_clinic_id_idx").on(table.clinicId),
  ]
);

/* =========================
   DOCTORS
========================= */

export const doctors = pgTable(
  "doctors",
  {
    id: text("id").primaryKey(),
    clinicId: text("clinic_id")
      .references(() => clinics.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(),
    avatarImageUrl: text("avatar_image_url"),
    specialty: text("specialty").notNull(),
    gender: genderEnum("gender").notNull(),
    availabilityFromWeekDay: integer("availability_from_week_day").notNull(),
    availabilityToWeekDay: integer("availability_to_week_day").notNull(),
    availabilityFromTime: time("availability_from_time").notNull(),
    availabilityToTime: time("availability_to_time").notNull(),
    appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("doctors_clinic_id_idx").on(table.clinicId),
    index("doctors_specialty_idx").on(table.specialty),
  ]
);

/* =========================
   PATIENTS
========================= */

export const patients = pgTable(
  "patients",
  {
    id: text("id").primaryKey(),
    clinicId: text("clinic_id")
      .references(() => clinics.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    phoneNumber: text("phone_number").notNull(),
    gender: genderEnum("gender").notNull(),
    birthDate: date("birth_date").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("patients_clinic_id_idx").on(table.clinicId),
    index("patients_email_idx").on(table.email),
    index("patients_is_active_idx").on(table.isActive),
  ]
);

/* =========================
   APPOINTMENTS
========================= */

export const appointments = pgTable(
  "appointments",
  {
    id: text("id").primaryKey(),
    patientId: text("patient_id")
      .references(() => patients.id, { onDelete: "cascade" })
      .notNull(),
    doctorId: text("doctor_id")
      .references(() => doctors.id, { onDelete: "cascade" })
      .notNull(),
    clinicId: text("clinic_id")
      .references(() => clinics.id, { onDelete: "cascade" })
      .notNull(),
    appointmentDateTime: timestamp("appointment_date_time").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("appointments_clinic_id_idx").on(table.clinicId),
    index("appointments_doctor_id_idx").on(table.doctorId),
    index("appointments_patient_id_idx").on(table.patientId),
    index("appointments_datetime_idx").on(table.appointmentDateTime),
  ]
);

/* =========================
   RELATIONS 
========================= */

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  clinics: many(userToClinics),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const clinicsRelations = relations(clinics, ({ many }) => ({
  doctors: many(doctors),
  patients: many(patients),
  appointments: many(appointments),
  users: many(userToClinics),
}));

export const userToClinicsRelations = relations(
  userToClinics,
  ({ one }) => ({
    user: one(users, {
      fields: [userToClinics.userId],
      references: [users.id],
    }),
    clinic: one(clinics, {
      fields: [userToClinics.clinicId],
      references: [clinics.id],
    }),
  })
);

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  clinic: one(clinics, {
    fields: [doctors.clinicId],
    references: [clinics.id],
  }),
  appointments: many(appointments),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  clinic: one(clinics, {
    fields: [patients.clinicId],
    references: [clinics.id],
  }),
  appointments: many(appointments),
}));

export const appointmentsRelations = relations(
  appointments,
  ({ one }) => ({
    patient: one(patients, {
      fields: [appointments.patientId],
      references: [patients.id],
    }),
    doctor: one(doctors, {
      fields: [appointments.doctorId],
      references: [doctors.id],
    }),
    clinic: one(clinics, {
      fields: [appointments.clinicId],
      references: [clinics.id],
    }),
  })
);
