"use client";

import React from "react";
import Header from "./components/header";
import Hero from "./components/hero";
import AboutBide from "./components/about_bide";

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="sticky top-0 z-30">
        <Header />
      </div>
      <section id="home" className="relative z-10">
        <Hero />
      </section>
      <section id="about" className="relative z-20">
        <AboutBide />
      </section>
    </div>
  );
};

export default Page;