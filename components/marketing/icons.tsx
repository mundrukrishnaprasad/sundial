type IconProps = {
  className?: string;
  strokeWidth?: number;
};

function base(className?: string) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };
}

export function CalendarIcon({ className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(className)} strokeWidth={strokeWidth}>
      <rect x="3.25" y="5" width="17.5" height="15.75" rx="2.6" />
      <path d="M3.25 9.5h17.5M8 2.75v4M16 2.75v4" />
      <path d="M7.5 13h3.25M7.5 16.5h6.5" />
    </svg>
  );
}

export function CheckBadgeIcon({ className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(className)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.2 2.7 2.7L16.4 9" />
    </svg>
  );
}

export function BarsIcon({ className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(className)} strokeWidth={strokeWidth}>
      <path d="M4 20V11M10 20V4M16 20v-6M22 20H2" />
    </svg>
  );
}

export function LockIcon({ className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(className)} strokeWidth={strokeWidth}>
      <rect x="4.5" y="10" width="15" height="11" rx="2.4" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
      <path d="M12 14.5v2.5" />
    </svg>
  );
}

export function LedgerIcon({ className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(className)} strokeWidth={strokeWidth}>
      <path d="M6 3.5h8.5L19 8v12.5H6z" />
      <path d="M14.5 3.5V8H19" />
      <path d="M9 11h6M9 14.5h6M9 18h3.5" />
    </svg>
  );
}

export function UsersIcon({ className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(className)} strokeWidth={strokeWidth}>
      <circle cx="9" cy="8.5" r="3.4" />
      <path d="M2.75 20a6.25 6.25 0 0 1 12.5 0" />
      <path d="M15.5 5.6a3.4 3.4 0 0 1 0 5.8M17.4 14.4A6.25 6.25 0 0 1 21.25 20" />
    </svg>
  );
}

export function ShieldIcon({ className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(className)} strokeWidth={strokeWidth}>
      <path d="M12 2.75 4.5 6v5.4c0 4.6 3 8.4 7.5 9.85 4.5-1.45 7.5-5.25 7.5-9.85V6z" />
      <path d="m8.7 12.1 2.3 2.3 4.4-4.4" />
    </svg>
  );
}

export function ClockIcon({ className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(className)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.4 2" />
    </svg>
  );
}

export function ArrowRightIcon({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(className)} strokeWidth={strokeWidth}>
      <path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" />
    </svg>
  );
}

export function ArrowUpRightIcon({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(className)} strokeWidth={strokeWidth}>
      <path d="M7 17 17 7M8.5 7H17v8.5" />
    </svg>
  );
}

export function MenuIcon({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(className)} strokeWidth={strokeWidth}>
      <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
    </svg>
  );
}

export function CloseIcon({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(className)} strokeWidth={strokeWidth}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function CheckIcon({ className, strokeWidth = 2.2 }: IconProps) {
  return (
    <svg {...base(className)} strokeWidth={strokeWidth}>
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

export function MinusIcon({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(className)} strokeWidth={strokeWidth}>
      <path d="M5 12h14" />
    </svg>
  );
}

