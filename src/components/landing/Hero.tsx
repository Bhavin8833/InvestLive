import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import heroDashboard from "@/assets/hero-dashboard.png";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.05]">
              Host Live Startup{" "}
              <span className="text-gradient">Investment</span>{" "}
              Events.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
              Engage your audience. Simulate real funding. Make every pitch count.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/host-dashboard">
                <Button size="lg" className="text-base px-8 h-13 rounded-xl bg-gradient-primary hover:opacity-90 shadow-lg shadow-primary/25">
                  Start a Live Session
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="text-base px-8 h-13 rounded-xl">
                  <Play className="w-4 h-4 mr-1" />
                  See How It Works
                </Button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border">
              <img
                src={heroDashboard}
                alt="InvestLive dashboard showing real-time investment simulation"
                className="w-full h-auto"
              />
            </div>
            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-card rounded-xl p-4 shadow-card border border-border"
            >
              <div className="text-xs text-muted-foreground font-medium">Live Investments</div>
              <div className="text-2xl font-black text-foreground">2,847</div>
              <div className="text-xs text-accent font-semibold">↑ Real-time</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -top-4 -right-4 bg-card rounded-xl p-4 shadow-card border border-border"
            >
              <div className="text-xs text-muted-foreground font-medium">Groups Active</div>
              <div className="text-2xl font-black text-primary">24</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
