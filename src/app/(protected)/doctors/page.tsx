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
        <div className="grid grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </PageContent>
    </PageContainer>
  );
};
export default doctorsPage;
