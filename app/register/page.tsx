import Link from "next/link";

export default function Register() {
  return (
    <main className="h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-(--background-soft) border border-(--border-color) rounded-xl p-6 shadow-lg">

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold">Create Account</h1>
          <p className="text-(--muted) mt-1 text-sm">
            Start managing your tasks today
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4">

          <div>
            <label className="text-xs text-(--muted)">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent border border-(--border-color) focus:outline-none focus:ring-2 focus:ring-primary transition text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-(--muted)">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent border border-(--border-color) focus:outline-none focus:ring-2 focus:ring-primary transition text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-(--muted)">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent border border-(--border-color) focus:outline-none focus:ring-2 focus:ring-primary transition text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-(--muted)">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent border border-(--border-color) focus:outline-none focus:ring-2 focus:ring-primary transition text-sm"
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-primary py-2.5 rounded-lg text-white font-medium hover:opacity-90 transition text-sm"
          >
            Create Account
          </button>
        </form>

        <div className="my-5 border-t border-(--border-color)" />

        <p className="text-center text-xs text-(--muted)">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}