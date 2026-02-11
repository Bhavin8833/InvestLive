import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/session";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { Check, Lock, BarChart3 } from "lucide-react";
import AnimatedNumber from "@/components/AnimatedNumber";

const ParticipantView = () => {
  const { code } = useParams<{ code: string }>();
  const [searchParams] = useSearchParams();
  const isTeacher = searchParams.get("role") === "teacher";
  const maxInvestment = isTeacher ? 50 : 10;

  const { session, loadSession, addInvestment } = useSession();
  const [amount, setAmount] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [participantId] = useState(() => crypto.randomUUID());
  const [groupNumber] = useState(() => {
    const stored = sessionStorage.getItem(`investlive_group_${code}`);
    if (stored) return parseInt(stored);
    return null;
  });

  // Student options: 0Cr to 10Cr
  const studentOptions = Array.from({ length: 11 }, (_, i) => i);
  // Teacher options: 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50
  const teacherOptions = Array.from({ length: 11 }, (_, i) => i * 5);




  // Reset submission when presenting group changes
  useEffect(() => {
    setSubmitted(false);
    setAmount(null);
  }, [session?.currentPresentingGroup]);

  const handleSubmit = () => {
    if (!session || amount === null || amount < 0 || amount > maxInvestment || session.currentPresentingGroup === null) return;

    // Can't invest in own group
    if (groupNumber !== null && groupNumber === session.currentPresentingGroup) return;

    addInvestment(session.currentPresentingGroup, amount, isTeacher ? "teacher" : "student", participantId);
    setSubmitted(true);
  };

  // Chart data for current presenting group
  const chartData = useMemo(() => {
    if (!session || session.currentPresentingGroup === null) return [];
    const group = session.groups[session.currentPresentingGroup];
    const distribution: Record<number, number> = {};
    for (let i = 0; i <= maxInvestment; i++) distribution[i] = 0;
    group.investments.forEach((inv) => {
      if (distribution[inv.amount] !== undefined) distribution[inv.amount]++;
    });
    return Object.entries(distribution).map(([val, count]) => ({
      value: parseInt(val),
      count,
    }));
  }, [session, maxInvestment]);

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading session...</p>
          <p className="text-xs text-muted-foreground mt-2">Code: {code}</p>
        </div>
      </div>
    );
  }

  const presenting = session.currentPresentingGroup;

  if (presenting === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary flex items-center justify-center mb-6">
            <BarChart3 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-black text-foreground mb-2">Waiting for Host</h1>
          <p className="text-muted-foreground">The host hasn't selected a presenting group yet.</p>
          {isTeacher && (
            <div className="mt-4 bg-primary/10 text-primary text-sm font-semibold rounded-xl px-4 py-2 inline-block">
              🎓 Teacher Mode Active
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  const currentGroup = session.groups[presenting];
  const options = isTeacher ? teacherOptions : studentOptions;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">InvestLive</span>
          </div>
          <div className="flex items-center gap-3">
            {isTeacher && (
              <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                🎓 TEACHER
              </span>
            )}
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${session.investmentOpen ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
              {session.investmentOpen ? "● OPEN" : "● CLOSED"}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full">
        <motion.div
          key={presenting}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center w-full"
        >
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-2">
            {currentGroup.name}
          </h1>
          <p className="text-lg text-muted-foreground mb-10">is Presenting</p>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {session.investmentOpen ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-4">
                      {isTeacher ? "Select investment (0–50 Cr)" : "Select investment (0–10 Cr)"}
                    </p>
                    <div className={`grid gap-3 mb-6 ${isTeacher ? "grid-cols-4" : "grid-cols-4 sm:grid-cols-6"}`}>
                      {options.map((val) => (
                        <motion.button
                          key={val}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setAmount(val)}
                          className={`h-14 rounded-2xl text-base font-bold transition-all ${amount === val
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-2 ring-primary ring-offset-2 ring-offset-background"
                            : "bg-secondary text-foreground hover:bg-secondary/80"
                            }`}
                        >
                          {val} Cr
                        </motion.button>
                      ))}
                    </div>
                    {isTeacher && (
                      <div className="mb-4">
                        <input
                          type="number"
                          min={0}
                          max={50}
                          value={amount ?? ""}
                          onChange={(e) => setAmount(Math.min(50, Math.max(0, parseInt(e.target.value) || 0)))}
                          className="w-32 mx-auto block text-center text-3xl font-bold bg-secondary rounded-2xl py-3 text-foreground outline-none focus:ring-2 focus:ring-primary"
                          placeholder="0-50"
                        />
                      </div>
                    )}
                    <Button
                      onClick={handleSubmit}
                      disabled={amount === null}
                      size="lg"
                      className="w-full max-w-xs mx-auto rounded-2xl h-14 text-lg font-bold bg-gradient-primary hover:opacity-90 shadow-lg shadow-primary/25"
                    >
                      Invest {amount ?? 0} Cr
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <Lock className="w-10 h-10 text-muted-foreground" />
                    <p className="text-muted-foreground font-medium">Investment window is closed</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Check className="w-10 h-10 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Invested {amount} Cr!</h2>
                <p className="text-muted-foreground">Your investment has been recorded.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Live Chart */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full mt-12 bg-card rounded-2xl p-6 border border-border shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground text-sm">Investment Distribution</h3>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Total</div>
                <div className="text-xl font-black text-primary">
                  <AnimatedNumber value={currentGroup.grandTotal} suffix=" Cr" />
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <XAxis dataKey="value" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis hide />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={`hsl(var(--primary) / ${0.4 + (index / chartData.length) * 0.6})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ParticipantView;
