import PageHeader from "../components/ui/PageHeader.jsx";
import DemoNotice from "../components/ui/DemoNotice.jsx";
import iconHeaderRewards from "../assets/figma/icon-header-rewards.png";

/**
 * Progress — eksakto sa Figma frame "Progresss" (80:2):
 * ulo ng pahina at isang malaking placeholder (#d9d9d9 r18 stroke #555),
 * gaya ng nasa Figma. Ang laman nito ay darating pa sa susunod na yugto.
 */
export default function ProgressPage() {
  return (
    <div className="space-y-6 pt-1">
      <PageHeader
        icon={iconHeaderRewards}
        kicker="YOUR COLLECTION"
        title="PROGRESS"
        description="Celebrate the milestones you earn while learning."
      />

      <div
        className="min-h-[273px] rounded-[18px] border border-[#555555] bg-placeholder"
        role="img"
        aria-label="Pag-unlad — wala pa ang laman ng seksyon na ito sa prototype."
      />

      <DemoNotice />
    </div>
  );
}
