import { cx } from "../../utils/cx.js";

/**
 * Ulo ng pahina. Dating 150px ang tile at 60px ang pamagat, na sobrang
 * laki sa 1366×768. Inangkop sa 88×104 na tile at 28–38px na pamagat.
 *
 * Ang `icon` ay maaaring path ng PNG (mula sa Figma) o React element
 * (lucide icon) para sa mga pahinang walang itinalagang PNG.
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
      className={cx(
        "mb-5 flex flex-wrap items-start gap-3.5 sm:gap-5",
        className,
      )}
    >
      {icon ? (
        <span
          className="flex h-[84px] w-[96px] shrink-0 items-center justify-center rounded-xl bg-lav-300 max-sm:h-[64px] max-sm:w-[72px]"
          aria-hidden="true"
        >
          {typeof icon === "string" ? (
            <img
              src={icon}
              alt=""
              className="h-[58px] w-[58px] object-contain max-sm:h-[44px] max-sm:w-[44px]"
            />
          ) : (
            <span className="flex h-[58px] w-[58px] items-center justify-center text-plum-800 max-sm:h-[44px] max-sm:w-[44px]">
              {icon}
            </span>
          )}
        </span>
      ) : null}

      <div className="min-w-0 flex-1 pt-0.5">
        {kickerText ? (
          <p className="text-[13px] font-bold tracking-wide text-accent max-sm:text-[12px]">
            {kickerText}
          </p>
        ) : null}
        <h1 className="mt-0.5 text-[26px] font-black leading-[1.1] tracking-tight text-ink sm:text-[32px] 2xl:text-[36px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-3xl text-[13px] leading-relaxed text-ink sm:text-[14px]">
            {description}
          </p>
        ) : null}
        {actions ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}
