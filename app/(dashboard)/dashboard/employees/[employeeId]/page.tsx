import { EmployeeProfileScreen } from "@/components/dashboard/employees/employee-profile-screen";

export default async function EmployeeProfilePage({
  params,
}: {
  params: Promise<{ employeeId: string }>;
}) {
  const { employeeId } = await params;
  return <EmployeeProfileScreen employeeId={employeeId} />;
}
