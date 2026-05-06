import { redirect } from "next/navigation"

export default async function SchoolPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>
}) {
  const { schoolSlug } = await params
  redirect(`/app/schools/${schoolSlug}/general`)
}
