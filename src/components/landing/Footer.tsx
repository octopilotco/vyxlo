import vyxloLogo from "@/assets/vyxlo-logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <a href="/" className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <img src={vyxloLogo} alt="Vyxlo" className="h-5 w-5 rounded" />
            Vyxlo
          </a>

          <div className="flex gap-8">
            {["Features", "Pricing", "Terms", "Privacy"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link}
              </a>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Vyxlo
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
