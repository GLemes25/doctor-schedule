import { DataTable } from "@/components/ui/data-tabel";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";
import { requiereAuthAndClinic } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { AddAppointmentButton } from "./components/add-appointment-button";
import { appointmentsTableColumns } from "./components/table-columns";

const AppointmentsPage = async () => {
  const session = await requiereAuthAndClinic();
  const clinicId = session.user.clinic!.id;

  const appointments = await db.query.appointmentsTable.findMany({
    where: eq(appointmentsTable.clinicId, clinicId),
    with: {
      patient: {
        columns: { name: true },
      },
      doctor: {
        columns: { name: true, specialty: true },
      },
    },
    orderBy: (table, { asc }) => asc(table.appointmentDateTime),
  });

  const patients = await db.query.patientsTable.findMany({
    where: eq(patientsTable.clinicId, clinicId),
    orderBy: (table, { asc }) => asc(table.name),
  });

  const doctors = await db.query.doctorsTable.findMany({
    where: eq(doctorsTable.clinicId, clinicId),
    orderBy: (table, { asc }) => asc(table.name),
  });

  const appointmentsWithRelations = appointments.map((apt) => ({
    ...apt,
    patient: { name: apt.patient.name },
    doctor: { name: apt.doctor.name, specialty: apt.doctor.specialty },
  }));

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>Gerencie os agendamentos da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddAppointmentButton session={session} patients={patients} doctors={doctors} />
        </PageActions>
      </PageHeader>
      <PageContent>
        {appointmentsWithRelations.length > 0 ? (
          <DataTable data={appointmentsWithRelations} columns={appointmentsTableColumns} />
        ) : (
          <div className="border-muted-foreground/25 bg-muted/30 flex flex-col items-center justify-center rounded-lg border border-dashed px-8 py-16 text-center">
            <p className="text-muted-foreground">Nenhum agendamento cadastrado</p>
            <p className="text-muted-foreground/80 mt-1 text-sm">
              Clique em &quot;Novo Agendamento&quot; para começar
            </p>
          </div>
        )}
      </PageContent>
    </PageContainer>
  );
};

export default AppointmentsPage;
