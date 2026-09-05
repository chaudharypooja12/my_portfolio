import { Mail, Globe, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-border">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 md:flex-row md:justify-between md:px-8">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Pooja. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="mailto:poojachaudhary0912@gmail.com"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_15px_oklch(0.7_0.22_280/15%)]"
            aria-label="Email"
          >
            <Mail className="h-4 w-4" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_15px_oklch(0.7_0.22_280/15%)]"
            aria-label="GitHub"
          >
            <Globe className="h-4 w-4" />
          </a>
          <a
            href="https://linkedin.com/in/pooja-chaudhary-001527230"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_15px_oklch(0.7_0.22_280/15%)]"
            aria-label="LinkedIn"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
