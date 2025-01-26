"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function UploadForm() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [indexing, setIndexing] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    for (const file of files) {
      const formData = new FormData()
      formData.append("file", file)

      try {
        const response = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData,
        })
        const result = await response.json()
        console.log(result.message)
      } catch (error) {
        console.error("Error uploading file:", error)
      }
    }

    setUploading(false)
  }

  const handleIndex = async () => {
    setIndexing(true)
    try {
      const response = await fetch("http://localhost:8000/index", {
        method: "POST",
      })
      const result = await response.json()
      console.log(result.message)
      router.push("/query")
    } catch (error) {
      console.error("Error indexing documents:", error)
    }
    setIndexing(false)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleUpload} className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                aria-hidden="true"
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PDF or TXT (MAX. 10MB)</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              multiple
              accept=".pdf,.txt"
            />
          </label>
        </div>
        <div>
          {files.map((file, index) => (
            <p key={index} className="text-sm text-gray-500">
              {file.name}
            </p>
          ))}
        </div>
        <button
          type="submit"
          disabled={uploading || files.length === 0}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      <button
        onClick={handleIndex}
        disabled={indexing || files.length === 0}
        className="w-full px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {indexing ? "Indexing..." : "Index Documents"}
      </button>
    </div>
  )
}

