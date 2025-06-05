import { DeployStatus } from "@/components/deploy-status"

export default function DeployStatusPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Estado del Deploy</h1>
      <div className="grid gap-6">
        <DeployStatus />
      </div>
    </div>
  )
}
