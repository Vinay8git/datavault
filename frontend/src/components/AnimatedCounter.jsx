import { useEffect, useMemo, useState } from "react";

const parseNumeric = (value) => {
  if (!value || typeof value !== "string") return { num: 0, unit: "" };
  const [rawNum, ...unitParts] = value.split(" ");
  const num = Number.parseFloat(rawNum) || 0;
  const unit = unitParts.join(" ").trim();
  return { num, unit };
};

const AnimatedCounter = ({ value = "0", duration = 900, decimals = 2, className = "" }) => {
  const { num, unit } = useMemo(() => parseNumeric(value), [value]);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(num * eased);

      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [num, duration]);

  return (
    <span className={className}>
      {display.toFixed(decimals)}
      {unit ? ` ${unit}` : ""}
    </span>
  );
};

export default AnimatedCounter;