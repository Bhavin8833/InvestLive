import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowLeft, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const JoinSession = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (code.trim().length >= 4) {
      navigate(`/session/${code.toUpperCase().trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-3xl p-10 shadow-card border border-border max-w-md w-full text-center"
      >
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center mb-6">
          <LogIn className="w-7 h-7 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-black text-foreground mb-2">Join Session</h1>
        <p className="text-muted-foreground mb-8">Enter the 6-character session code to join.</p>
        <div className="flex gap-3">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter code..."
            maxLength={6}
            className="text-center text-2xl font-mono tracking-[0.3em] rounded-xl h-14 uppercase"
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          />
          <Button onClick={handleJoin} size="lg" className="rounded-xl h-14 px-8 bg-gradient-primary">
            Join
          </Button>
        </div>
        <Link to="/" className="inline-flex items-center gap-1 mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default JoinSession;
