/**
 * Safely copies text to the user's clipboard across both secure (HTTPS / localhost)
 * and non-secure contexts (such as accessing via local LAN IP: http://192.168.x.x:5173).
 * Uses navigator.clipboard when available, falling back to document.execCommand('copy').
 */
export const copyToClipboard = async (text) => {
  if (!text) return false;

  // Modern Async Clipboard API (available in Secure Contexts: HTTPS or localhost)
  if (navigator?.clipboard?.writeText && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("navigator.clipboard.writeText failed, trying fallback:", err);
    }
  }

  // Fallback for non-secure HTTP contexts (e.g., testing via LAN IP from another machine)
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    textArea.setAttribute("readonly", "");
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Fallback document.execCommand copy failed:", err);
    return false;
  }
};
