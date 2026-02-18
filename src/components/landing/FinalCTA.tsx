import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";

const FinalCTA = () => {
  return (
    <section className="border-t border-border section-padding">
      <ScrollReveal className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
          Ready to show up
          <br />
          <span className="text-gradient">every single day?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
          Join 1,400+ creators who stopped overthinking and started growing. 
          Free to start — no credit card needed.
        </p>
        <Button
          asChild
          className="mt-10 rounded-full bg-foreground px-10 py-6 text-base font-semibold text-background transition-all duration-200 hover:bg-foreground/90 hover:shadow-xl hover:shadow-foreground/5"
        >
          <Link to="/auth">
            Start for free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">
          Takes 30 seconds · No credit card required
        </p>
      </ScrollReveal>
    </section>
  );
};

export default FinalCTA;
