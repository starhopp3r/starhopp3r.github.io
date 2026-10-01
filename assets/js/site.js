(() => {
  "use strict";
  const root = document.documentElement;
  const body = document.body;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const themeToggle = document.getElementById("theme-toggle");
  const systemTheme = matchMedia("(prefers-color-scheme: dark)");
  const savedTheme = () => {
    try { return localStorage.getItem("theme-preference"); } catch (_) { return null; }
  };
  const setTheme = (theme, persist = false) => {
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#141619" : "#fcfcfb";
    themeToggle?.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    if (persist) {
      try { localStorage.setItem("theme-preference", theme); } catch (_) {}
    }
  };
  setTheme(root.dataset.theme || "light");
  if (themeToggle) {
    themeToggle.hidden = false;
    themeToggle.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark", true));
  }
  systemTheme.addEventListener("change", event => {
    if (!["light", "dark"].includes(savedTheme())) setTheme(event.matches ? "dark" : "light");
  });

  const postBody = document.querySelector(".post-body");
  const progressBar = document.getElementById("reading-progress");
  const progressText = document.getElementById("reading-percent");

  const postImages = postBody
    ? [...postBody.querySelectorAll("img")].filter((image) => !image.closest("a"))
    : [];

  postBody?.querySelectorAll("pre").forEach((codeBlock) => {
    codeBlock.tabIndex = 0;
    codeBlock.setAttribute("aria-label", "Scrollable code block");
  });

  if (postImages.length) {
    const lightbox = document.createElement("dialog");
    const closeButton = document.createElement("button");
    const closeIcon = document.createElement("span");
    const figure = document.createElement("figure");
    const viewerImage = document.createElement("img");
    const caption = document.createElement("figcaption");
    let activeImage = null;
    let activeImageTop = 0;

    lightbox.id = "image-lightbox";
    lightbox.className = "image-lightbox";
    lightbox.setAttribute("aria-label", "Expanded image");

    closeButton.className = "image-lightbox-close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Close image viewer");
    closeIcon.setAttribute("aria-hidden", "true");
    closeIcon.textContent = "×";
    closeButton.append(closeIcon);

    figure.className = "image-lightbox-figure";
    viewerImage.className = "image-lightbox-image";
    viewerImage.alt = "";
    viewerImage.draggable = false;
    caption.className = "image-lightbox-caption";
    caption.id = "image-lightbox-caption";
    figure.append(viewerImage, caption);
    lightbox.append(closeButton, figure);
    body.append(lightbox);

    const captionFor = (image) =>
      image.closest("p")?.querySelector(":scope > em")?.textContent.trim() || "";

    const meaningfulAltFor = (image) => {
      const alt = image.getAttribute("alt")?.trim() || "";
      return /^(img|image|photo)$/i.test(alt) ? "" : alt;
    };

    const restorePage = () => {
      root.classList.remove("lightbox-open");
      body.classList.remove("lightbox-open");

      const image = activeImage;
      const imageTop = activeImageTop;
      activeImage = null;
      window.requestAnimationFrame(() => {
        if (!image) {
          return;
        }

        const top =
          window.scrollY + image.getBoundingClientRect().top - imageTop;
        window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
        image.focus({ preventScroll: true });
      });
    };

    const closeLightbox = () => {
      if (!lightbox.open) {
        return;
      }

      if (typeof lightbox.close === "function") {
        lightbox.close();
      } else {
        lightbox.removeAttribute("open");
        restorePage();
      }
    };

    const openLightbox = (image) => {
      const captionText = captionFor(image);
      const meaningfulAlt = meaningfulAltFor(image);
      const description = captionText || meaningfulAlt;

      activeImage = image;
      activeImageTop = image.getBoundingClientRect().top;
      viewerImage.src = image.currentSrc || image.src;
      viewerImage.alt = meaningfulAlt;

      if (image.srcset) {
        viewerImage.srcset = image.srcset;
        viewerImage.sizes = "100vw";
      } else {
        viewerImage.removeAttribute("srcset");
        viewerImage.removeAttribute("sizes");
      }

      caption.textContent = captionText;
      caption.hidden = !captionText;
      lightbox.setAttribute(
        "aria-label",
        description ? `Expanded image: ${description}` : "Expanded image"
      );
      if (captionText) {
        lightbox.setAttribute("aria-describedby", caption.id);
      } else {
        lightbox.removeAttribute("aria-describedby");
      }
      root.classList.add("lightbox-open");
      body.classList.add("lightbox-open");

      if (typeof lightbox.showModal === "function") {
        lightbox.showModal();
      } else {
        lightbox.setAttribute("open", "");
        closeButton.focus();
      }
    };

    postImages.forEach((image) => {
      const description = captionFor(image) || meaningfulAltFor(image);

      image.classList.add("zoomable-image");
      image.tabIndex = 0;
      image.setAttribute("role", "button");
      image.setAttribute("aria-haspopup", "dialog");
      image.setAttribute("aria-controls", lightbox.id);
      image.setAttribute(
        "aria-label",
        description ? `View larger: ${description}` : "View image larger"
      );

      image.addEventListener("click", () => openLightbox(image));
      image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(image);
        }
      });
    });

    closeButton.addEventListener("click", closeLightbox);
    viewerImage.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox || event.target === figure) {
        closeLightbox();
      }
    });
    lightbox.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeLightbox();
    });
    lightbox.addEventListener("close", restorePage);
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        lightbox.open &&
        typeof lightbox.showModal !== "function"
      ) {
        closeLightbox();
      }
    });
  }

  if (postBody && progressBar) {
    body.classList.add("has-reading-progress");

    const updateReadingProgress = () => {
      const bounds = postBody.getBoundingClientRect();
      const start = window.scrollY + bounds.top - window.innerHeight * 0.2;
      const end = start + postBody.offsetHeight - window.innerHeight * 0.65;
      const progress = Math.min(1, Math.max(0, (window.scrollY - start) / Math.max(1, end - start)));
      const percentage = Math.round(progress * 100);

      progressBar.style.transform = `scaleX(${progress})`;
      if (progressText) {
        progressText.textContent = `${percentage}%`;
      }
    };

    updateReadingProgress();
    window.addEventListener("scroll", updateReadingProgress, { passive: true });
    window.addEventListener("resize", updateReadingProgress);
  }

  const headings = postBody ? [...postBody.querySelectorAll("h2, h3")] : [];
  const toc = document.querySelector(".js-toc");

  if (toc && headings.length > 1) {
    const tocPanel = document.querySelector(".post-toc-inner");
    const headingIds = new Set();
    const linksByHeading = new Map();
    const headingsByLink = new Map();
    const headingsById = new Map();
    const rootList = document.createElement("ul");
    let parentItem = null;
    let navigationTarget = null;
    let tocFrame = 0;

    rootList.className = "toc-list";

    const createHeadingId = (heading, index) => {
      const fallback = `section-${index + 1}`;
      const base =
        heading.textContent
          .trim()
          .toLowerCase()
          .normalize("NFKD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") || fallback;
      let candidate = heading.id.trim() || base;
      let suffix = 2;

      while (headingIds.has(candidate)) {
        candidate = `${base}-${suffix}`;
        suffix += 1;
      }

      heading.id = candidate;
      headingIds.add(candidate);
      return candidate;
    };

    headings.forEach((heading, index) => {
      const id = createHeadingId(heading, index);
      const item = document.createElement("li");
      const link = document.createElement("a");
      let list = rootList;

      item.className = "toc-list-item";
      link.className = "toc-link";
      link.href = `#${encodeURIComponent(id)}`;
      link.textContent = heading.textContent.trim();
      item.append(link);

      if (heading.tagName === "H3" && parentItem) {
        list = parentItem.querySelector(":scope > .toc-list");
        if (!list) {
          list = document.createElement("ul");
          list.className = "toc-list";
          parentItem.append(list);
        }
      }

      list.append(item);
      if (heading.tagName === "H2") {
        parentItem = item;
      }

      linksByHeading.set(heading, link);
      headingsByLink.set(link, heading);
      headingsById.set(id, heading);
    });

    toc.replaceChildren(rootList);

    const scrollOffset = () => {
      const value = Number.parseFloat(getComputedStyle(root).scrollPaddingTop);
      return Number.isFinite(value) ? value : 0;
    };

    const keepActiveLinkVisible = (link) => {
      if (!tocPanel) {
        return;
      }

      const panelBounds = tocPanel.getBoundingClientRect();
      const linkBounds = link.getBoundingClientRect();
      const edge = 8;

      if (linkBounds.top < panelBounds.top + edge) {
        tocPanel.scrollTop += linkBounds.top - panelBounds.top - edge;
      } else if (linkBounds.bottom > panelBounds.bottom - edge) {
        tocPanel.scrollTop += linkBounds.bottom - panelBounds.bottom + edge;
      }
    };

    let activeHeading = null;
    const setActiveHeading = (heading) => {
      if (!heading || heading === activeHeading) {
        return;
      }

      if (activeHeading) {
        const previousLink = linksByHeading.get(activeHeading);
        previousLink?.classList.remove("is-active-link");
        previousLink?.removeAttribute("aria-current");
      }

      const activeLink = linksByHeading.get(heading);
      activeLink?.classList.add("is-active-link");
      activeLink?.setAttribute("aria-current", "location");
      if (activeLink) {
        keepActiveLinkVisible(activeLink);
      }
      activeHeading = heading;
    };

    const currentHeading = () => {
      const threshold = scrollOffset() + 1;
      const pageBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;

      if (pageBottom) {
        return headings.at(-1);
      }

      let current = headings[0];
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > threshold) {
          break;
        }
        current = heading;
      }
      return current;
    };

    const updateToc = () => {
      tocFrame = 0;
      setActiveHeading(navigationTarget || currentHeading());
    };

    const scheduleTocUpdate = () => {
      if (!tocFrame) {
        tocFrame = window.requestAnimationFrame(updateToc);
      }
    };

    const alignHeading = (heading, behavior = "instant") => {
      const top =
        window.scrollY + heading.getBoundingClientRect().top - scrollOffset();
      window.scrollTo({ top: Math.max(0, top), behavior });
    };

    const cancelNavigation = () => {
      navigationTarget = null;
      scheduleTocUpdate();
    };

    const navigateToHeading = (heading, updateHistory = true) => {
      navigationTarget = heading;
      setActiveHeading(heading);

      if (updateHistory) {
        const hash = `#${encodeURIComponent(heading.id)}`;
        const method = window.location.hash === hash ? "replaceState" : "pushState";
        window.history[method](null, "", hash);
      }

      alignHeading(heading, reducedMotion.matches ? "instant" : "smooth");

      window.setTimeout(() => {
        if (navigationTarget === heading) {
          alignHeading(heading);
        }
      }, reducedMotion.matches ? 0 : 900);
    };

    toc.addEventListener("click", (event) => {
      const link = event.target.closest(".toc-link");
      const heading = link ? headingsByLink.get(link) : null;

      if (!heading) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      navigateToHeading(heading);
    });

    const cancelKeys = new Set([
      "ArrowDown",
      "ArrowUp",
      "End",
      "Home",
      "PageDown",
      "PageUp",
      " "
    ]);

    window.addEventListener("wheel", cancelNavigation, { passive: true });
    window.addEventListener("touchstart", cancelNavigation, { passive: true });
    window.addEventListener("keydown", (event) => {
      if (cancelKeys.has(event.key)) {
        cancelNavigation();
      }
    });
    document.addEventListener(
      "pointerdown",
      (event) => {
        if (!event.target.closest(".js-toc")) {
          cancelNavigation();
        }
      },
      { capture: true, passive: true }
    );

    window.addEventListener("scroll", scheduleTocUpdate, { passive: true });
    window.addEventListener("resize", scheduleTocUpdate);
    window.addEventListener("popstate", () => {
      const rawId = window.location.hash.slice(1);
      let id = rawId;

      try {
        id = decodeURIComponent(rawId);
      } catch {
        // Keep the literal hash when it contains malformed escape sequences.
      }

      const heading = headingsById.get(id);
      if (heading) {
        window.requestAnimationFrame(() => navigateToHeading(heading, false));
      } else {
        cancelNavigation();
      }
    });

    const handleLayoutChange = () => {
      if (navigationTarget) {
        alignHeading(navigationTarget);
      }
      scheduleTocUpdate();
    };

    if ("ResizeObserver" in window) {
      new ResizeObserver(handleLayoutChange).observe(postBody);
    }

    postBody.querySelectorAll("img").forEach((image) => {
      if (!image.complete) {
        image.addEventListener("load", handleLayoutChange, { once: true });
      }
    });

    document.fonts?.ready.then(handleLayoutChange);

    let initialId = window.location.hash.slice(1);
    try {
      initialId = decodeURIComponent(initialId);
    } catch {
      // Keep the literal hash when it contains malformed escape sequences.
    }

    const initialHeading = headingsById.get(initialId);
    if (initialHeading) {
      window.requestAnimationFrame(() => navigateToHeading(initialHeading, false));
    } else {
      updateToc();
    }

    document.querySelector(".post-toc").hidden = false;
  }


  const tocToggle = document.querySelector(".toc-toggle");
  tocToggle?.addEventListener("click", () => {
    tocToggle.setAttribute("aria-expanded", String(tocToggle.getAttribute("aria-expanded") !== "true"));
  });

  postBody?.querySelectorAll("pre").forEach(pre => {
    const code = pre.querySelector("code");
    if (!code || !navigator.clipboard) return;
    const wrapper = document.createElement("div");
    wrapper.className = "code-container";
    pre.before(wrapper);
    wrapper.append(pre);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-code";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy code to clipboard");
    button.setAttribute("aria-live", "polite");
    wrapper.append(button);
    let reset;
    button.addEventListener("click", async () => {
      clearTimeout(reset);
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = "Copied";
        button.setAttribute("aria-label", "Code copied to clipboard");
      } catch (_) {
        button.textContent = "Select code";
        button.setAttribute("aria-label", "Code selected; use your copy shortcut");
        const range = document.createRange();
        range.selectNodeContents(code);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
      reset = setTimeout(() => {
        button.textContent = "Copy";
        button.setAttribute("aria-label", "Copy code to clipboard");
      }, 2400);
    });
  });
})();
