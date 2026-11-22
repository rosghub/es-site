import type { Plugin } from "vite";

export const GTM_CONTAINER_ID = "GTM-K7VZDH83";

// Google tags report each page's full URL, and the work, invoice, estimate, and
// invite URLs carry access tokens. The tag can also collect emails, phone
// numbers, and addresses from a page, and the console shows customers' details.
// Login is excluded because signing in moves to the console without a reload,
// which would keep a loaded tag running there.
const EXCLUDED_ROUTES = ["work", "invoice", "estimate", "invite", "login", "console"];

// Firebase Hosting serves index.html for every app route, so the route check
// has to run in the browser. Apart from that check, this is the snippet Google
// supplied for the container. React Router decodes paths and ignores case when
// it matches routes, so the check does too. A path that won't decode gets no tag.
export const GOOGLE_TAG_SNIPPET = `(function () {
  var route = location.pathname.split("/").filter(Boolean)[0] || "";
  try {
    route = decodeURIComponent(route).toLowerCase();
  } catch (error) {
    return;
  }
  if (${JSON.stringify(EXCLUDED_ROUTES)}.indexOf(route) !== -1) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag("js", new Date());

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}";
  document.head.appendChild(script);
})();`;

export function addGoogleTagToHead(html: string): string {
  if (!html.includes("<head>")) {
    throw new Error("Expected a <head> element for the Google tag.");
  }

  return html.replace("<head>", () => `<head>\n<script>${GOOGLE_TAG_SNIPPET}</script>`);
}

export function googleTagManager(): Plugin {
  return {
    name: "google-tag-manager",
    transformIndexHtml: addGoogleTagToHead,
  };
}
