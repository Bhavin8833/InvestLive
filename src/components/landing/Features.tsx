import { motion } from "framer-motion";
import { Zap, Users, Trophy, ShieldCheck, KeyRound, BarChart3 } from "lucide-react";

const features = [
  { icon: Zap, title: "Real-Time Engine", desc: "Investments update instantly across all devices." },
  { icon: Users, title: "Custom Groups", desc: "Set 10, 20, 50 or any custom number of groups." },
  { icon: Trophy, title: "Live Leaderboards", desc: "Animated rankings that update in real-time." },
  { icon: ShieldCheck, title: "Teacher Override", desc: "Special teacher mode with higher investment power." },
  { icon: KeyRound, title: "No Login Required", desc: "Participants join instantly with a session code." },
  { icon: BarChart3, title: "Join via Code", desc: "Simple 6-character code to join any session." },
];

const Features = () => {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-foreground">
            Everything You <span className="text-gradient">Need</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
            Powerful features built for engaging investment simulations.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-card-hover transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
