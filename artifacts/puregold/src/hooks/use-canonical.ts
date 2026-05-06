import { useEffect } from "react";

const SITE_URL = "https://goldbuller.com";

export function useCanonical(pathname: string) {
  useEffect(() => {
    const canonical = `${SITE_URL}${pathname}`;

    let link = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;

    let ogUrl = document.querySelector<HTMLMetaElement>("meta[property='og:url']");
    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = canonical;

    return () => {
      link?.remove();
      ogUrl?.remove();
    };
  }, [pathname]);
}
