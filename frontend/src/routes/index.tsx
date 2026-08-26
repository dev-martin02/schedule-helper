import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const url = 'http://127.0.0.1:8000'

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const subject = formData.get('subject')

    if (typeof subject !== 'string' || !subject.trim()) {
      throw new Error('Subject is required')
    }

    const params = new URLSearchParams({ subject })

    const response = await fetch(`${url}/courses?${params}`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    console.log(data)
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-slate-50 to-red-50 px-4 py-16 text-slate-900">
      <h1 className="mb-10 text-center text-4xl font-bold tracking-tight text-red-800 sm:text-5xl">
        Welcome to Montclair Planner
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60"
      >
        <h2 className="text-2xl font-semibold">Search for your classes</h2>
        <input
          type="text"
          name="subject"
          id="subject"
          placeholder="nameOfCourse NumberOfCourse"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-red-600 focus:ring-4 focus:ring-red-100"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-red-700 px-4 py-3 font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-200 active:scale-[0.99]"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
