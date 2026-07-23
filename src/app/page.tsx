import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Stats from "@/components/Stats";
import QuoteForm from "@/components/QuoteForm";
import PaySection from "@/components/PaySection";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const brands = [
  "Kohler",
  "Sherwin-Williams",
  "Bosch",
  "Trex",
  "Lutron",
  "GAF",
  "Tile Shop",
  "Milwaukee",
];

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />

      {/* Trusted-by marquee */}
      <div className="relative border-y border-white/10 bg-white/[0.02] py-6">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-12 pr-12">
            {[...brands, ...brands].map((b, i) => (
              <span key={i} className="text-lg font-semibold tracking-wide text-slate-500">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Services />
      <Process />
      <Stats />
      <QuoteForm />
      <PaySection />
      <Testimonials />
      <Footer />
    </main>
  );
}
