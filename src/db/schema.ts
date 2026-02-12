import { relations } from "drizzle-orm";
import { boolean, date, integer, pgEnum, pgTable, text, time, timestamp, uuid } from "drizzle-orm/pg-core";


export const genderEnum = pgEnum("gender", ["male", "female"]);

// Tabela de Usuarios 
export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

})]]]]]]

export const UserTableRelations = relations(usersTable, ({many}) => ({
  clinics: many(clinicsTable),
}));

//Tabela Intermediária Many-to-Many entre Usuarios e clinicas 

export const UserToClinicsTable = pgTable("user_to_clinics", {
  userId: uuid("user_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const UserToClinicsTableRelations = relations(UserToClinicsTable, ({one}) => ({
  user: one(usersTable, { fields: [UserToClinicsTable.userId], references: [usersTable.id] }),
  clinic: one(clinicsTable, { fields: [UserToClinicsTable.clinicId], references: [clinicsTable.id] }),
}));

// Tabela de Clínicas

export const clinicsTable = pgTable("clinics", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const clinicsTableRelations = relations(clinicsTable, ({many}) => ({
  doctors: many(doctorsTable),
  patients: many(patientsTable),
  appointments: many(appointmentsTable),
  UserToClinics: many(UserToClinicsTable),
}));

//Tabela de Doutores

export const doctorsTable = pgTable("doctors", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  avatarImageUrl: text("avatar_image_url"),
  specialty: text("specialty").notNull(),
  gender: genderEnum("gender").notNull(),
  availabilityFromWeekDay: integer("availability_from_week_day").notNull(), // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
  availabilityToWeekDay: integer("availability_to_week_day").notNull(),
  availabilityFromTime: time("availability_from_time").notNull(),
  availabilityToTime: time("availability_to_time").notNull(),
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const doctorsTableRelation = relations(doctorsTable, ({many, one}) => ({
  clinic : one(clinicsTable, { fields: [doctorsTable.clinicId], references: [clinicsTable.id] }),
  appointments: many(appointmentsTable),
}));

// Tabela de Pacientes

export const patientsTable = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phoneNumber").notNull(),
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, { onDelete: "cascade" }).notNull(),
  gender: genderEnum("gender").notNull(),
  birthDate: date("birth_date").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const patientsTableRelations = relations(patientsTable, ({many,one}) => ({
  clinic : one(clinicsTable, { fields: [patientsTable.clinicId], references: [clinicsTable.id] }),
  appointments: many(appointmentsTable),
}));

// Tabela de agendamentos 

export const appointmentsTable = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  patientId: uuid("patient_id").references(() => patientsTable.id, { onDelete: "cascade" }).notNull(),
  doctorId: uuid("doctor_id").references(() => doctorsTable.id, { onDelete: "cascade" }).notNull(),
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, { onDelete: "cascade" }).notNull(),
  appointmentDateTime: timestamp("appointment_date_time").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const appointmentsTableRelations = relations(appointmentsTable, ({one}) => ({
  patient : one(patientsTable, { fields: [appointmentsTable.patientId], references: [patientsTable.id] }),
  doctor : one(doctorsTable, { fields: [appointmentsTable.doctorId], references: [doctorsTable.id] }),
  clinic : one(clinicsTable, { fields: [appointmentsTable.clinicId], references: [clinicsTable.id] })
}));