/**
 * Cloudflare Turnstile captcha wrapper.
 *
 * Uses @marsidev/react-turnstile (6.3KB, MIT).
 * Test sitekey "1x00000000000000000000AA" always passes — replace with your real key for production.
 *
 * Get a free sitekey at: https://dash.cloudflare.com/?to=/:account/turnstile
 */

import { Turnstile } from "@marsidev/react-turnstile";
import { useTheme } from "../theme";

/** Cloudflare test sitekey — always passes. Replace for production. */
const CF_SITE_KEY = "1x00000000000000000000AA";

export interface TurnstileWidgetProps {
  onSuccess?: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  className?: string;
}

export default function TurnstileWidget({
  onSuccess,
  onExpire,
  onError,
  className,
}: TurnstileWidgetProps) {
  const { theme } = useTheme();

  return (
    <div className={className}>
      <Turnstile
        siteKey={CF_SITE_KEY}
        options={{
          theme: theme === "dark" ? "dark" : "light",
          size: "normal",
        }}
        onSuccess={onSuccess}
        onExpire={onExpire}
        onError={onError}
      />
    </div>
  );
}
