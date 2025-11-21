"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, AlertTriangle, Mail, MoreHorizontal, ArrowUp, ArrowDown, Minus, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Member {
    id: string;
    name: string;
    status: "active" | "at-risk" | "inactive";
    lastActive: string;
    riskScore: number;
    usageTrend: "up" | "down" | "stable";
    nextMilestone: string;
}

const MOCK_MEMBERS: Member[] = [
    { id: "1", name: "Alex Johnson", status: "active", lastActive: "2h ago", riskScore: 12, usageTrend: "up", nextMilestone: "30 Day Streak" },
    { id: "2", name: "Sarah Smith", status: "at-risk", lastActive: "5d ago", riskScore: 78, usageTrend: "down", nextMilestone: "Birthday (Nov 24)" },
    { id: "3", name: "Mike Brown", status: "active", lastActive: "1d ago", riskScore: 5, usageTrend: "stable", nextMilestone: "100 Points" },
    { id: "4", name: "Emily Davis", status: "inactive", lastActive: "12d ago", riskScore: 95, usageTrend: "down", nextMilestone: "Re-engagement" },
];

export function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Active Members", value: "1,248", change: "+12%", icon: Users, color: "text-blue-600" },
                    { label: "Retention Rate", value: "94.2%", change: "+2.1%", icon: TrendingUp, color: "text-green-600" },
                    { label: "At-Risk Members", value: "24", change: "-5", icon: AlertTriangle, color: "text-amber-600" },
                    { label: "Upcoming Milestones", value: "8", change: "This Week", icon: Calendar, color: "text-purple-600" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-panel p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-2 rounded-lg bg-secondary", stat.color)}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className={cn("text-sm font-medium", stat.change.startsWith("+") ? "text-green-600" : "text-muted-foreground")}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Churn Radar Table */}
            <div className="card-panel p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Churn Radar</h2>
                        <p className="text-muted-foreground">Members requiring attention.</p>
                    </div>
                    <button className="btn-secondary text-sm">
                        Export Report
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Member</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Trend</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Next Milestone</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Risk Score</th>
                                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_MEMBERS.map((member) => (
                                <tr key={member.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="font-medium text-foreground">{member.name}</div>
                                        <div className="text-xs text-muted-foreground">Active {member.lastActive}</div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={cn(
                                            "px-2 py-1 rounded-full text-xs font-medium",
                                            member.status === "active" && "bg-green-100 text-green-700",
                                            member.status === "at-risk" && "bg-amber-100 text-amber-700",
                                            member.status === "inactive" && "bg-red-100 text-red-700",
                                        )}>
                                            {member.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            {member.usageTrend === 'up' && <ArrowUp className="w-4 h-4 text-green-500" />}
                                            {member.usageTrend === 'down' && <ArrowDown className="w-4 h-4 text-red-500" />}
                                            {member.usageTrend === 'stable' && <Minus className="w-4 h-4 text-muted-foreground" />}
                                            <span className="text-sm text-muted-foreground capitalize">{member.usageTrend}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-foreground">
                                        {member.nextMilestone}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-secondary rounded-full w-24 overflow-hidden">
                                                <div
                                                    className={cn("h-full rounded-full",
                                                        member.riskScore > 70 ? "bg-red-500" : member.riskScore > 40 ? "bg-amber-500" : "bg-green-500"
                                                    )}
                                                    style={{ width: `${member.riskScore}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-muted-foreground">{member.riskScore}%</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
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
