import { useEffect } from "react";
import { useLocation } from "react-router";

const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://hasa.ph").replace(/\/+$/, "");

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
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

export default function Seo({ title, description, noindex = false, path }) {
  const location = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} | HASA` : "HASA | Pantulong sa Araling Panlipunan";
    const canonical = `${SITE_URL}${path ?? location.pathname}`;
    document.title = fullTitle;

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: noindex ? "noindex, nofollow" : "index, follow",
    });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: fullTitle });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertLink("canonical", canonical);
  }, [title, description, noindex, path, location.pathname]);

  return null;
}
