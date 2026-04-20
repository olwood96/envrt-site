import { redirect } from "next/navigation";

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  redirect("/free-dpp");
}
