import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/session";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedNumber from "@/components/AnimatedNumber";
import {
  BarChart3, Users, Play, Pause, RotateCcw, Download,
  Copy, Check, ArrowLeft, Trophy, Settings, X, TrendingUp
} from "lucide-react";

const presetGroups = [10, 20, 50];

const HostDashboard = () => {
  const { session, startSession, updateSession, resetSession } = useSession();
  const [customCount, setCustomCount] = useState("");
  const [copied, setCopied] = useState(false);

  const handleStart = (count: number) => {
    if (count >= 2 && count <= 100) startSession(count);
  };

  const copyCode = () => {
    if (!session) return;
    navigator.clipboard.writeText(session.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectPresenting = (index: number) => {
    updateSession((s) => ({ ...s, currentPresentingGroup: index, investmentOpen: false }));
  };

  const toggleInvestment = () => {
    updateSession((s) => ({ ...s, investmentOpen: !s.investmentOpen }));
  };

  const renameGroup = (index: number, name: string) => {
    updateSession((s) => {
      const groups = [...s.groups];
      groups[index] = { ...groups[index], name };
      return { ...s, groups };
    });
  };

  // Setup screen
  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-3xl p-10 shadow-card border border-border max-w-lg w-full text-center"
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center mb-6">
            <Settings className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-black text-foreground mb-2">Create Session</h1>
          <p className="text-muted-foreground mb-8">Choose the number of groups for your event.</p>

          <div className="flex gap-3 justify-center mb-6">
            {presetGroups.map((n) => (
              <Button key={n} variant="outline" size="lg" className="rounded-xl text-lg font-bold w-20" onClick={() => handleStart(n)}>
                {n}
              </Button>
            ))}
          </div>
          <div className="flex gap-3 items-center justify-center">
            <Input
              type="number"
              placeholder="Custom..."
              min={2}
              max={100}
              value={customCount}
              onChange={(e) => setCustomCount(e.target.value)}
              className="w-32 text-center rounded-xl"
            />
            <Button
              onClick={() => handleStart(parseInt(customCount))}
              disabled={!customCount || parseInt(customCount) < 2}
              className="rounded-xl"
            >
              Start
            </Button>
          </div>
          <Link to="/" className="inline-flex items-center gap-1 mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  const presenting = session.currentPresentingGroup;
  const currentGroup = presenting !== null ? session.groups[presenting] : null;
  const showFullScreen = presenting !== null && session.investmentOpen;

  return (
    <div className="min-h-screen bg-background">
      {/* Full-Screen Presenting Overlay */}
      <AnimatePresence>
        {showFullScreen && currentGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background flex flex-col"
          >
            {/* Overlay Header */}
            <div className="flex items-center justify-between px-8 py-4 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">InvestLive</span>
                <span className="ml-2 text-xs font-bold bg-accent/10 text-accent px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" /> LIVE
                </span>
              </div>
              <Button variant="ghost" size="sm" className="rounded-xl" onClick={toggleInvestment}>
                <X className="w-5 h-5 mr-1" /> Close Investing
              </Button>
            </div>

            {/* Full Screen Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="text-center"
              >
                <p className="text-muted-foreground text-lg mb-2 uppercase tracking-widest font-medium">Now Presenting</p>
                <h1 className="text-7xl md:text-9xl font-black text-foreground mb-8">
                  {currentGroup.name}
                </h1>
              </motion.div>

              {/* Animated Stats */}
              <div className="grid grid-cols-3 gap-8 md:gap-16 mt-4">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Student Investment</p>
                  <div className="text-5xl md:text-7xl font-black text-primary">
                    <AnimatedNumber value={currentGroup.totalStudentInvestment} suffix=" Cr" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="text-center"
                >
                  <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Teacher Investment</p>
                  <div className="text-5xl md:text-7xl font-black text-accent">
                    <AnimatedNumber value={currentGroup.teacherInvestment} suffix=" Cr" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Grand Total</p>
                  <div className="text-5xl md:text-7xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    <AnimatedNumber value={currentGroup.grandTotal} suffix=" Cr" />
                  </div>
                </motion.div>
              </div>

              {/* Investments Count */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-12 flex items-center gap-2 text-muted-foreground"
              >
                <TrendingUp className="w-5 h-5" />
                <span className="text-lg">{currentGroup.investments.length} investments received</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">InvestLive</span>
            </Link>
            <span className="text-muted-foreground">|</span>
            <span className="text-sm text-muted-foreground">Host Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-secondary rounded-xl px-4 py-2">
              <span className="text-sm text-muted-foreground">Code:</span>
              <span className="font-mono font-bold text-foreground tracking-widest">{session.code}</span>
              <button onClick={copyCode} className="text-muted-foreground hover:text-foreground transition-colors">
                {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <Link to={`/session/${session.code}/leaderboard`}>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Trophy className="w-4 h-4 mr-1" /> Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            onClick={toggleInvestment}
            disabled={presenting === null}
            className={`rounded-xl ${session.investmentOpen ? "bg-destructive hover:bg-destructive/90" : "bg-gradient-primary hover:opacity-90"}`}
          >
            {session.investmentOpen ? <><Pause className="w-4 h-4 mr-1" /> Close Investing</> : <><Play className="w-4 h-4 mr-1" /> Open Investing</>}
          </Button>
          <Button variant="outline" className="rounded-xl" onClick={resetSession}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
          <Button variant="outline" className="rounded-xl">
            <Download className="w-4 h-4 mr-1" /> Export
          </Button>
          {presenting !== null && (
            <div className="flex items-center gap-2 bg-primary/10 rounded-xl px-4 py-2 ml-auto">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                {session.groups[presenting].name} is presenting
              </span>
              {session.investmentOpen && (
                <span className="ml-2 w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
              )}
            </div>
          )}
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence>
            {session.groups.map((group, i) => {
              const isPresenting = presenting === i;
              return (
                <motion.div
                  key={group.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className={`rounded-2xl p-4 border transition-all cursor-pointer ${isPresenting
                    ? "bg-primary/5 border-primary shadow-lg shadow-primary/10"
                    : "bg-card border-border shadow-card hover:shadow-card-hover"
                    }`}
                  onClick={() => selectPresenting(i)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <input
                      className="font-bold text-foreground bg-transparent border-none outline-none w-full text-sm"
                      value={group.name}
                      onChange={(e) => renameGroup(i, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {isPresenting && (
                      <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Students</span>
                      <span className="font-semibold text-foreground">
                        <AnimatedNumber value={group.totalStudentInvestment} suffix=" Cr" />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Teacher</span>
                      <span className="font-semibold text-foreground">
                        <AnimatedNumber value={group.teacherInvestment} suffix=" Cr" />
                      </span>
                    </div>
                    <div className="border-t border-border pt-1 flex justify-between font-semibold text-foreground">
                      <span>Total</span>
                      <AnimatedNumber value={group.grandTotal} suffix=" Cr" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Share links */}
        <div className="mt-10 bg-card rounded-2xl p-6 border border-border shadow-card">
          <h3 className="font-bold text-foreground mb-4">Share Links</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground w-24">Participant:</span>
              <code className="bg-secondary rounded-lg px-3 py-1.5 text-foreground font-mono text-xs select-all">
                {`${window.location.origin}${window.location.pathname}#/session/${session.code}`}
              </code>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground w-24">Teacher:</span>
              <code className="bg-secondary rounded-lg px-3 py-1.5 text-foreground font-mono text-xs select-all">
                {`${window.location.origin}${window.location.pathname}#/session/${session.code}?role=teacher`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;
