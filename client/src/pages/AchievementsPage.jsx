import PageHeader from "../components/ui/PageHeader.jsx";
import DemoNotice from "../components/ui/DemoNotice.jsx";
import iconHeaderRewards from "../assets/figma/icon-header-rewards.png";

/**
 * Rewards — eksakto sa Figma frame "rewards" (74:628):
 * ulo ng pahina at isang malaking placeholder (#d9d9d9 r18 stroke #555)
 * na siya ring anyo sa Figma. Ang laman nito ay darating pa sa susunod
 * na yugto ng proyekto.
 */
export default function AchievementsPage() {
  return (
    <div className="space-y-6 pt-1">
      <PageHeader
        icon={iconHeaderRewards}
        kicker="YOUR COLLECTION"
        title="REWARDS"
        description="Celebrate the milestones you earn while learning."
      />

      <div
        className="min-h-[273px] rounded-[18px] border border-[#555555] bg-placeholder"
        role="img"
        aria-label="Mga gantimpala — wala pa ang laman ng seksyon na ito sa prototype."
      />

      <DemoNotice />
    </div>
  );
}
