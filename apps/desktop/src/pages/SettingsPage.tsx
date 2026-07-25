import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { clearHistory, getSettings, saveSettings } from "../lib/api";
import type { Settings } from "../lib/api";

const POSITION_OPTIONS: { id: Settings["panel_position"]; label: string }[] = [
  { id: "center", label: "Centered" },
  { id: "cursor", label: "Near cursor" },
  { id: "last", label: "Remember last" },
];

const RETENTION_OPTIONS: { id: number | null; label: string }[] = [
  { id: null, label: "Keep forever" },
  { id: 7, label: "7 days" },
  { id: 30, label: "30 days" },
];

function Segmented<T extends string | number | null>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="pb-seg">
      {options.map((opt) => (
        <button
          key={String(opt.id)}
          role="radio"
          aria-checked={value === opt.id}
          className={`pb-seg-btn${value === opt.id ? " pb-seg-btn-active" : ""}`}
          onClick={() => onChange(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    void getSettings().then(setSettings);
  }, []);

  const update = (patch: Partial<Settings>) => {
    if (!settings) return;
    const next = { ...settings, ...patch };
    setSettings(next);
    void saveSettings(next);
  };

  const handleClear = async () => {
    await clearHistory();
    setConfirmingClear(false);
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  };

  if (!settings) return <main className="pb-panel pb-app" />;

  return (
    <main className="pb-panel pb-app" aria-label="PersonaBoard settings">
      <div className="pb-board pb-scroll" style={{ overflowY: "auto" }}>
        <header className="pb-header">
          <div className="pb-header-row">
            <div>
              <p className="pb-title">Settings</p>
              <p className="pb-subtitle">Quiet defaults. Change only what you need.</p>
            </div>
            <button className="pb-back-btn" onClick={() => navigate({ to: "/" })}>
              ← Back
            </button>
          </div>
        </header>

        <div className="pb-settings">
          <section className="pb-settings-section">
            <h2 className="pb-settings-heading">Keyboard</h2>
            <div className="pb-settings-row">
              <span className="pb-settings-label">Show the board</span>
              <span className="pb-hotkey-chip">⌃⇧V</span>
            </div>
            <p className="pb-settings-note">Shortcut recording is coming soon.</p>
          </section>

          <section className="pb-settings-section">
            <h2 className="pb-settings-heading">Panel</h2>
            <div className="pb-settings-row">
              <span className="pb-settings-label">Position</span>
              <Segmented
                ariaLabel="Panel position"
                options={POSITION_OPTIONS}
                value={settings.panel_position}
                onChange={(panel_position) => update({ panel_position })}
              />
            </div>
            <div className="pb-settings-row">
              <span className="pb-settings-label">Soft click when the panel opens</span>
              <button
                role="switch"
                aria-checked={settings.sound_on_open}
                className={`pb-toggle${settings.sound_on_open ? " pb-toggle-on" : ""}`}
                onClick={() => update({ sound_on_open: !settings.sound_on_open })}
              >
                <span className="pb-toggle-knob" />
              </button>
            </div>
          </section>

          <section className="pb-settings-section">
            <h2 className="pb-settings-heading">History</h2>
            <div className="pb-settings-row">
              <span className="pb-settings-label">Keep items</span>
              <Segmented
                ariaLabel="History retention"
                options={RETENTION_OPTIONS}
                value={settings.retention_days}
                onChange={(retention_days) => update({ retention_days })}
              />
            </div>
            <p className="pb-settings-note">Pinned items are always kept.</p>
            <div className="pb-settings-row" style={{ marginTop: 14 }}>
              {confirmingClear ? (
                <div className="pb-confirm">
                  <span className="pb-settings-label">Clear everything unpinned?</span>
                  <button className="pb-danger-btn" onClick={() => void handleClear()}>
                    Yes, clear it
                  </button>
                  <button className="pb-back-btn" onClick={() => setConfirmingClear(false)}>
                    Keep it
                  </button>
                </div>
              ) : (
                <button className="pb-danger-outline-btn" onClick={() => setConfirmingClear(true)}>
                  {cleared ? "Cleared." : "Clear all history…"}
                </button>
              )}
            </div>
          </section>

          <section className="pb-settings-section pb-settings-about">
            <h2 className="pb-settings-heading">About</h2>
            <p className="pb-settings-note">
              PersonaBoard 0.1.0 · Personal license
              <br />
              Everything stays on this machine.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
