import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { requiereAuthAndClinic } from "@/lib/auth";
import { AddDoctorButton } from "./_components/add-doctor-button";

const doctorsPage = async () => {
  const session = await requiereAuthAndClinic();
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
        <h1>Médicos</h1>
      </PageContent>
    </PageContainer>
  );
};
export default doctorsPage;
