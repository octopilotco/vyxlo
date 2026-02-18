import { Star } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const testimonials = [
  {
    text: "I went from posting twice a week to every single day. My follower count doubled in a month. Vyxlo made consistency effortless.",
    name: "Sarah Chen",
    handle: "@sarahbuilds",
    avatar: "https://i.pravatar.cc/48?img=32",
  },
  {
    text: "I thought all these tools were the same until I tried Vyxlo. The AI actually sounds like me — that's what made me stay.",
    name: "Jazz",
    handle: "@jazzonx",
    avatar: "https://i.pravatar.cc/48?img=11",
  },
  {
    text: "The inspiration feed alone saves me an hour every morning. I open Vyxlo, pick an idea, edit it, and post. Done.",
    name: "Timo R.",
    handle: "@t1mo_dev",
    avatar: "https://i.pravatar.cc/48?img=12",
  },
  {
    text: "Went from 2K to 14K in three months. The scheduling + analytics combo helped me figure out what my audience actually wants.",
    name: "Abdullah E.",
    handle: "@abdullahsaas",
    avatar: "https://i.pravatar.cc/48?img=13",
  },
  {
    text: "Your app is literally the first 𝕏 tool I see real value in. I won't regret handing my money over for this.",
    name: "Ariel",
    handle: "@arielonline",
    avatar: "https://i.pravatar.cc/48?img=10",
  },
  {
    text: "Building in public got 10x easier. I never run out of things to say anymore. The content ideas just keep coming.",
    name: "Raj K.",
    handle: "@indieraj",
    avatar: "https://i.pravatar.cc/48?img=14",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="border-t border-border section-padding">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <p className="text-center text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
            Don't take our word for it
          </p>
          <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
            Creators love Vyxlo.
          </h2>
        </ScrollReveal>

        <div className="mt-14 columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3">
          {testimonials.map((t, index) => (
            <ScrollReveal key={t.handle} delay={index * 0.06}>
              <div className="break-inside-avoid rounded-2xl border border-border bg-card/50 p-6 transition-colors hover:border-muted-foreground/20">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-primary/80 text-primary/80" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                  "{t.text}"
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-9 w-9 rounded-full border border-border"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.handle}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
