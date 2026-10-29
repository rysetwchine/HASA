import Chip from "../ui/Chip.jsx";
import { getReadingLevelLabel } from "../../lib/readingLevels.js";

const TONES = {
  independent: "success",
  instructional: "brand",
  frustration: "warning",
};

/** Ipinapakita ang aprubadong label ng antas ng pagbasa. */
export default function ReadingLevelLabel({ level, className }) {
  return (
    <Chip tone={TONES[level] ?? "neutral"} className={className}>
      {getReadingLevelLabel(level)}
    </Chip>
  );
}
