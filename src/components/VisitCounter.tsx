/**
 * Visit Counter component.
 *
 * Uses visitor-badge.laobi.icu — a free, zero-registration badge counter service.
 * The badge increments on every page load.
 *
 * To switch to a different provider, change the `badgeUrl` below:
 *   - visitor-badge.laobi.icu: https://visitor-badge.laobi.icu/badge?page_id=YOUR_ID
 *   - hits.seeyoufarm.com:     https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=YOUR_URL
 */

import { useState } from "react";

const PAGE_ID = "web-winrar-keygen.github.io";

// visitor-badge.laobi.icu returns an SVG badge with the visitor count
const badgeUrl = `https://visitor-badge.laobi.icu/badge?page_id=${PAGE_ID}&left_color=%23333&right_color=%234f7df9&left_text=Visitors`;

export default function VisitCounter() {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (errored) return null;

  return (
    <span className="visit-counter">
      <img
        src={badgeUrl}
        alt="Visitor count"
        className={`visit-counter-badge${loaded ? " loaded" : ""}`}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
    </span>
  );
}
