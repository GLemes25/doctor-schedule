import bcrypt from "bcryptjs";
import { db } from "./index";
import {
  accountsTable,
  appointmentsTable,
  clinicsTable,
  doctorsTable,
  patientsTable,
  usersTable,
  userToClinicsTable,
} from "./schema";

const SEED_EMAIL = "admin@admin.com";
const SEED_PASSWORD = "adminadmin";

// --- DADOS MOCKADOS PARA POPULAR O BANCO ---

const doctorsMock = [
  {
    name: "Dr. Roberto Silva",
    specialty: "Cardiologia",
    gender: "male" as const,
    price: 25000,
    start: "08:00:00",
    end: "18:00:00",
  },
  {
    name: "Dra. Amanda Costa",
    specialty: "Dermatologia",
    gender: "female" as const,
    price: 20000,
    start: "09:00:00",
    end: "17:00:00",
  },
  {
    name: "Dr. Carlos Eduardo",
    specialty: "Ortopedia",
    gender: "male" as const,
    price: 30000,
    start: "08:00:00",
    end: "14:00:00",
  },
  {
    name: "Dra. Juliana Mendes",
    specialty: "Pediatria",
    gender: "female" as const,
    price: 18000,
    start: "10:00:00",
    end: "19:00:00",
  },
  {
    name: "Dr. Fernando Souza",
    specialty: "Clínica Médica",
    gender: "male" as const,
    price: 15000,
    start: "07:00:00",
    end: "16:00:00",
  },
  {
    name: "Dra. Beatriz Lima",
    specialty: "Psiquiatria",
    gender: "female" as const,
    price: 35000,
    start: "13:00:00",
    end: "20:00:00",
  },
];

const patientsMock = [
  {
    name: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    phone: "67991234567",
    gender: "female" as const,
    birth: "1990-05-15",
  },
  {
    name: "João Pedro Alves",
    email: "joao.alves@email.com",
    phone: "67998765432",
    gender: "male" as const,
    birth: "1985-10-22",
  },
  {
    name: "Ana Clara Souza",
    email: "ana.souza@email.com",
    phone: "67992345678",
    gender: "female" as const,
    birth: "2001-03-08",
  },
  {
    name: "Lucas Fernandes",
    email: "lucas.fer@email.com",
    phone: "67993456789",
    gender: "male" as const,
    birth: "1978-11-30",
  },
  {
    name: "Fernanda Lima",
    email: "fe.lima@email.com",
    phone: "67994567890",
    gender: "female" as const,
    birth: "1995-07-12",
  },
  {
    name: "Rafael Gomes",
    email: "rafa.gomes@email.com",
    phone: "67995678901",
    gender: "male" as const,
    birth: "1988-02-25",
  },
  {
    name: "Camila Rocha",
    email: "camila.rocha@email.com",
    phone: "67996789012",
    gender: "female" as const,
    birth: "1992-09-18",
  },
  {
    name: "Bruno Henrique",
    email: "bruno.h@email.com",
    phone: "67997890123",
    gender: "male" as const,
    birth: "1980-12-05",
  },
  {
    name: "Patricia Santos",
    email: "paty.santos@email.com",
    phone: "67998901234",
    gender: "female" as const,
    birth: "1975-04-20",
  },
  {
    name: "Diego Martins",
    email: "diego.m@email.com",
    phone: "67999012345",
    gender: "male" as const,
    birth: "1998-08-14",
  },
  {
    name: "Vanessa Costa",
    email: "vanessa.c@email.com",
    phone: "67991122334",
    gender: "female" as const,
    birth: "1983-06-11",
  },
  {
    name: "Rodrigo Silva",
    email: "rodrigo.silva@email.com",
    phone: "67992233445",
    gender: "male" as const,
    birth: "1991-01-28",
  },
  {
    name: "Juliana Castro",
    email: "ju.castro@email.com",
    phone: "67993344556",
    gender: "female" as const,
    birth: "1987-05-09",
  },
  {
    name: "Thiago Ribeiro",
    email: "thiago.r@email.com",
    phone: "67994455667",
    gender: "male" as const,
    birth: "1994-11-16",
  },
  {
    name: "Mariana Azevedo",
    email: "mari.azevedo@email.com",
    phone: "67995566778",
    gender: "female" as const,
    birth: "2005-02-03",
  },
];

