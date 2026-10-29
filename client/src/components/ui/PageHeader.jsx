import { cx } from "../../lib/cx.js";

/**
 * Bagong pahina ng ulo, eksakto gaya ng Figma:
 * malaking tile na may icon (kaliwa), violet na kicker, malapad na
 * uppercase na pamagat (Inter 900 60px), at maikling deskripsyon.
 */
export default function PageHeader({
  icon,
  kicker,
  eyebrow,
  title,
  description,
  actions,
  className,
}) {
  const kickerText = kicker ?? eyebrow;
  return (
    <div
      className={cx("mb-8 flex flex-wrap items-start gap-5 sm:gap-7 xl:gap-9", className)}
    >
      {icon ? (
        <span
          className="flex h-[124px] w-[150px] shrink-0 items-center justify-center rounded-[15px] bg-lav-300 max-sm:h-[92px] max-sm:w-[110px]"
          aria-hidden="true"
        >
          <img
            src={icon}
            alt=""
            className="h-[92px] w-[92px] max-sm:h-[68px] max-sm:w-[68px]"
          />
        </span>
      ) : null}
      <div className="min-w-0 flex-1 pt-1">
        {kickerText ? (
          <p className="text-[19px] font-bold tracking-wide text-accent max-sm:text-[15px]">
            {kickerText}
          </p>
        ) : null}
        <h1 className="mt-1 text-[42px] font-black leading-[1.1] tracking-tight text-ink sm:text-[54px] 2xl:text-[60px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-[17px] text-ink max-sm:text-[15px]">
            {description}
          </p>
        ) : null}
        {actions}
      </div>
    </div>
  );
}
