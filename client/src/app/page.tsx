"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const creators = [
  {
    name: "Ananya Sharma",
    handle: "@ananyasharma",
    followers: "248K",
    engagement: "6.8%",
    match: "92%",
    category: "Fashion",
  },
  {
    name: "Rohan Verma",
    handle: "@rohanverma",
    followers: "182K",
    engagement: "6.8%",
    match: "92%",
    category: "Travel",
  },
  {
    name: "Sneha Creates",
    handle: "@sneha.creates",
    followers: "310K",
    engagement: "6.8%",
    match: "92%",
    category: "Lifestyle",
  },
];

const features = [
  {
    number: "01",
    title: "Discover Creators",
    description:
      "Find creators based on niche, audience, engagement and campaign requirements.",
  },
  {
    number: "02",
    title: "Launch Campaigns",
    description:
      "Create campaigns, send offers and manage collaborations from one dashboard.",
  },
  {
    number: "03",
    title: "Track Performance",
    description:
      "Monitor campaign progress, creator performance and important campaign metrics.",
  },
];

export default function Home() {
  const creatorImages = [
    "/Creator-card1.jpeg",
    "/Creator-card2.jpeg",
    "/Creator-card3.jpeg",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % creatorImages.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-black">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 border-b border-black/[0.05] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between px-5 sm:px-8">

          {/* Logo */}
          <a href="#" className="flex shrink-0 items-center">
            <div className="leading-none">
              <div className="text-[19px] font-extrabold tracking-[-0.03em]">
                Scroll<span className="text-[#ff6b1a]">Mart</span>
              </div>

              <div className="mt-1 text-[8px] font-semibold tracking-[0.16em] text-gray-400">
                CONNECT · COLLABORATE · GROW
              </div>
            </div>
          </a>


          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 text-[14px] font-medium text-gray-600 lg:flex">

            <a
              href="#features"
              className="transition-colors hover:text-[#ff6b1a]"
            >
              Features
            </a>

            <a
              href="#creators"
              className="transition-colors hover:text-[#ff6b1a]"
            >
              For Creators
            </a>

            <a
              href="#brands"
              className="transition-colors hover:text-[#ff6b1a]"
            >
              For Brands
            </a>

            <a
              href="#campaigns"
              className="transition-colors hover:text-[#ff6b1a]"
            >
              Campaigns
            </a>

          </nav>


          {/* ================= RIGHT SIDE ================= */}
          <div className="flex shrink-0 items-center gap-3">

            {/* Desktop Login + Get Started */}
            <div className="hidden items-center gap-5 lg:flex">

              <a
                href="/login"
                className="text-[14px] font-medium text-gray-700 transition hover:text-[#ff6b1a]"
              >
                Login
              </a>

              <a
                href="#brands"
                className="inline-flex rounded-full bg-[#ff6b1a] px-5 py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:bg-[#e85c0b]"
              >
                Get Started →
              </a>

            </div>


            {/* Tablet + Mobile Hamburger */}
            <details className="relative lg:hidden">

              <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-gray-200 bg-white text-xl text-gray-700 transition hover:border-[#ff6b1a] hover:text-[#ff6b1a]">
                ☰
              </summary>

              {/* Mobile / Tablet Menu */}
              <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-gray-200 bg-white p-3 shadow-[0_15px_40px_rgba(0,0,0,0.12)]">

                <div className="flex flex-col gap-1">

                  <a
                    href="#features"
                    className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-[#ff6b1a]"
                  >
                    Features
                  </a>

                  <a
                    href="#creators"
                    className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-[#ff6b1a]"
                  >
                    For Creators
                  </a>

                  <a
                    href="#brands"
                    className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-[#ff6b1a]"
                  >
                    For Brands
                  </a>

                  <a
                    href="#campaigns"
                    className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-[#ff6b1a]"
                  >
                    Campaigns
                  </a>

                  <div className="my-2 border-t border-gray-100" />

                  <a
                    href="/login"
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-orange-50 hover:text-[#ff6b1a]"
                  >
                    Login
                  </a>

                  <a
                    href="#brands"
                    className="mt-1 rounded-full bg-[#ff6b1a] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#e85c0b]"
                  >
                    Get Started →
                  </a>

                </div>

              </div>

            </details>

          </div>

        </div>
      </header>


      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">

        {/* IMPORTANT:
            Desktop = 2 columns
            Tablet/Mobile = 1 column
        */}
        <div className="mx-auto grid max-w-[1240px] items-center gap-8 px-5 py-10 sm:px-8 md:min-h-[505px] md:grid-cols-[0.95fr_1.05fr] md:gap-0 lg:py-6">


          {/* ================= HERO TEXT ================= */}
          <div className="relative z-20 max-w-[570px]">

            <div className="mb-5 inline-flex items-center rounded-full border border-[#ff6b1a]/20 bg-[#fff7f2] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#e65f16]">
              ✦ #1 Influencer Marketing Platform
            </div>


            <h1 className="text-[44px] font-extrabold leading-[0.98] tracking-[-0.05em] sm:text-[52px] lg:text-[68px]">
              Connect
              <br />
              Brands
              <br />
              with the{" "}
              <span className="text-[#ff6b1a]">Right</span>
              <br />
              Influencers.
            </h1>


            <p className="mt-5 max-w-[500px] text-[15px] leading-7 text-gray-500 sm:text-[16px]">
              Discover creators, build powerful campaigns, and create
              authentic collaborations that turn attention into real business
              growth.
            </p>


            <div className="mt-6 flex flex-wrap items-center gap-4">

              <a
                href="#brands"
                className="rounded-full bg-[#ff6b1a] px-6 py-3.5 text-[13px] font-bold text-white shadow-sm transition hover:bg-[#e85c0b]"
              >
                Get Started →
              </a>

              <a
                href="#features"
                className="flex items-center gap-2 rounded-full px-3 py-3 text-[13px] font-semibold text-gray-700 transition hover:text-[#ff6b1a]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-[9px]">
                  ▶
                </span>
                Watch Demo
              </a>

            </div>

          </div>


          {/* ================= HERO VISUAL ================= */}
          <div className="relative mt-8 flex h-[400px] items-center justify-center sm:h-[430px] lg:mt-0 lg:h-[470px]">

            {/* Background Shape */}
            <div className="absolute left-1/2 top-1/2 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-[65px] bg-[#fff0df] sm:h-[340px] sm:w-[340px] lg:h-[370px] lg:w-[370px]" />


            {/* Main Visual */}
            <div className="relative z-10 flex items-center justify-center">

              {/* Main Creator Card */}
              <div className="relative h-[350px] w-[270px] overflow-hidden rounded-[28px] border border-white bg-[#ff8b27] shadow-[0_25px_60px_rgba(0,0,0,0.13)] sm:h-[370px] sm:w-[285px] lg:h-[410px] lg:w-[315px]">

                <Image
                  key={currentImage}
                  src={creatorImages[currentImage]}
                  alt="Creator"
                  fill
                  priority
                  className="object-cover transition-opacity duration-700"
                  sizes="(max-width: 640px) 270px, (max-width: 1024px) 285px, 315px"
                />

              </div>

            </div>

          </div>

        </div>


        {/* ================= HERO STATS ================= */}
        <div className="mx-auto grid max-w-[900px] grid-cols-2 border-t border-black/[0.05] px-5 sm:grid-cols-4 sm:px-8">

          <div className="py-4 text-center sm:border-r sm:border-black/[0.05]">
            <p className="text-xl font-extrabold">
              10K+
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-wider text-gray-400">
              Creators
            </p>
          </div>


          <div className="py-4 text-center sm:border-r sm:border-black/[0.05]">
            <p className="text-xl font-extrabold">
              500+
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-wider text-gray-400">
              Brands
            </p>
          </div>


          <div className="py-4 text-center sm:border-r sm:border-black/[0.05]">
            <p className="text-xl font-extrabold">
              1M+
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-wider text-gray-400">
              Opportunities
            </p>
          </div>


          <div className="py-4 text-center">
            <p className="text-xl font-extrabold">
              92%
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-wider text-gray-400">
              Match Rate
            </p>
          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="border-y border-[#eee7e1] bg-white"
      >

        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 lg:py-16">

          <div className="mx-auto max-w-[650px] text-center">

            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#ff6b1a]">
              Everything you need
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
              One platform.
              <br />
              Endless possibilities.
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              From discovering the perfect creator to managing campaigns,
              ScrollMart keeps everything in one place.
            </p>

          </div>


          {/* Feature Cards */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">

            {features.map((feature) => (
              <div
                key={feature.number}
                className="group flex min-h-[245px] flex-col rounded-[22px] border border-[#eee7e1] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#ff6b1a]/30 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)]"
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1e7] text-sm font-bold text-[#ff6b1a]">
                    {feature.number}
                  </div>

                  <span className="text-xs text-[#ff6b1a] transition group-hover:translate-x-1">
                    →
                  </span>

                </div>

                <h3 className="mt-6 text-lg font-extrabold">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {feature.description}
                </p>

                <a
                  href="#creators"
                  className="mt-auto pt-5 text-xs font-bold text-[#ff6b1a]"
                >
                  Learn more →
                </a>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* ================= CREATORS ================= */}
      <section id="creators" className="bg-white">

        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 lg:py-16">

          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

            <div>

              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#ff6b1a]">
                Creator Network
              </p>

              <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
                Meet creators who move people.
              </h2>

            </div>

            <a
              href="#creators"
              className="text-xs font-bold text-[#ff6b1a]"
            >
              Explore creators →
            </a>

          </div>


          {/* Creator Cards */}
          <div className="grid gap-4 md:grid-cols-3">

            {creators.map((creator) => (
              <div
                key={creator.name}
                className="rounded-[22px] border border-[#eee7e1] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)]"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff0df] text-sm font-bold text-[#ff6b1a]">
                    {creator.name.charAt(0)}
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold">
                      {creator.name}
                    </h3>

                    <p className="text-[10px] text-gray-400">
                      {creator.handle}
                    </p>
                  </div>

                </div>


                {/* Stats */}
                <div className="mt-6 grid grid-cols-3 gap-2">

                  <div>
                    <p className="text-lg font-extrabold">
                      {creator.followers}
                    </p>

                    <p className="text-[8px] uppercase tracking-wide text-gray-400">
                      Followers
                    </p>
                  </div>

                  <div>
                    <p className="text-lg font-extrabold">
                      {creator.engagement}
                    </p>

                    <p className="text-[8px] uppercase tracking-wide text-gray-400">
                      Engagement
                    </p>
                  </div>

                  <div>
                    <p className="text-lg font-extrabold text-[#ff6b1a]">
                      {creator.match}
                    </p>

                    <p className="text-[8px] uppercase tracking-wide text-gray-400">
                      Match
                    </p>
                  </div>

                </div>


                {/* Bottom */}
                <div className="mt-6 flex items-center justify-between gap-3">

                  <span className="rounded-full bg-[#fff5ee] px-3 py-1.5 text-[9px] font-semibold text-[#ff6b1a]">
                    {creator.category}
                  </span>

                  <button className="rounded-full bg-[#ff6b1a] px-4 py-2 text-[10px] font-bold text-white transition hover:bg-[#e85c0b]">
                    View Profile
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* ================= BRANDS ================= */}
      <section id="brands" className="px-5 py-10 sm:px-8 lg:py-12">

        <div className="mx-auto max-w-[1180px]">

          <div
            id="campaigns"
            className="overflow-hidden rounded-[30px] bg-[#111111] px-7 py-10 text-white sm:px-10 lg:px-14 lg:py-12"
          >

            <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr]">

              {/* Left */}
              <div>

                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#ff8a35]">
                  For Brands
                </p>

                <h2 className="mt-3 max-w-[550px] text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
                  Turn your next campaign into a story people remember.
                </h2>

                <p className="mt-4 max-w-[500px] text-sm leading-6 text-gray-400">
                  Connect with relevant creators, launch campaigns and build
                  authentic relationships with audiences that matter.
                </p>

                <a
                  href="#campaigns"
                  className="mt-6 inline-flex rounded-full bg-[#ff6b1a] px-6 py-3.5 text-xs font-bold text-white transition hover:bg-[#ff812e]"
                >
                  Start a Campaign →
                </a>

              </div>


              {/* Right */}
              <div className="grid gap-3">

                <div className="grid grid-cols-2 gap-3">

                  <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-5">

                    <p className="text-3xl font-extrabold text-[#ff8b35]">
                      500+
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-gray-400">
                      Brands growing with creators
                    </p>

                  </div>


                  <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-5">

                    <p className="text-3xl font-extrabold text-[#ff8b35]">
                      1M+
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-gray-400">
                      Campaign opportunities
                    </p>

                  </div>

                </div>


                <div className="rounded-[20px] border border-white/10 bg-[#1a1a1a] p-5">

                  <p className="text-sm font-bold">
                    Built for meaningful collaborations.
                  </p>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">

                    <div className="h-full w-[78%] rounded-full bg-[#ff6b1a]" />

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="border-t border-black/5">

        <div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-4 px-5 py-7 sm:flex-row sm:items-center sm:px-8">

          <div>

            <div className="text-base font-extrabold">
              Scroll<span className="text-[#ff6b1a]">Mart</span>
            </div>

            <p className="mt-1 text-[9px] tracking-widest text-gray-400">
              CONNECT · COLLABORATE · GROW
            </p>

          </div>

          <p className="text-[10px] text-gray-400">
            © 2026 ScrollMart. All rights reserved.
          </p>

        </div>

      </footer>

    </main>
  );
}