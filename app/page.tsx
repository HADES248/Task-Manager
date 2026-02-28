import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          TaskFlow
        </h1>

        <div className="flex gap-4 justify-center items-center">
          <Link
            href="/login"
            className="text-sm text-(--muted) hover:text-white transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-primary px-4 py-2 rounded-lg text-sm text-white hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <h2 className="text-5xl font-bold leading-tight max-w-3xl">
          Organize Your Work.
          <br />
          <span className="text-color-primary">
            Boost Your Productivity.
          </span>
        </h2>

        <p className="mt-6 text-lg text-(--muted) max-w-xl">
          A secure and powerful task management system built with
          modern technologies. Create, track, and complete your tasks
          efficiently from anywhere.
        </p>

        <div className="mt-10 flex gap-6 flex-wrap justify-center">
          <Link
            href="/register"
            className="bg-primary px-6 py-3 rounded-xl text-white font-medium hover:opacity-90 transition"
          >
            Create Account
          </Link>

          <Link
            href="/login"
            className="border border-(--border-color) px-6 py-3 rounded-xl text-white hover:bg-(--background-soft) transition"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-(--muted) border-t border-(--border-color)">
        © {new Date().getFullYear()} TaskFlow. Built with Next.js & Node.js.
      </footer>
    </main>
  );
}