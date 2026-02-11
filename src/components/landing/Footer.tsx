import { BarChart3 } from "lucide-react";

const Footer = () => (
  <footer className="py-12 bg-foreground">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-background">InvestLive</span>
        </div>
        <p className="text-sm text-background/60">
          © 2026 InvestLive. Built for live startup investment events.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
