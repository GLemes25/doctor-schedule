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
import { patientsTable } from "@/db/schema";
import { requiereAuthAndClinic } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { AddPatientButton } from "./components/add-patient-button";
import { PatientCard } from "./components/patient-card";

const PatientsPage = async () => {
  const session = await requiereAuthAndClinic();
  const clinicId = session.user.clinic!.id;
  const patients = await db.query.patientsTable.findMany({
    where: eq(patientsTable.clinicId, clinicId),
    orderBy: (table, { asc }) => asc(table.name),
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Pacientes</PageTitle>
          <PageDescription>Gerencie os pacientes da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddPatientButton session={session} />
        </PageActions>
      </PageHeader>
      <PageContent>
        {patients.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {patients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/30 px-8 py-16 text-center">
            <p className="text-muted-foreground">
              Nenhum paciente cadastrado
            </p>
            <p className="text-muted-foreground/80 mt-1 text-sm">
              Clique em &quot;Adicionar Paciente&quot; para começar
            </p>
          </div>
        )}
      </PageContent>
    </PageContainer>
  );
};

export default PatientsPage;
