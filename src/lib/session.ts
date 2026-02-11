import { useState, useCallback, useEffect, useRef } from "react";

export interface Group {
    id: string;
    name: string;
    totalStudentInvestment: number;
    teacherInvestment: number;
    grandTotal: number;
    investments: Investment[];
}

export interface Investment {
    participantId: string;
    amount: number;
    role: "student" | "teacher";
    timestamp: number;
}

export interface Session {
    id: string;
    code: string;
    totalGroups: number;
    currentPresentingGroup: number | null;
    investmentOpen: boolean;
    groups: Group[];
}

function generateCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

function generateGroups(count: number): Group[] {
    return Array.from({ length: count }, (_, i) => ({
        id: `g${i + 1}`,
        name: `G${i + 1}`,
        totalStudentInvestment: 0,
        teacherInvestment: 0,
        grandTotal: 0,
        investments: [],
    }));
}

export function createSession(totalGroups: number): Session {
    return {
        id: crypto.randomUUID(),
        code: generateCode(),
        totalGroups,
        currentPresentingGroup: null,
        investmentOpen: false,
        groups: generateGroups(totalGroups),
    };
}

export function useSession() {
    const [session, setSession] = useState<Session | null>(null);
    const lastStrRef = useRef<string | null>(null);

    const loadFromStorage = useCallback(() => {
        const stored = localStorage.getItem("investlive_session");
        if (stored) {
            if (stored !== lastStrRef.current) {
                try {
                    const parsed = JSON.parse(stored);
                    setSession(parsed);
                    lastStrRef.current = stored;
                } catch (e) {
                    console.error("Failed to parse session", e);
                }
            }
        } else {
            if (lastStrRef.current !== null) {
                setSession(null);
                lastStrRef.current = null;
            }
        }
    }, []);

    useEffect(() => {
        loadFromStorage();

        const channel = new BroadcastChannel("invest_live_updates");
        channel.onmessage = (event) => {
            if (event.data === "update") {
                loadFromStorage();
            }
        };

        const handleStorage = (e: StorageEvent) => {
            if (e.key === "investlive_session" || e.key === null) {
                loadFromStorage();
            }
        };
        window.addEventListener("storage", handleStorage);

        const interval = setInterval(loadFromStorage, 1000);

        return () => {
            channel.close();
            window.removeEventListener("storage", handleStorage);
            clearInterval(interval);
        };
    }, [loadFromStorage]);

    const saveSession = useCallback((newSession: Session) => {
        const str = JSON.stringify(newSession);
        localStorage.setItem("investlive_session", str);
        lastStrRef.current = str;
        setSession(newSession);

        const channel = new BroadcastChannel("invest_live_updates");
        channel.postMessage("update");
        channel.close();
    }, []);

    const startSession = useCallback((totalGroups: number) => {
        const newSession = createSession(totalGroups);
        saveSession(newSession);
        return newSession;
    }, [saveSession]);

    const updateSession = useCallback((updater: (s: Session) => Session) => {
        setSession((prev) => {
            if (!prev) return prev;
            const updated = updater(prev);
            const str = JSON.stringify(updated);
            localStorage.setItem("investlive_session", str);
            lastStrRef.current = str;

            const channel = new BroadcastChannel("invest_live_updates");
            channel.postMessage("update");
            channel.close();

            return updated;
        });
    }, []);

    const loadSession = useCallback((code: string): Session | null => {
        const stored = localStorage.getItem("investlive_session");
        if (stored) {
            if (stored !== lastStrRef.current) {
                try {
                    const s = JSON.parse(stored) as Session;
                    if (s.code === code) {
                        setSession(s);
                        lastStrRef.current = stored;
                        return s;
                    }
                } catch (e) { console.error(e); }
            } else {
                if (session && session.code === code) return session;
                if (!session) {
                    const s = JSON.parse(stored) as Session;
                    if (s.code === code) {
                        setSession(s);
                        return s;
                    }
                }
            }
        }
        return null;
    }, [session]);

    const addInvestment = useCallback(
        (groupIndex: number, amount: number, role: "student" | "teacher", participantId: string) => {
            updateSession((s) => {
                const groups = [...s.groups];
                const group = { ...groups[groupIndex] };
                const inv: Investment = { participantId, amount, role, timestamp: Date.now() };
                group.investments = [...group.investments, inv];
                if (role === "teacher") {
                    group.teacherInvestment += amount;
                } else {
                    group.totalStudentInvestment += amount;
                }
                group.grandTotal = group.totalStudentInvestment + group.teacherInvestment;
                groups[groupIndex] = group;
                return { ...s, groups };
            });
        },
        [updateSession]
    );

    const resetSession = useCallback(() => {
        updateSession((s) => ({
            ...s,
            currentPresentingGroup: null,
            investmentOpen: false,
            groups: s.groups.map((g) => ({
                ...g,
                totalStudentInvestment: 0,
                teacherInvestment: 0,
                grandTotal: 0,
                investments: [],
            })),
        }));
    }, [updateSession]);

    return { session, startSession, updateSession, loadSession, addInvestment, resetSession };
}
