"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, Timer } from "lucide-react";

export function DailyLoot() {
    const [claimed, setClaimed] = useState(false);

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
                            onClick={() => setClaimed(true)}
                            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
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
                                <p className="text-sm text-muted-foreground">Come back tomorrow for more!</p>
                            </div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-white/5 text-xs text-muted-foreground">
                                <Timer className="w-3 h-3" />
                                <span>Next drop in 23h 59m</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
