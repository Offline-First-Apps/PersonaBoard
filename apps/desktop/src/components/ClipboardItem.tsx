import { useState } from "react";
import type { ClipboardItemData, ClipboardItemType } from "../lib/types";
import {
  IconBrowser,
  IconCode,
  IconCopy,
  IconFile,
  IconImage,
  IconMessage,
  IconPin,
  IconPlay,
  IconTrash,
  IconVideo,
} from "./icons";

const TYPE_META: Record<ClipboardItemType, { icon: (props: { style?: React.CSSProperties }) => React.ReactNode; label: string }> = {
  text: { icon: IconMessage, label: "Text" },
  link: { icon: IconBrowser, label: "Link" },
  code: { icon: IconCode, label: "Code" },
  image: { icon: IconImage, label: "Image" },
  video: { icon: IconVideo, label: "Video" },
  file: { icon: IconFile, label: "File" },
};

function TypeGlyph({ type }: { type: ClipboardItemType }) {
  const Icon = TYPE_META[type].icon;
  return <Icon style={{ color: "var(--pb-text-tertiary)", flexShrink: 0 }} />;
}

function Swatch({ colors }: { colors: string[] }) {
  return (
    <div aria-hidden="true" className="pb-swatch">
      {colors.map((c, i) => (
        <div key={i} style={{ flex: 1, background: c }} />
      ))}
    </div>
  );
}

