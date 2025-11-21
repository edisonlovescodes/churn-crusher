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
            <div className="card-panel p-8 w-full max-w-2xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-primary" />
                            The First 48
                        </h2>
                        <p className="text-muted-foreground mt-1">Complete these steps to unlock full access.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Complete</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-secondary rounded-full mb-8 overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                    />
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
                                "group relative p-4 rounded-xl border transition-all cursor-pointer",
                                step.completed
                                    ? "bg-secondary/50 border-transparent"
                                    : "bg-card border-border hover:border-primary/50 hover:shadow-md"
                            )}
                        >
                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    {step.completed ? (
                                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    ) : (
                                        <Circle className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className={cn(
                                        "font-semibold text-lg transition-colors",
                                        step.completed ? "text-muted-foreground line-through" : "text-foreground group-hover:text-primary"
                                    )}>
                                        {step.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm mt-1">{step.description}</p>
                                </div>
                                {step.type === 'video' && !step.completed && (
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <Play className="w-4 h-4 text-primary fill-current" />
                                    </div>
                                )}
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
                            className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative"
                        >
                            <button
                                onClick={() => setActiveVideo(false)}
                                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="aspect-video bg-slate-900 relative flex items-center justify-center">
                                {videoProgress < 100 ? (
                                    <div className="text-center">
                                        <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
                                        <p className="text-white font-medium">Watching Masterclass...</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                        <p className="text-white text-xl font-bold">Lesson Complete!</p>
                                    </div>
                                )}

                                {/* Progress Bar Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                                    <motion.div
                                        className="h-full bg-primary"
                                        style={{ width: `${videoProgress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="p-6 bg-white">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Welcome Masterclass</h3>
                                <p className="text-slate-600">
                                    Learn the 3 secrets to getting the most out of this community.
                                    Do not close this window until the video finishes.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
