"use client";

import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-[#fffaf5]">

      {/* Header */}
      <header className="border-b border-[#eee7e1] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-[72px] sm:px-8 lg:px-10">

          {/* Logo */}
          <a
            href="/"
            className="shrink-0 text-lg font-extrabold tracking-tight text-gray-900 sm:text-xl"
          >
            Scroll<span className="text-[#ff6b1a]">Mart</span>
          </a>

          {/* Register */}
          <p className="text-xs text-gray-500 sm:text-sm">
            <span className="hidden sm:inline">
              New to ScrollMart?{" "}
            </span>

            <a
              href="/register"
              className="font-semibold text-[#ff6b1a] transition hover:text-[#e9570b]"
            >
              Create account
            </a>
          </p>

        </div>
      </header>


      {/* Main */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 sm:px-8 sm:py-12 sm:min-h-[calc(100vh-72px)] xl:grid-cols-[0.9fr_1.1fr] xl:gap-14 xl:px-10 xl:py-10">

        {/* ================= LEFT ================= */}
        <div className="mx-auto w-full max-w-[430px]">

          {/* Heading */}
          <div className="mb-6">

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Welcome Back
            </h1>

            <p className="mt-2.5 max-w-md text-sm leading-6 text-gray-500">
              Login to your account and continue your journey with ScrollMart.
            </p>
          </div>


          {/* Login Card */}
          <div className="rounded-3xl border border-[#eee7e1] bg-white p-5 shadow-[0_15px_50px_rgba(40,20,10,0.06)] sm:p-7">

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#ff6b1a] focus:ring-4 focus:ring-orange-100"
              />
            </div>


            {/* Password */}
            <div className="mt-5">

              <div className="mb-2 flex items-center justify-between gap-3">

                <label className="text-sm font-semibold text-gray-800">
                  Password
                </label>

                <button
                  type="button"
                  className="shrink-0 text-xs font-semibold text-[#ff6b1a] transition hover:text-[#e9570b]"
                >
                  Forgot password?
                </button>

              </div>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 pr-16 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#ff6b1a] focus:ring-4 focus:ring-orange-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-gray-500 transition hover:bg-orange-50 hover:text-[#ff6b1a]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* Remember */}
            <div className="mt-5 flex items-center gap-2">

              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 accent-[#ff6b1a]"
              />

              <label
                htmlFor="remember"
                className="text-xs text-gray-500"
              >
                Remember me
              </label>

            </div>


            {/* Login */}
            <button
              type="button"
              className="mt-6 h-12 w-full rounded-xl bg-[#ff6b1a] text-sm font-bold text-white shadow-sm transition hover:bg-[#e9570b] hover:shadow-md"
            >
              Login
            </button>


            {/* Divider */}
            <div className="my-6 flex items-center gap-3">

              <div className="h-px flex-1 bg-gray-200" />

              <span className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                or continue with
              </span>

              <div className="h-px flex-1 bg-gray-200" />

            </div>


            {/* Social */}
            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              >
                <span className="font-bold text-[#4285F4]">
                  G
                </span>

                Google
              </button>


              <button
                type="button"
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              >
                <span className="font-bold">
                  
                </span>

                Apple
              </button>

            </div>


            {/* Register */}
            <p className="mt-6 text-center text-xs text-gray-500">

              Don't have an account?{" "}

              <a
                href="/register"
                className="font-bold text-[#ff6b1a] transition hover:text-[#e9570b]"
              >
                Register
              </a>

            </p>

          </div>

        </div>


        {/* ================= RIGHT ================= */}
        <div className="w-full">

          <div className="relative overflow-hidden rounded-[2rem] bg-[#171717] px-6 py-7 shadow-[0_25px_70px_rgba(20,10,5,0.15)] sm:px-9 sm:py-9 lg:min-h-[560px] lg:px-10 lg:py-10">

            {/* Decorative circles */}
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ff6b1a]/20" />

            <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-[#ff6b1a]/10" />


            <div className="relative z-10 flex h-full flex-col">

              {/* Badge */}
              <div>
                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-orange-300">
                  ScrollMart Creator Network
                </span>
              </div>


              {/* Heading */}
              <h2 className="mt-10 text-4xl font-extrabold leading-[1.04] tracking-tight text-white sm:mt-12 sm:text-5xl">

                Creators.
                <br />

                Brands.
                <br />

                <span className="text-[#ff6b1a]">
                  Opportunities.
                </span>

              </h2>


              {/* Description */}
              <p className="mt-6 max-w-md text-sm leading-7 text-gray-400">
                Connect with the right people, discover meaningful
                collaborations, and grow your creator journey — all in one
                place.
              </p>


              {/* Stats */}
              <div className="mt-9 grid grid-cols-3 gap-2 sm:mt-11 sm:gap-4">

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="text-lg font-bold text-white sm:text-xl">
                    1M+
                  </p>

                  <p className="mt-1 text-[8px] uppercase tracking-wider text-gray-500 sm:text-[10px]">
                    Opportunities
                  </p>
                </div>


                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="text-lg font-bold text-white sm:text-xl">
                    92%
                  </p>

                  <p className="mt-1 text-[8px] uppercase tracking-wider text-gray-500 sm:text-[10px]">
                    Match Rate
                  </p>
                </div>


                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="text-lg font-bold text-white sm:text-xl">
                    500+
                  </p>

                  <p className="mt-1 text-[8px] uppercase tracking-wider text-gray-500 sm:text-[10px]">
                    Brands
                  </p>
                </div>

              </div>


              {/* Quote */}
              <div className="mt-9 border-l-2 border-[#ff6b1a] pl-4 sm:mt-11 sm:pl-5">

                <p className="text-sm italic leading-6 text-gray-300">
                  “Great collaborations create greater stories.”
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}