// Função auxiliar para gerar datas aleatórias para as consultas
function getRandomAppointmentDate(daysOffsetStart: number, daysOffsetEnd: number) {
  const date = new Date();
  const offset =
    Math.floor(Math.random() * (daysOffsetEnd - daysOffsetStart + 1)) + daysOffsetStart;
  date.setDate(date.getDate() + offset);

  // Define horário aleatório entre 08:00 e 17:00
  const randomHour = Math.floor(Math.random() * (17 - 8 + 1)) + 8;
  const randomMinute = Math.random() > 0.5 ? 0 : 30; // Consultas em hora cheia ou meia hora

  date.setHours(randomHour, randomMinute, 0, 0);
  return date;
}

async function main() {
  console.log("🌱 Iniciando seed do banco de dados com volume de dados...");

  console.log("🗑️  Limpando tabelas existentes...");
  await db.delete(appointmentsTable);
  await db.delete(patientsTable);
  await db.delete(doctorsTable);
  await db.delete(userToClinicsTable);
  await db.delete(accountsTable);
  await db.delete(usersTable);
  await db.delete(clinicsTable);
  console.log("✅ Tabelas limpas.");

  console.log("🏥 Criando clínica...");
  const [clinic] = await db
    .insert(clinicsTable)
    .values({ name: "Clínica Doctor Schedule" })
    .returning();
  console.log(`✅ Clínica criada: ${clinic.name}`);

  console.log("👤 Criando usuário administrador...");
  const userId = crypto.randomUUID();
  const [user] = await db
    .insert(usersTable)
    .values({
      id: userId,
      name: "Administrador",
      email: SEED_EMAIL,
      emailVerified: true,
    })
    .returning();

  const hashedPassword = bcrypt.hashSync(SEED_PASSWORD, 10);
  await db.insert(accountsTable).values({
    id: crypto.randomUUID(),
    userId: user.id,
    accountId: user.email,
    providerId: "credential",
    password: hashedPassword,
  });

  await db.insert(userToClinicsTable).values({
    userId: user.id,
    clinicId: clinic.id,
  });
  console.log("✅ Administrador e credenciais criados.");

  console.log("👨‍⚕️ Inserindo médicos...");
  const insertedDoctors = await db
    .insert(doctorsTable)
    .values(
      doctorsMock.map((doc) => ({
        clinicId: clinic.id,
        name: doc.name,
        specialty: doc.specialty,
        gender: doc.gender,
        availabilityFromWeekDay: 1, // Segunda
        availabilityToWeekDay: 5, // Sexta
        availabilityFromTime: doc.start,
        availabilityToTime: doc.end,
        appointmentPriceInCents: doc.price,
      })),
    )
    .returning();
  console.log(`✅ ${insertedDoctors.length} médicos cadastrados.`);

  console.log("🧑‍🤝‍🧑 Inserindo pacientes...");
  const insertedPatients = await db
    .insert(patientsTable)
    .values(
      patientsMock.map((pat) => ({
        clinicId: clinic.id,
        name: pat.name,
        email: pat.email,
        phoneNumber: pat.phone,
        gender: pat.gender,
        birthDate: pat.birth,
        isActive: true,
      })),
    )
    .returning();
  console.log(`✅ ${insertedPatients.length} pacientes cadastrados.`);

  console.log("📅 Gerando agendamentos (passados e futuros)...");
  const appointmentsToInsert = [];

  // Gerar cerca de 45 consultas distribuídas
  for (let i = 0; i < 45; i++) {
    // Escolhe um paciente e um médico aleatoriamente
    const randomPatient = insertedPatients[Math.floor(Math.random() * insertedPatients.length)];
    const randomDoctor = insertedDoctors[Math.floor(Math.random() * insertedDoctors.length)];

    // Intervalo: de 15 dias atrás até 30 dias no futuro
    const appointmentDate = getRandomAppointmentDate(-15, 30);

    appointmentsToInsert.push({
      patientId: randomPatient.id,
      doctorId: randomDoctor.id,
      clinicId: clinic.id,
      appointmentPriceInCents: randomDoctor.appointmentPriceInCents,
      appointmentDateTime: appointmentDate,
    });
  }

  await db.insert(appointmentsTable).values(appointmentsToInsert);
  console.log(`✅ ${appointmentsToInsert.length} agendamentos gerados com sucesso.`);

  console.log("\n========================================");
  console.log("✅ Seed concluído com sucesso!");
  console.log("========================================");
  console.log("🔑 Credenciais de acesso:");
  console.log(`   Login:  ${SEED_EMAIL}`);
  console.log(`   Senha:  ${SEED_PASSWORD}`);
  console.log("========================================\n");

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
