import {
  PeoplePanel,
  type CustomerRow,
} from "@/features/portal/components/people-panel";
import { formatDate } from "@/features/portal/lib/format";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { listCustomers } from "@/server/queries/catalog";

export default async function PeoplePage() {
  await getRequiredSession("/dashboard/people");

  const { items, total } = await listCustomers({ take: 200 });

  const customers: CustomerRow[] = items.map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    accountType: customer.accountType,
    joinedLabel: formatDate(customer.createdAt),
    bookings: customer._count.bookings,
    payments: customer._count.payments,
  }));

  return <PeoplePanel customers={customers} total={total} />;
}
