import { DashboardWrapper } from "@/components/shared/dashboardWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function UsersPage() {
  return (
    <DashboardWrapper
      title="Usuários"
      description="Gerencie os usuários do estabelecimento"
      btnTitle="Novo usuário"
      backHref="/admin/users/new"
    >
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          
        </CardContent>
      </Card>
    </DashboardWrapper>
  )
}