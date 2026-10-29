import { cx } from "../../lib/cx.js";

export default function Card({
  as: Tag = "div",
  className,
  children,
  ...props
}) {
  return (
    <Tag
      className={cx(
        "rounded-[25px] border border-line bg-white p-5 shadow-card",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
