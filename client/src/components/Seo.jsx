import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Ang pinagmumulan ng pampublikong URL para sa canonical at Open Graph.
 *
 * 1. `VITE_SITE_URL` kung nakatakda (inirerekomenda sa production, at
 *    kailangang baguhin kapag may custom domain na).
 * 2. Ang kasalukuyang origin kung tunay na domain ito.
 * 3. Ang na-deploy na URL ng proyekto bilang huling fallback — kaya hindi
 *    kailanman lumalabas ang `localhost` sa canonical.
 */
const PRODUCTION_FALLBACK_URL = "https://hasa-xtg1.vercel.app";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "[::1]"]);

function configuredSiteUrl() {
  return (import.meta.env.VITE_SITE_URL || "").trim().replace(/\/+$/, "");
}

function siteUrl() {
  const configured = configuredSiteUrl();
  if (configured) return configured;

  if (typeof window !== "undefined" && window.location?.hostname) {
    const { hostname, origin } = window.location;
    if (hostname && !LOCAL_HOSTS.has(hostname)) return origin;
  }

  return PRODUCTION_FALLBACK_URL;
}

const DEFAULT_TITLE = "HASA — Pantulong sa Araling Panlipunan 8";
const DEFAULT_DESCRIPTION =
  "Pantulong na kagamitang pampagkatuto sa Araling Panlipunan 8: tatlong antas ng teksto, pagsusulit, at progreso.";
const DEFAULT_IMAGE = "/og-image.png";

function upsertMeta(key, attribute, value) {
  if (!value) return;
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", value);
}

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

/**
 * Naglalagay ng natatanging title, description, canonical, Open Graph,
 * Twitter card, at robots directive sa bawat ruta. `noindex` ang default
 * para sa mga pahinang nasa loob ng session; tahasang `index` lang ang
 * pampublikong pahina.
 */
export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  noindex = false,
  path,
  image = DEFAULT_IMAGE,
}) {
  const location = useLocation();

  useEffect(() => {
    const origin = siteUrl();
    const routePath = path ?? location.pathname;
    const canonical = `${origin}${routePath}`;
    const fullTitle = title ? `${title} | HASA` : DEFAULT_TITLE;
    const absoluteImage = image.startsWith("http") ? image : `${origin}${image}`;

    document.documentElement.lang = "tl";
    document.title = fullTitle;

    upsertMeta("description", "name", description);
    upsertMeta("robots", "name", noindex ? "noindex, nofollow" : "index, follow");

    upsertMeta("og:title", "property", fullTitle);
    upsertMeta("og:description", "property", description);
    upsertMeta("og:url", "property", canonical);
    upsertMeta("og:type", "property", "website");
    upsertMeta("og:site_name", "property", "HASA");
    upsertMeta("og:locale", "property", "tl_PH");
    upsertMeta("og:image", "property", absoluteImage);

    upsertMeta("twitter:card", "name", "summary_large_image");
    upsertMeta("twitter:title", "name", fullTitle);
    upsertMeta("twitter:description", "name", description);
    upsertMeta("twitter:image", "name", absoluteImage);

    upsertLink("canonical", canonical);
  }, [title, description, noindex, path, image, location.pathname]);

  return null;
}
