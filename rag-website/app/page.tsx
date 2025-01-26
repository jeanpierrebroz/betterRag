import Link from "next/link"
import { UploadForm } from "../components/UploadForm"

export default function Home() {
  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-4xl font-bold mb-8 text-center">RAG Document Query System</h1>
      <UploadForm />
      <div className="mt-8 text-center">
        <Link href="/query" className="text-blue-500 hover:text-blue-700 transition-colors">
          Go to Query Page
        </Link>
      </div>
    </div>
  )
}

