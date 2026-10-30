import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Seo from "../components/Seo.jsx";

afterEach(() => {
  cleanup();
  document.head.innerHTML = "";
  document.title = "";
});

function renderSeo(props, path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Seo {...props} />
    </MemoryRouter>,
  );
}

function meta(selector) {
  return document.head.querySelector(selector)?.getAttribute("content") ?? null;
}

describe("Seo", () => {
  it("naglalagay ng natatanging title na may tatak ng HASA", () => {
    renderSeo({ title: "Mga Aralin", description: "Mga aralin sa Araling Panlipunan 8." });
    expect(document.title).toBe("Mga Aralin | HASA");
  });

  it("may default na title kapag walang ibinigay", () => {
    renderSeo({});
    expect(document.title).toContain("HASA");
    expect(meta('meta[name="description"]')).toBeTruthy();
  });

  it("gumagawa ng canonical mula sa rutang tinukoy", () => {
    renderSeo({ path: "/student/aralin" }, "/student/aralin");
    const canonical = document.head.querySelector('link[rel="canonical"]');
    expect(canonical).toBeTruthy();
    expect(canonical.getAttribute("href")).toMatch(/\/student\/aralin$/);
  });

  it("naka-noindex ang mga pahinang nasa loob ng session", () => {
    renderSeo({ path: "/student/dashboard", noindex: true });
    expect(meta('meta[name="robots"]')).toBe("noindex, nofollow");
  });

  it("naka-index ang pampublikong pahina", () => {
    renderSeo({ path: "/" });
    expect(meta('meta[name="robots"]')).toBe("index, follow");
  });

  it("kumpleto ang Open Graph at Twitter metadata", () => {
    renderSeo({ title: "HASA", description: "Pantulong sa Araling Panlipunan 8." });

    expect(meta('meta[property="og:title"]')).toBe("HASA | HASA");
    expect(meta('meta[property="og:description"]')).toBe("Pantulong sa Araling Panlipunan 8.");
    expect(meta('meta[property="og:type"]')).toBe("website");
    expect(meta('meta[property="og:site_name"]')).toBe("HASA");
    expect(meta('meta[property="og:locale"]')).toBe("tl_PH");
    expect(meta('meta[property="og:image"]')).toMatch(/og-image\.png$/);
    expect(meta('meta[name="twitter:card"]')).toBe("summary_large_image");
    expect(meta('meta[name="twitter:image"]')).toMatch(/og-image\.png$/);
  });

  it("Filipino ang nakatakdang wika ng dokumento", () => {
    renderSeo({});
    expect(document.documentElement.lang).toBe("tl");
  });

  it("hindi kailanman naglalabas ng localhost sa canonical", () => {
    renderSeo({ path: "/" });
    const href = document.head.querySelector('link[rel="canonical"]').getAttribute("href");
    expect(href).not.toContain("localhost");
    expect(href).not.toContain("127.0.0.1");
  });
});
