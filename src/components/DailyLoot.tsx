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
        <div className="card-panel p-6 w-full max-w-md text-center h-64 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
    );

    return (
        <div className="card-panel p-8 w-full max-w-md text-center">
            <div className="flex items-center justify-center gap-2 mb-4 text-primary">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Daily Reward</span>
                <Sparkles className="w-4 h-4" />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-6">Daily Loot Drop</h2>

            <AnimatePresence mode="wait">
                {!claimed ? (
                    <motion.button
                        key="claim-btn"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleClaim}
                        className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg"
                    >
                        <Gift className="w-6 h-6" />
                        <span>Open Loot Box</span>
                    </motion.button>
                ) : (
                    <motion.div
                        key="reward"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <div className="text-5xl">💎</div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground">+50 Community Points</h3>
                            <p className="text-muted-foreground text-sm mt-1">Come back tomorrow for more!</p>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs bg-secondary py-2 px-4 rounded-full mx-auto w-fit">
                            <Timer className="w-3 h-3" />
                            <span>Next drop in 24h</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
