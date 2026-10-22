(() => {
  "use strict";
  const root = document.documentElement;
  const body = document.body;

  // The folder's tabs switch between essays and books; /#books opens the books tab.
  const tabs = [...document.querySelectorAll('.folder-tabs [role="tab"]')];
  const selectTab = (tab) => {
    tabs.forEach((other) => {
      const selected = other === tab;
      other.setAttribute("aria-selected", String(selected));
      other.tabIndex = selected ? 0 : -1;
      document.getElementById(other.getAttribute("aria-controls")).hidden = !selected;
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      selectTab(tab);
      const hash = index ? `#${tab.getAttribute("aria-controls")}` : "";
      history.replaceState(null, "", `${location.pathname}${location.search}${hash}`);
    });
    tab.addEventListener("keydown", (event) => {
      const last = tabs.length - 1;
      const target = {
        ArrowRight: index === last ? 0 : index + 1,
        ArrowLeft: index === 0 ? last : index - 1,
        Home: 0,
        End: last,
      }[event.key];
      if (target === undefined) return;
      event.preventDefault();
      tabs[target].click();
      tabs[target].focus();
    });
  });
  const linkedTab = tabs.find((tab) => location.hash === `#${tab.getAttribute("aria-controls")}`);
  if (linkedTab) selectTab(linkedTab);

  const postBody = document.querySelector(".post-body");

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
    const figure = document.createElement("figure");
    const viewerImage = document.createElement("img");
    const caption = document.createElement("figcaption");
    let activeImage = null;
    let activeImageTop = 0;

    lightbox.id = "image-lightbox";
    lightbox.className = "image-lightbox";
    lightbox.setAttribute("aria-label", "Expanded image");
    // Focus lands on the viewer, so the close button only shows a ring once someone tabs to it.
    lightbox.tabIndex = -1;

    closeButton.className = "image-lightbox-close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Close image viewer");

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
        // Ask for a copy as wide as the viewer shows it: the screen's width, but never wider than the original.
        const originalWidth = Number(image.getAttribute("width")) || Infinity;
        viewerImage.srcset = image.srcset;
        viewerImage.sizes = `${Math.min(window.innerWidth, originalWidth)}px`;
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
      }
      lightbox.focus();
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

  // A video is only its thumbnail until someone presses play, so the page doesn't load YouTube's player up front.
  document.querySelectorAll(".youtube-facade").forEach((facade) => {
    const id = facade.dataset.youtubeId;
    const thumbnail = facade.querySelector("img");
    // YouTube answers a missing HD thumbnail with a 120px grey placeholder; fall back to the standard one.
    const useStandardThumbnail = () => {
      if (thumbnail.srcset && thumbnail.naturalWidth <= 120) {
        thumbnail.removeAttribute("srcset");
        thumbnail.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
      }
    };
    thumbnail.addEventListener("load", useStandardThumbnail);
    thumbnail.addEventListener("error", useStandardThumbnail);
    if (thumbnail.complete) useStandardThumbnail();

    facade.addEventListener("click", (event) => {
      if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const player = document.createElement("iframe");
      player.src = `https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1`;
      player.title = facade.dataset.title;
      player.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      player.referrerPolicy = "strict-origin-when-cross-origin";
      player.allowFullscreen = true;
      facade.replaceWith(player);
      player.focus();
    });
  });

  postBody?.querySelectorAll("h2[id], h3[id], h4[id]").forEach((heading) => {
    const anchor = document.createElement("a");
    anchor.className = "heading-anchor";
    anchor.href = `#${encodeURIComponent(heading.id)}`;
    anchor.setAttribute("aria-label", `Link to section: ${heading.textContent.trim()}`);
    anchor.textContent = "#".repeat(Number(heading.tagName[1]) - 1);
    heading.prepend(anchor);
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
