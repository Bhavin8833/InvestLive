import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import { toast } from "sonner";

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
    const sessionRef = useRef<Session | null>(null);

    // Sync ref
    useEffect(() => {
        sessionRef.current = session;
    }, [session]);

    const loadSession = useCallback(async (code: string) => {
        console.log("Loading session:", code);
        const { data, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('code', code)
            .single();

        if (error) {
            console.error('Error loading session:', error);
            toast.error(`Error loading session: ${error.message}`);
            return null;
        }

        if (data) {
            console.log("Session loaded:", data.data);
            setSession(data.data as Session); // 'data' column contains the JSON payload
            return data.data as Session;
        } else {
            console.warn("No session found for code:", code);
            toast.warning("Session not found. Please check the code.");
        }
        return null;
    }, []);

    const saveSession = useCallback(async (newSession: Session) => {
        // Optimistic update
        setSession(newSession);

        const { error } = await supabase
            .from('sessions')
            .upsert({
                code: newSession.code,
                data: newSession
            }, { onConflict: 'code' });

        if (error) {
            console.error('Error saving session:', error);
            // Revert on error? For now, we rely on next subscription update
            toast.error(`Database Error: ${error.message}`);
        }
    }, []);

    const startSession = useCallback((totalGroups: number) => {
        const newSession = createSession(totalGroups);
        saveSession(newSession);
        toast.success(`Session ${newSession.code} started!`);
        return newSession;
    }, [saveSession]);

    const updateSession = useCallback((updater: (s: Session) => Session) => {
        setSession((prev) => {
            if (!prev) return prev;
            const updated = updater(prev);
            saveSession(updated);
            return updated;
        });
    }, [saveSession]);

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

    // Real-time subscription
    useEffect(() => {
        if (!session?.code) return;

        const channel = supabase
            .channel(`session-${session.code}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'sessions',
                    filter: `code=eq.${session.code}`,
                },
                (payload) => {
                    const newData = (payload.new as any).data as Session;
                    // Only update if data is different and newer (simple check)
                    // For now, simpler: just update
                    if (JSON.stringify(newData) !== JSON.stringify(sessionRef.current)) {
                        setSession(newData);
                    }
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    // toast.success("Connected to live updates");
                }
                if (status === 'CHANNEL_ERROR') {
                    toast.error("Live connection failed. Check internet.");
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [session?.code]); // Re-subscribe if code changes

    return { session, startSession, updateSession, loadSession, addInvestment, resetSession };
}
