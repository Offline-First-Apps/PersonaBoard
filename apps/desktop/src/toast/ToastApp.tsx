import { useCallback, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

export default function ToastApp() {
  const messageRef = useRef<HTMLSpanElement>(null!);
  const containerRef = useRef<HTMLDivElement>(null!);
  const showTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = useCallback((msg: string) => {
    clearTimeout(showTimer.current);
    clearTimeout(leaveTimer.current);
    if (messageRef.current) messageRef.current.textContent = msg;
    const c = containerRef.current;
    if (!c) return;
    c.classList.remove("pb-toast-leave");
    c.style.display = "flex";
    c.getBoundingClientRect();
    showTimer.current = setTimeout(() => {
      c.classList.add("pb-toast-leave");
      leaveTimer.current = setTimeout(() => {
        c.style.display = "none";
        c.classList.remove("pb-toast-leave");
        invoke("hide_toast");
      }, 200);
    }, 1400);
  }, []);

  useEffect(() => {
    const unlistenCopied = listen("toast-copied", () => show("Copied to clipboard"));
    const unlistenPasted = listen("toast-pasted", () => show("Pasted to clipboard"));
    return () => {
      clearTimeout(showTimer.current);
      clearTimeout(leaveTimer.current);
      unlistenCopied.then((fn) => fn());
      unlistenPasted.then((fn) => fn());
    };
  }, [show]);

  return (
    <div className="pb-toast-container">
      <div ref={containerRef} className="pb-toast" style={{ display: "none" }}>
        <span className="pb-toast-tick">✓</span>
        <span ref={messageRef}>Copied to clipboard</span>
      </div>
    </div>
  );
}
