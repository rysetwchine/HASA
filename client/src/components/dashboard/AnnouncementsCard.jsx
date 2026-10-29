import { Bell, CalendarDays } from "lucide-react";
import Card from "../ui/Card.jsx";
import Chip from "../ui/Chip.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import { demoAnnouncements } from "../../features/demo/demoData.js";

/**
 * Walang announcement data sa prototype. Kapag walang laman ang
 * demoAnnouncements, nagpapakita ng malinaw na empty state sa halip
 * na mag-imbento ng anunsyo.
 */
export default function AnnouncementsCard({ announcements = demoAnnouncements }) {
  return (
    <Card className="flex flex-1 flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-600">
            Announcements
          </p>
          <h2 className="font-display mt-1 text-xl font-bold tracking-tight text-ink">
            Mga anunsyo
          </h2>
        </div>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-brand-700"
          aria-hidden="true"
        >
          <Bell className="h-5 w-5" />
        </span>
      </div>

      {announcements.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {announcements.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-cream-200 bg-cream-50 p-3.5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                {item.type ? <Chip tone="brand">{item.type}</Chip> : null}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {item.description}
              </p>
              {item.date ? (
                <p className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-muted">
                  <CalendarDays className="h-3 w-3" aria-hidden="true" />
                  <time dateTime={item.date}>{item.date}</time>
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 flex-1">
          <EmptyState
            icon={Bell}
            title="Wala pang anunsyo"
            description="Lalabas dito ang mga bagong aralin, gawain, hamon, at mensahe ng guro kapag aktibo na ang backend."
          />
          <p className="mt-2 text-center text-[10px] leading-relaxed text-muted">
            Hindi nag-imbento ng anunsyo ang prototype.
          </p>
        </div>
      )}
    </Card>
  );
}
