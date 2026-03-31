import { redirect } from "next/navigation";

export default function CateringRedirect({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/catering`);
}
