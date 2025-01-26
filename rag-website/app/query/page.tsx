import { QueryForm } from "../../components/QueryForm"

export default function QueryPage() {
  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Query Documents</h1>
      <QueryForm />
    </div>
  )
}

