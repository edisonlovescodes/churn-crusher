"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, Timer } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function DailyLoot() {
    const { userId } = useCurrentUser();
    const [claimed, setClaimed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        async function checkDailyLoot() {
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

            // Check if we have a claim for today
            const { data, error } = await supabase
                .from('daily_loot')
                .select('claimed_at')
                .eq('user_id', userId)
                .gte('claimed_at', `${today}T00:00:00.000Z`)
                .lt('claimed_at', `${today}T23:59:59.999Z`);

            if (error) {
                console.error('Error checking loot:', error);
            } else if (data && data.length > 0) {
                setClaimed(true);
            }
            setLoading(false);
        }

        checkDailyLoot();
    }, [userId]);

    const handleClaim = async () => {
        if (!userId) return;

        setClaimed(true);

        const { error } = await supabase
            .from('daily_loot')
            .insert({
                user_id: userId,
                claimed_at: new Date().toISOString(),
                reward_type: 'points',
                reward_value: 50
            });

        if (error) {
            console.error('Error claiming loot:', error);
            // Optionally revert state if error
            setClaimed(false);
        }
    };

    if (loading) return (
        <div className="glass-panel rounded-2xl p-6 w-full max-w-md text-center relative overflow-hidden h-64 flex items-center justify-center">
            <div className="animate-pulse text-white/50">Loading Loot...</div>
        </div>
    );

    return (
        <div className="glass-panel rounded-2xl p-6 w-full max-w-md text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2 text-yellow-400">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Daily Reward</span>
                    <Sparkles className="w-4 h-4" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-6">Daily Loot Drop</h2>

                <AnimatePresence mode="wait">
                    {!claimed ? (
                        <motion.button
                            key="claim-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleClaim}
                            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all cursor-pointer"
                        >
                            <Gift className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            <span>Open Loot Box</span>
                        </motion.button>
                    ) : (
                        <motion.div
                            key="reward"
                            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            className="space-y-4"
                        >
                            <div className="text-5xl">💎</div>
                            <div>
                                <h3 className="text-xl font-bold text-white">+50 Community Points</h3>
                                <p className="text-white/60 text-sm">Come back tomorrow for more!</p>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-white/40 text-xs bg-white/5 py-2 px-4 rounded-full mx-auto w-fit">
                                <Timer className="w-3 h-3" />
                                <span>Next drop in 24h</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
