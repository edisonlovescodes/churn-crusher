import { DailyLoot } from "@/components/DailyLoot";
import { OnboardingQuest } from "@/components/OnboardingQuest";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
            Welcome to the Community
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your journey to success starts here. Complete your quest and claim your daily rewards.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex justify-center">
            <OnboardingQuest />
          </div>
          <div className="flex flex-col items-center gap-8">
            <DailyLoot />

            {/* Additional Widget Placeholder */}
            <div className="card-panel p-6 w-full max-w-md">
              <h3 className="font-bold text-foreground mb-2">Community Updates</h3>
              <p className="text-muted-foreground text-sm">
                Join the live Q&A session this Friday at 3 PM EST.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
