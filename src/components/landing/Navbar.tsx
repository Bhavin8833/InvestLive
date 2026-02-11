import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">InvestLive</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/join">
            <Button variant="ghost" size="sm">Join Session</Button>
          </Link>
          <Link to="/host-dashboard">
            <Button size="sm">Start a Live Session</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
