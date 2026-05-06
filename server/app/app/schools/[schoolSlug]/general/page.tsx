import { GeneralForm } from "@/components/schools/general/general-form"
import { DangerZone } from "@/components/schools/general/danger-zone"

export default function GeneralPage() {
  return (
    <div className="flex max-w-xl flex-col gap-6">
      <GeneralForm />
      <DangerZone />
    </div>
  )
}
