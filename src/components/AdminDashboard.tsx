"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Mail, MoreHorizontal, RefreshCw, Search, UserX, Gift, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Member {
    id: string;
    name: string;
    email: string;
    lastActive: string;
    riskScore: number; // 0-100, higher is worse
    usageTrend: "up" | "down" | "stable";
    status: "Active" | "At Risk" | "Churned";
    avatarUrl: string;
    nextMilestone?: string; // e.g., "30 Day Anniversary", "Birthday"
}

export function AdminDashboard() {
    const [members, setMembers] = useState<Member[]>([
        {
            id: "1",
            name: "Alex Rivera",
            email: "alex@example.com",
            lastActive: "8 days ago",
            riskScore: 85,
            usageTrend: "down",
            status: "At Risk",
            avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
            nextMilestone: "30 Day Anniversary (2 days)",
        },
        {
            id: "2",
            name: "Sarah Chen",
            email: "sarah@example.com",
            lastActive: "12 days ago",
            riskScore: 92,
            usageTrend: "down",
            status: "At Risk",
            avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        },
        {
            id: "3",
            name: "Mike Johnson",
            email: "mike@example.com",
            lastActive: "2 days ago",
            riskScore: 15,
            usageTrend: "up",
            status: "Active",
            avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
            nextMilestone: "Birthday (Tomorrow)",
        },
    ]);

    const atRiskCount = members.filter(m => m.status === "At Risk").length;

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 rounded-xl">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">At Risk Members</p>
                            <h3 className="text-2xl font-bold text-white">{atRiskCount}</h3>
                        </div>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-xl">
                            <RefreshCw className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Retention Rate</p>
                            <h3 className="text-2xl font-bold text-white">94.2%</h3>
                        </div>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl">
                            <Gift className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Upcoming Milestones</p>
                            <h3 className="text-2xl font-bold text-white">5</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Churn Radar & Opportunities</h2>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search members..."
                            className="bg-secondary/50 border border-white/5 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-muted-foreground text-sm">
                                <th className="p-4 font-medium">Member</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Usage Trend</th>
                                <th className="p-4 font-medium">Next Milestone</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {members.map((member) => (
                                <tr key={member.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full bg-secondary" />
                                            <div>
                                                <p className="font-medium text-white">{member.name}</p>
                                                <p className="text-xs text-muted-foreground">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={cn(
                                            "px-2 py-1 rounded-full text-xs font-medium border",
                                            member.status === "At Risk"
                                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                                : "bg-green-500/10 text-green-400 border-green-500/20"
                                        )}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            {member.usageTrend === "down" && <TrendingDown className="w-4 h-4 text-red-400" />}
                                            {member.usageTrend === "up" && <TrendingUp className="w-4 h-4 text-green-400" />}
                                            {member.usageTrend === "stable" && <Minus className="w-4 h-4 text-muted-foreground" />}
                                            <span className="text-muted-foreground capitalize">{member.usageTrend}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {member.nextMilestone ? (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-500/10 text-purple-300 text-xs border border-purple-500/20">
                                                <Gift className="w-3 h-3" />
                                                {member.nextMilestone}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {member.status === "At Risk" && (
                                                <button className="p-2 hover:bg-primary/20 text-primary rounded-lg transition-colors" title="Send Re-engagement Email">
                                                    <Mail className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button className="p-2 hover:bg-white/10 text-muted-foreground rounded-lg transition-colors">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
