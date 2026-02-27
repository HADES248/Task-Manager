import Link from "next/link";

export default function Login() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-[var(--background-soft)] border border-[var(--border-color)] rounded-2xl p-8 shadow-xl">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold">Welcome Back</h1>
          <p className="text-[var(--muted)] mt-2 text-sm">
            Login to manage your tasks
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-5">

          {/* Email */}
          <div>
            <label className="text-sm text-[var(--muted)]">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-2 px-4 py-3 rounded-lg bg-transparent border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-[var(--muted)]">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full mt-2 px-4 py-3 rounded-lg bg-transparent border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="mt-4 bg-[var(--color-primary)] py-3 rounded-lg text-white font-medium hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 border-t border-[var(--border-color)]" />

        {/* Register Link */}
        <p className="text-center text-sm text-[var(--muted)]">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-[var(--color-primary)] hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}