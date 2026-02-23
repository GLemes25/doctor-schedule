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
import { doctorsTable } from "@/db/schema";
import { requiereAuthAndClinic } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { AddDoctorButton } from "./components/add-doctor-button";
import { DoctorCard } from "./components/doctor-card";

const doctorsPage = async () => {
  const session = await requiereAuthAndClinic();
  const clinicId = session.user.clinic!.id;
  const doctors = await db.query.doctorsTable.findMany({
    where: eq(doctorsTable.clinicId, clinicId),
  });
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencie os Médicos da sua Clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddDoctorButton session={session} />
        </PageActions>
      </PageHeader>
      <PageContent>
        {doctors.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="border-muted-foreground/25 bg-muted/30 flex flex-col items-center justify-center rounded-lg border border-dashed px-8 py-16 text-center">
            <p className="text-muted-foreground">Nenhum Médico cadastrado</p>
            <p className="text-muted-foreground/80 mt-1 text-sm">
              Clique em &quot;Adicionar Médico&quot; para começar
            </p>
          </div>
        )}
      </PageContent>
    </PageContainer>
  );
};
export default doctorsPage;
