import type { CSSProperties } from "react";

/* Phosphor/Feather-style icons — thin stroke, never filled (except IconPlay). */

interface IconProps {
  style?: CSSProperties;
  size?: number;
}

function strokeIcon(path: React.ReactNode, size: number, viewBox = "0 0 24 24") {
  return function Icon({ style, size: s = size }: IconProps) {
    return (
      <svg
        style={style}
        width={s}
        height={s}
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {path}
      </svg>
    );
  };
}

export const IconPin = strokeIcon(
  <>
    <path d="M12 17v5" />
    <path d="M9 3h6l-1 6 3 3v2H7v-2l3-3-1-6z" />
  </>,
  13
);

export const IconCopy = strokeIcon(
  <>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </>,
  13
);

export const IconTrash = strokeIcon(
  <>
    <path d="M4 7h16" />
    <path d="M9 7V4h6v3" />
    <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
  </>,
  13
);

export const IconSearch = strokeIcon(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </>,
  15
);

export const IconBrowser = strokeIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.5 2.6 4 6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-6-4-9s1.5-6.4 4-9z" />
  </>,
  14
);

export const IconCode = strokeIcon(
  <>
    <path d="M9 18l-5-6 5-6" />
    <path d="M15 6l5 6-5 6" />
  </>,
  14
);

export const IconMessage = strokeIcon(
  <>
    <path d="M21 11.5a8.5 8.5 0 1 1-3.9-7.1" />
    <path d="M21 3v6h-6" />
    <path d="M3 20l2.2-4.4A8.5 8.5 0 0 1 12.5 3" />
  </>,
  14
);

export const IconSettings = strokeIcon(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82.33l.06.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51-1 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0-1.51-1 1.65 1.65 0 0 0-1-1.51V3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1-1.51V21a2 2 0 1 1 4 0v-.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 1 1-2.83-2.83l-.06.06a2 2 0 1 1 2.83 2.83l-.06.06a2 2 0 1 1 2.83-2.83l-.06.06a2 2 0 1 1-2.83-2.83l-.06-.06a1.65 1.65 0 0 0-.33-1.82V9a1.65 1.65 0 0 0 1.51-1z" />
  </>,
  15
);

export const IconImage = strokeIcon(
  <>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="M21 16l-5.5-5.5a1.5 1.5 0 0 0-2.1 0L5 19" />
  </>,
  14
);

export const IconVideo = strokeIcon(
  <>
    <rect x="3" y="5" width="14" height="14" rx="2" />
    <path d="M21 8.5l-4 3 4 3v-6z" />
  </>,
  14
);

export const IconFile = strokeIcon(
  <>
    <path d="M8 3h6l5 5v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M14 3v5h5" />
  </>,
  14
);

export function IconPlay({ style, size = 20 }: IconProps) {
  return (
    <svg style={style} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5z" />
    </svg>
  );
}

export const IconGrid = strokeIcon(
  <>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </>,
  16
);

export const IconStar = strokeIcon(
  <path d="M12 3.5l2.5 5.4 5.8.6-4.4 4 1.2 5.8L12 16.3l-5.1 3 1.2-5.8-4.4-4 5.8-.6L12 3.5z" />,
  16
);
