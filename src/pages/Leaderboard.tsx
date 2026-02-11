import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSession } from "@/lib/session";
import { motion } from "framer-motion";
import { Trophy, ArrowLeft, BarChart3, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";

const medalColors = ["text-yellow-500", "text-gray-400", "text-amber-700"];

const Leaderboard = () => {
  const { code } = useParams<{ code: string }>();
  const { session, loadSession } = useSession();

  useEffect(() => {
    if (code) loadSession(code);
  }, [code, loadSession]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (code) loadSession(code);
    }, 2000);
    return () => clearInterval(interval);
  }, [code, loadSession]);

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading leaderboard...</p>
      </div>
    );
  }

  const sorted = [...session.groups].sort((a, b) => b.grandTotal - a.grandTotal);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">InvestLive</span>
            </Link>
          </div>
          <Link to="/host-dashboard">
            <Button variant="outline" size="sm" className="rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Trophy className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-black text-foreground">Leaderboard</h1>
          <p className="text-muted-foreground mt-2">Final investment rankings</p>
        </motion.div>

        <div className="space-y-3">
          {sorted.map((group, i) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-4 bg-card rounded-2xl p-5 border shadow-card ${
                i < 3 ? "border-primary/20" : "border-border"
              }`}
            >
              <div className="w-10 text-center">
                {i < 3 ? (
                  <Medal className={`w-6 h-6 mx-auto ${medalColors[i]}`} />
                ) : (
                  <span className="text-lg font-bold text-muted-foreground">{i + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold text-foreground">{group.name}</div>
                <div className="text-xs text-muted-foreground">
                  Students: {group.totalStudentInvestment} · Teacher: {group.teacherInvestment}
                </div>
              </div>
              <div className="text-right">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 + 0.3, type: "spring" }}
                  className="text-2xl font-black text-primary"
                >
                  {group.grandTotal}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
