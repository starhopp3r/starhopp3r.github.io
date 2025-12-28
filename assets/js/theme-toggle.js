(function() {
  'use strict';

  const STORAGE_KEY = 'theme-preference';
  const THEME_ATTR = 'data-theme';

  // Get the current theme from localStorage or default to dark
  function getTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'dark';
  }

  // Set the theme on the document
  function setTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute(THEME_ATTR, 'light');
    } else {
      document.documentElement.removeAttribute(THEME_ATTR);
    }
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleIcon(theme);
  }

  // Update the toggle button icon
  function updateToggleIcon(theme) {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const icon = toggle.querySelector('.theme-icon');
    if (theme === 'light') {
      icon.textContent = 'light_mode';
      toggle.setAttribute('aria-label', 'Switch to dark mode');
    } else {
      icon.textContent = 'dark_mode';
      toggle.setAttribute('aria-label', 'Switch to light mode');
    }
  }

  // Toggle between light and dark
  function toggleTheme() {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }

  // Initialize theme on page load
  function init() {
    const theme = getTheme();
    updateToggleIcon(theme);

    // Add click handler to toggle button
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', toggleTheme);
    }

    // Hamburger menu functionality
    const hamburger = document.getElementById('hamburger');
    const siteNav = document.getElementById('site-nav');
    const navOverlay = document.getElementById('nav-overlay');

    if (hamburger && siteNav && navOverlay) {
      function closeMenu() {
        hamburger.classList.remove('active');
        siteNav.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }

      function openMenu() {
        hamburger.classList.add('active');
        siteNav.classList.add('active');
        navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      hamburger.addEventListener('click', function() {
        if (siteNav.classList.contains('active')) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      // Close menu when clicking nav links
      const navLinks = siteNav.querySelectorAll('a');
      navLinks.forEach(function(link) {
        link.addEventListener('click', closeMenu);
      });

      // Close menu when clicking overlay
      navOverlay.addEventListener('click', closeMenu);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
