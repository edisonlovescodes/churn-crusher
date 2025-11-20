import { DailyLoot } from "@/components/DailyLoot";
import { OnboardingQuest } from "@/components/OnboardingQuest";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8 flex flex-col items-center justify-center gap-8 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
          Welcome to <span className="text-gradient">The Hub</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          Your central command for community success. Complete quests, earn rewards, and stay connected.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl items-start">
        <div className="flex justify-center">
          <OnboardingQuest />
        </div>
        <div className="flex justify-center">
          <DailyLoot />
        </div>
      </div>
    </main>
  );
}
