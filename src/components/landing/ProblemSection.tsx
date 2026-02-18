import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const painPoints = [
  {
    emoji: "😶",
    title: "Staring at a blank screen",
    description: "You open 𝕏 to post, but nothing comes out. Twenty minutes later, you close the app without publishing.",
  },
  {
    emoji: "🎯",
    title: "Posting into the void",
    description: "You finally hit send, but the engagement is flat. Two likes from friends. It feels pointless.",
  },
  {
    emoji: "⏰",
    title: "Inconsistency kills growth",
    description: "You post for a week, disappear for two. The algorithm forgets you. Your audience forgets you.",
  },
];

const ProblemSection = () => {
  return (
    <section className="border-t border-border section-padding">
      <div className="mx-auto max-w-4xl px-6">
        <ScrollReveal>
          <p className="text-center text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
            Sound familiar?
          </p>
          <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
            Growing on 𝕏 is hard.
            <br />
            <span className="text-muted-foreground">We get it.</span>
          </h2>
        </ScrollReveal>

        <div className="mt-16 space-y-6">
          {painPoints.map((point, index) => (
            <ScrollReveal key={point.title} delay={index * 0.1}>
              <div className="group flex gap-5 rounded-2xl border border-border bg-card/50 p-6 transition-colors hover:border-muted-foreground/20">
                <span className="mt-0.5 text-2xl">{point.emoji}</span>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{point.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {point.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <p className="mt-12 text-center text-lg text-muted-foreground">
            You don't need more hustle.{" "}
            <span className="font-medium text-foreground">You need a better system.</span>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ProblemSection;
