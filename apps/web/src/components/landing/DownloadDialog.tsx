"use client";

import { useEffect, useRef, useState } from "react";
import { env } from "@personaboard/env/web";
import { trackEvent } from "@/lib/gtag";

/* The installer lives here once we publish releases. */
const DOWNLOAD_URL = "/downloads/personaboard-setup.exe";
const DOWNLOAD_NAME = "personaboard-setup.exe";

/* One env variable points the web app at the Hono server. */
const SERVER_URL = env.NEXT_PUBLIC_SERVER_URL;

async function captureLead(name: string, email: string) {
  try {
    const res = await fetch(`${SERVER_URL}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    if (res.ok) return;
    throw new Error(`Server responded ${res.status}`);
  } catch {
    // Server unreachable — keep the lead locally so nothing is lost.
    try {
      const leads = JSON.parse(localStorage.getItem("pb-leads") ?? "[]");
      leads.push({ name, email, at: new Date().toISOString() });
      localStorage.setItem("pb-leads", JSON.stringify(leads));
    } catch {
      /* localStorage unavailable — the download matters more */
    }
  }
}

interface DownloadDialogProps {
  open: boolean;
  onClose: () => void;
}

export function DownloadDialog({ open, onClose }: DownloadDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [started, setStarted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setStarted(false);
    setErrors({});
    const t = setTimeout(() => nameRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const validate = () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "We'd love to know what to call you.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "That email doesn't look quite right.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleDownload = async () => {
    if (!validate()) return;

    await captureLead(name.trim(), email.trim());
    trackEvent("download_app", { platform: "windows" });

    // The `download` attribute forces a save. If a browser still opens the
    // file in a new tab (e.g. unknown MIME type), the fallback link below
    // gives the user a manual path.
    const a = document.createElement("a");
    a.href = DOWNLOAD_URL;
    a.download = DOWNLOAD_NAME;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setStarted(true);
  };

  return (
    <div
      className="lp-dialog-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="lp-dialog" role="dialog" aria-modal="true" aria-labelledby="lp-dialog-title">
        <h2 id="lp-dialog-title">Before you go</h2>
        <p className="lp-dialog-sub">
          Leave your name and email and the download is yours. We&apos;ll only write when
          something worth knowing ships — no noise, ever.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleDownload();
          }}
          noValidate
        >
          <div className="lp-field">
            <label htmlFor="lp-name">Your name</label>
            <input
              id="lp-name"
              ref={nameRef}
              type="text"
              autoComplete="name"
              placeholder="Ada Lovelace"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="lp-field-error">{errors.name}</p>}
          </div>

          <div className="lp-field">
            <label htmlFor="lp-email">Email</label>
            <input
              id="lp-email"
              type="email"
              autoComplete="email"
              placeholder="ada@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="lp-field-error">{errors.email}</p>}
          </div>

          <div className="lp-dialog-actions">
            <button type="submit" className="lp-btn lp-btn-primary" style={{ width: "100%" }}>
              Download app
            </button>
            <button type="button" className="lp-dialog-dismiss" onClick={onClose}>
              Not right now
            </button>
          </div>

          {started && (
            <p className="lp-dialog-fallback">
              Your download should have started. If the file opened in a new tab instead,{" "}
              <a href={DOWNLOAD_URL} download={DOWNLOAD_NAME}>
                right-click here and choose &ldquo;Save link as…&rdquo;
              </a>
              .
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
