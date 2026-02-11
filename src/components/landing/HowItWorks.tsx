import { motion } from "framer-motion";
import { Settings, Share2, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Settings,
    title: "Create Session",
    description: "Set up your event with custom groups and investment parameters in seconds.",
  },
  {
    icon: Share2,
    title: "Share Code",
    description: "Participants join instantly with a simple 6-character code. No login required.",
  },
  {
    icon: TrendingUp,
    title: "Invest Live",
    description: "Watch investments flow in real-time with animated charts and live leaderboards.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-foreground">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
            Three simple steps to launch your live investment event.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                <step.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="text-sm font-bold text-primary mb-2">Step {i + 1}</div>
              <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