function VideoThumb({ colors, duration }: { colors: string[]; duration?: string }) {
  return (
    <div
      aria-hidden="true"
      className="pb-video-thumb"
      style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]} 55%, ${colors[2]})` }}
    >
      <div className="pb-video-play">
        <IconPlay />
      </div>
      {duration && <span className="pb-video-duration">{duration}</span>}
    </div>
  );
}

/* File: a small folded-corner "paper" icon — unmistakably a document */
function FoldedFileIcon({ ext }: { ext: string }) {
  return (
    <div aria-hidden="true" className="pb-file-icon">
      <span className="pb-file-fold" />
      <span className="pb-file-ext">{ext.slice(0, 4) || "FILE"}</span>
    </div>
  );
}

/* Link: a miniature browser-chrome header — favicon monogram + domain — over the raw URL */
function LinkChrome({ domain }: { domain: string }) {
  const favLetter = domain.replace(/^www\./, "")[0]?.toUpperCase() || "?";
  return (
    <div className="pb-link-chrome">
      <div aria-hidden="true" className="pb-link-favicon">
        {favLetter}
      </div>
      <span className="pb-link-domain">{domain}</span>
    </div>
  );
}

/* Code: a warm terminal pane */
function TerminalBlock({ text, pinned }: { text: string; pinned: boolean }) {
  return (
    <div className={`pb-code-pane${pinned ? " pb-code-pane-pinned" : ""}`}>
      <pre className="pb-code-text">{text}</pre>
    </div>
  );
}

interface ClipboardItemProps {
  item: ClipboardItemData;
  dense?: boolean;
  /** True while the item is fading out before removal */
  leaving?: boolean;
  onPin?: (id: string) => void;
  onCopy?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ClipboardItem({ item, dense, leaving, onPin, onCopy, onDelete }: ClipboardItemProps) {
  const [hovered, setHovered] = useState(false);
  const [justPinned, setJustPinned] = useState(false);
  const [copied, setCopied] = useState(false);
  const pinned = !!item.pinned;

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    setJustPinned(true);
    setTimeout(() => setJustPinned(false), 420);
    onPin?.(item.id);
  };
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
    onCopy?.(item.id);
  };
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(item.id);
  };

  const isMedia = item.type === "image" || item.type === "video";
  const isFile = item.type === "file";
  const isCode = item.type === "code";
  const isLink = item.type === "link";
  const domain = isLink ? item.text.split("/")[0] : "";
  const fileExt = isFile ? item.text.split(".").pop() ?? "" : "";

  const captionRow = (
    <div className="pb-item-caption">
      <div className="pb-item-caption-left">
        <span className="pb-item-time">{item.time}</span>
        {item.label && <span className="pb-item-label">{item.label}</span>}
        {item.meta && !isFile && !isMedia && !isLink && !isCode && (
          <span className="pb-item-meta">{item.meta}</span>
        )}
      </div>
      <div className="pb-item-actions" style={{ opacity: hovered ? 1 : 0 }}>
        <button
          aria-label={pinned ? "Unpin this item" : "Keep this one close"}
          title={pinned ? "Unpin" : "Keep this one close"}
          onClick={handlePin}
          className="pb-icon-btn"
          style={{ color: pinned ? "var(--pb-accent)" : "var(--pb-text-secondary)" }}
        >
          <IconPin />
        </button>
        <button
          aria-label={copied ? "Copied" : "Copy again"}
          title="Copy again"
          onClick={handleCopy}
          className="pb-icon-btn"
          style={{ color: copied ? "var(--pb-success)" : "var(--pb-text-secondary)" }}
        >
          <IconCopy />
        </button>
        <button
          aria-label="Remove item"
          title="Remove"
          onClick={handleDelete}
          className="pb-icon-btn pb-icon-btn-danger"
          style={{ color: "var(--pb-text-secondary)" }}
        >
          <IconTrash />
        </button>
      </div>
    </div>
  );

  const hoverProps = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  if (isMedia) {
    return (
      <div role="button" tabIndex={0} className={`pb-item pb-item-enter pb-item-media${leaving ? " pb-item-leave" : ""}`} {...hoverProps}>
        <div className="pb-media-thumb" style={{ height: dense ? 132 : 168 }}>
          {item.type === "image" && item.swatch && <Swatch colors={item.swatch} />}
          {item.type === "video" && item.swatch && <VideoThumb colors={item.swatch} duration={item.meta} />}
          {pinned && <span aria-hidden="true" className="pb-pin-dot" />}
          {justPinned && <span aria-hidden="true" className="pb-pulse pb-pin-flash" />}
        </div>
        <div className="pb-media-name">
          <TypeGlyph type={item.type} />
          <span className="pb-media-filename">{item.text}</span>
        </div>
        {captionRow}
      </div>
    );
  }

  if (isFile) {
    return (
      <div role="button" tabIndex={0} className={`pb-item pb-item-enter pb-item-card${pinned ? " pb-item-pinned" : ""}${leaving ? " pb-item-leave" : ""}`} {...hoverProps}>
        {justPinned && <span aria-hidden="true" className="pb-pulse pb-pin-flash" />}
        <div className="pb-file-row">
          <FoldedFileIcon ext={fileExt} />
          <div className="pb-file-info">
            <span className="pb-file-name">{item.text}</span>
            {item.meta && <span className="pb-file-meta">{item.meta}</span>}
          </div>
        </div>
        {captionRow}
      </div>
    );
  }

  if (isCode) {
    return (
      <div role="button" tabIndex={0} className={`pb-item pb-item-enter pb-item-card${pinned ? " pb-item-pinned" : ""}${leaving ? " pb-item-leave" : ""}`} {...hoverProps}>
        {justPinned && <span aria-hidden="true" className="pb-pulse pb-pin-flash" />}
        <TerminalBlock text={item.text} pinned={pinned} />
        {captionRow}
      </div>
    );
  }

  if (isLink) {
    return (
      <div role="button" tabIndex={0} className={`pb-item pb-item-enter pb-item-card${pinned ? " pb-item-pinned" : ""}${leaving ? " pb-item-leave" : ""}`} {...hoverProps}>
        {justPinned && <span aria-hidden="true" className="pb-pulse pb-pin-flash" />}
        <LinkChrome domain={domain} />
        <span className="pb-link-url">{item.text}</span>
        {captionRow}
      </div>
    );
  }

  /* Text: a quiet card with a 2–3 line preview */
  return (
    <div role="button" tabIndex={0} className={`pb-item pb-item-enter pb-item-card${pinned ? " pb-item-pinned" : ""}${leaving ? " pb-item-leave" : ""}`} {...hoverProps}>
      {justPinned && <span aria-hidden="true" className="pb-pulse pb-pin-flash" />}
      <p className="pb-text-preview">{item.text}</p>
      {captionRow}
    </div>
  );
}
