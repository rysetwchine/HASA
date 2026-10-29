import { useRef } from "react";
import { cx } from "../../utils/cx.js";

import roleStudent from "../../assets/images/auth/role-student.png";
import roleTeacher from "../../assets/images/auth/role-teacher.png";

const ROLES = [
  { id: "student", label: "Mag-aaral", icon: roleStudent },
  { id: "teacher", label: "Guro", icon: roleTeacher },
];

/**
 * Pinagsasaluhang role tabs ng login at register.
 *
 * Dating dalawang beses itong nakasulat nang magkapareho sa LoginPage at
 * RegisterPage, at walang arrow-key na paglilipat. Sinusunod na nito ang
 * WAI-ARIA tabs pattern: Left/Right/Home/End ang nagpapalit ng role.
 */
export default function RoleTabs({ value, onChange, idPrefix = "auth" }) {
  const buttons = useRef({});

  function handleKeyDown(event) {
    const currentIndex = ROLES.findIndex((role) => role.id === value);
    let nextIndex = null;

    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % ROLES.length;
    else if (event.key === "ArrowLeft")
      nextIndex = (currentIndex - 1 + ROLES.length) % ROLES.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = ROLES.length - 1;

    if (nextIndex === null) return;

    event.preventDefault();
    const nextRole = ROLES[nextIndex].id;
    onChange(nextRole);
    buttons.current[nextRole]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Uri ng account"
      className="mt-6 grid grid-cols-2 gap-3 sm:gap-5"
      onKeyDown={handleKeyDown}
    >
      {ROLES.map(({ id, label, icon }) => {
        const selected = value === id;

        return (
          <button
            key={id}
            ref={(node) => {
              buttons.current[id] = node;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(id)}
            className={cx(
              "flex min-h-[48px] items-center justify-center gap-3 rounded-[11px] border-2 text-[17px] font-medium transition-colors sm:text-[18px]",
              selected
                ? "border-plum-800 bg-canvas text-accent-deep shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
                : "border-transparent text-ink/70 hover:text-ink",
            )}
          >
            <img src={icon} alt="" className="h-8 w-8" aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
