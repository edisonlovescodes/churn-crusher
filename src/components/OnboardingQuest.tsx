"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Trophy, Play, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface QuestStep {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    type: "link" | "video" | "action";
    actionUrl?: string;
}

export function OnboardingQuest() {
    const { userId } = useCurrentUser();
    const [steps, setSteps] = useState<QuestStep[]>([
        {
            id: "1",
            title: "Join the Inner Circle",
            description: "Connect with other members in our private Discord.",
            completed: false,
            type: "link",
        },
        {
            id: "2",
            title: "Community Connector",
            description: "Reply to 3 members to make your first friends.",
            completed: false,
            type: "action",
            actionUrl: "#",
        },
        {
            id: "3",
            title: "Watch the Welcome Masterclass",
            description: "The 5-minute guide to getting maximum value.",
            completed: false,
            type: "video",
        },
    ]);

    const [activeVideo, setActiveVideo] = useState<boolean>(false);
    const [videoProgress, setVideoProgress] = useState(0);

    // Fetch progress from Supabase
    useEffect(() => {
        if (!userId) return;

        async function fetchProgress() {
            const { data, error } = await supabase
                .from('quest_progress')
                .select('step_id')
                .eq('user_id', userId)
                .eq('quest_id', 'onboarding');

            if (error) {
                console.error('Error fetching progress:', error);
                return;
            }

            if (data) {
                const completedStepIds = new Set(data.map(p => p.step_id));
                setSteps(prev => prev.map(step => ({
                    ...step,
                    completed: completedStepIds.has(step.id)
                })));
            }
        }

        fetchProgress();
    }, [userId]);

    const saveProgress = async (stepId: string) => {
        if (!userId) return;

        const { error } = await supabase
            .from('quest_progress')
            .insert({
                user_id: userId,
                quest_id: 'onboarding',
                step_id: stepId,
                completed_at: new Date().toISOString()
            });

        if (error) console.error('Error saving progress:', error);
    };

    const progress = (steps.filter((s) => s.completed).length / steps.length) * 100;

    const handleStepClick = async (step: QuestStep) => {
        if (step.completed) return;

        if (step.type === "video") {
            setActiveVideo(true);
            setVideoProgress(0);
        } else {
            // For non-video steps, mark as complete immediately (Honor System)
            await completeStep(step.id);
        }
    };

    const completeStep = async (id: string) => {
        setSteps(steps.map((s) => (s.id === id ? { ...s, completed: true } : s)));
        await saveProgress(id);
    };

    // Simulate Video Playback
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (activeVideo && videoProgress < 100) {
            interval = setInterval(() => {
                setVideoProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 2; // 50 ticks * 100ms = 5 seconds duration
                });
            }, 100);
        } else if (videoProgress >= 100) {
            // Video finished
            setTimeout(() => {
                setActiveVideo(false);
                completeStep("3");
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [activeVideo, videoProgress, steps]); // Added steps dependency to ensure completeStep has latest state if needed, though completeStep uses ID.


    return (
        <>
            <div className="glass-panel rounded-2xl p-6 w-full max-w-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-secondary">
                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}% ` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                </div>

                <div className="flex items-center justify-between mb-6 mt-2">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-400" />
                            The First 48
                        </h2>
                        <p className="text-sm text-muted-foreground">Complete your initiation quest.</p>
                    </div>
                    <div className="text-2xl font-bold text-gradient">
                        {Math.round(progress)}%
                    </div>
                </div>

                <div className="space-y-4">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => handleStepClick(step)}
                            className={cn(
                                "group flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer",
                                step.completed
                                    ? "bg-primary/10 border-primary/20"
                                    : "bg-secondary/30 border-white/5 hover:bg-secondary/50 hover:border-white/10"
                            )}
                        >
                            <div className="mt-1">
                                {step.completed ? (
                                    <CheckCircle2 className="w-6 h-6 text-primary" />
                                ) : step.type === "video" ? (
                                    <div className="w-6 h-6 rounded-full border-2 border-muted-foreground flex items-center justify-center group-hover:border-primary transition-colors">
                                        <Play className="w-3 h-3 text-muted-foreground group-hover:text-primary fill-current" />
                                    </div>
                                ) : (
                                    <Circle className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                )}
                            </div>
                            <div>
                                <h3 className={cn(
                                    "font-medium transition-colors",
                                    step.completed ? "text-primary" : "text-white"
                                )}>
                                    {step.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {progress === 100 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30 text-center"
                    >
                        <p className="text-indigo-300 font-medium">🎉 Quest Completed! You've earned the "Initiate" Badge.</p>
                    </motion.div>
                )}
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {activeVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-card border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <h3 className="font-bold text-white">Welcome Masterclass</h3>
                                <button onClick={() => setActiveVideo(false)} className="text-muted-foreground hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="aspect-video bg-black relative flex items-center justify-center group">
                                {/* Simulated Video Content */}
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    </div>
                                    <p className="text-white/80 font-medium">Playing Masterclass...</p>
                                    <p className="text-white/50 text-sm mt-2">Do not close this window</p>
                                </div>

                                {/* Progress Bar */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                                    <motion.div
                                        className="h-full bg-primary"
                                        style={{ width: `${videoProgress}% ` }}
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-secondary/50 flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    {videoProgress < 100 ? "Watching..." : "Completed!"}
                                </span>
                                <span className="font-mono text-white">{videoProgress}%</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
