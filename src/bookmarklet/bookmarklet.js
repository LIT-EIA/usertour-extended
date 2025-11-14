(function () {

  // Only open once
  if (document.querySelector('.custom-modal-overlay')) {
    return;
  }

  // Persistent data
  function loadStorage() {
    var local = localStorage.getItem("ut-configurator");
    var storage = JSON.parse(local) || {};
    return storage;
  }

  function loadStorageProp(prop) {
    var local = localStorage.getItem("ut-configurator");
    var storage = JSON.parse(local) || {};
    return storage && storage[prop] ? storage[prop] : null;
  }

  function saveToStorage(prop, value) {
    var storage = loadStorage();
    storage[prop] = value;
    localStorage.setItem("ut-configurator", JSON.stringify(storage));
  }

  // Load Font Awesome
  const faLink = document.createElement('link');
  faLink.rel = 'stylesheet';
  faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
  document.head.appendChild(faLink);

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    .custom-modal-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 2147483647;
      animation: fadeIn 0.3s ease-out;
    }

    .custom-modal {
      position: relative;
      background: #f9f9f9;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      width: 320px;
      max-width: 90%;
      padding: 20px;
      font-family: 'Segoe UI', Roboto, sans-serif;
      animation: slideUp 0.4s ease-out;
    }

    .custom-modal h2 {
      margin-top: 0;
      font-size: 1.3em;
      margin-bottom: 14px;
      color: #222;
    }

    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 1.2em;
      color: #666;
      cursor: pointer;
      transition: color 0.2s ease;
    }

    .close-button:hover {
      color: #000;
    }

    .button-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 16px;
    }

    .button-grid .custom-button {
      width: 100%;
      aspect-ratio: 1 / 1;
      font-size: 0.75em;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .button-grid .custom-button i {
      font-size: 1.2em;
      margin-bottom: 4px;
    }

    .toggle-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 10px 0 16px;
      padding: 6px 0;
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
    }

    .toggle-label {
      font-size: 0.9em;
      color: #444;
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 20px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0; left: 0;
      right: 0; bottom: 0;
      background-color: #bbb;
      transition: 0.2s;
      border-radius: 20px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 14px;
      width: 14px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.2s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #4a90e2;
    }

    input:checked + .slider:before {
      transform: translateX(20px);
    }

    .button-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .custom-button {
      padding: 6px 10px;
      border: none;
      border-radius: 6px;
      background: #e0e0e0;
      color: #333;
      font-size: 0.85em;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .custom-button:hover {
      background: #d5d5d5;
    }

    @keyframes fadeIn {
      from { opacity: 0; } to { opacity: 1; }
    }

    @keyframes slideUp {
      from { transform: translateY(40px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .selector-field-container {
      margin-bottom: 16px;
    }

    .selector-field-label {
      font-size: 0.85em;
      color: #555;
      margin-bottom: 6px;
      display: block;
    }

    .selector-field-wrapper {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .selector-field {
      flex: 1;
      min-width: 0;
      padding: 8px 10px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 0.85em;
      font-family: 'Courier New', monospace;
      background: white;
      color: #333;
    }

    .selector-field:read-only {
      cursor: text;
      background: #f5f5f5;
    }

    .copy-button {
      flex-shrink: 0;
      padding: 6px 10px;
      border: none;
      border-radius: 6px;
      background: #e0e0e0;
      color: #333;
      font-size: 0.85em;
      cursor: pointer;
      transition: background 0.2s ease;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 4px;
      width: 90px;
      justify-content: center;
    }

    .copy-button:hover {
      background: #d5d5d5;
    }

    .copy-button i {
      font-size: 1em;
    }
  `;
  document.head.appendChild(style);

  // Create modal
  const overlay = document.createElement('div');
  overlay.className = 'custom-modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'custom-modal';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-button';
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Close modal');
  closeBtn.onclick = () => overlay.remove();

  modal.innerHTML = `
    <h2>Usertour Options</h2>
    <div class="button-grid">
      <button class="custom-button select" aria-label="Select an element">
        <i class="fa fa-mouse-pointer"></i>
        <span>Select</span>
      </button>
      <button class="custom-button">2</button>
      <button class="custom-button">3</button>
      <button class="custom-button">4</button>
    </div>
    <p>Non-unique platforms</p>
    <div class="button-grid">
        <button class="custom-button select-main-only" aria-label="Select an element">
        <i class="fa fa-mouse-pointer"></i>
        <span>Select</span>
      </button>
      <button class="custom-button select-main-only-2" aria-label="Select an element">
        <i class="fa fa-mouse-pointer"></i>
        <span>Select</span>
      </button>
      <button class="custom-button">7</button>
      <button class="custom-button">8</button>
    </div>

    <div class="toggle-container">
      <span class="toggle-label">Test Mode</span>
      <label class="switch">
        <input type="checkbox" id="testModeToggle">
        <span class="slider"></span>
      </label>
    </div>

    <div class="button-list">
      <button class="custom-button">Option A</button>
      <button class="custom-button">Option B</button>
      <button class="custom-button">Option C</button>
    </div>
  `;

  modal.prepend(closeBtn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Utility functions
  function attachCloseAction(button) {
    button.addEventListener('click', () => overlay.remove());
  }

  function attachButtonAction(button, action) {
    button.addEventListener('click', function (e) {
      e.stopPropagation();
      action();
    });
  }

  // Function to show selector modal
  function showSelectorModal(selector, elementText) {
    // Remove any existing selector modal
    const existingModal = document.querySelector('.selector-modal-overlay');
    if (existingModal) {
      existingModal.remove();
    }

    // Create modal overlay
    const selectorOverlay = document.createElement('div');
    selectorOverlay.className = 'custom-modal-overlay selector-modal-overlay';

    // Create modal
    const selectorModal = document.createElement('div');
    selectorModal.className = 'custom-modal';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-button';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close modal');
    closeBtn.onclick = () => selectorOverlay.remove();

    // Create selector field container
    const selectorContainer = document.createElement('div');
    selectorContainer.className = 'selector-field-container';
    
    const selectorLabel = document.createElement('label');
    selectorLabel.className = 'selector-field-label';
    selectorLabel.textContent = 'CSS selector';
    
    const selectorWrapper = document.createElement('div');
    selectorWrapper.className = 'selector-field-wrapper';
    
    const selectorInput = document.createElement('input');
    selectorInput.type = 'text';
    selectorInput.className = 'selector-field';
    selectorInput.value = selector;
    selectorInput.readOnly = true;
    
    const selectorCopyBtn = document.createElement('button');
    selectorCopyBtn.className = 'copy-button';
    const selectorIcon = document.createElement('i');
    selectorIcon.className = 'fa fa-clone';
    const selectorText = document.createElement('span');
    selectorText.textContent = 'Copy';
    selectorCopyBtn.appendChild(selectorIcon);
    selectorCopyBtn.appendChild(selectorText);
    selectorCopyBtn.onclick = () => {
      navigator.clipboard.writeText(selector).then(() => {
        selectorText.textContent = 'Copied';
        setTimeout(() => {
          selectorText.textContent = 'Copy';
        }, 2000);
      });
    };
    
    selectorWrapper.appendChild(selectorInput);
    selectorWrapper.appendChild(selectorCopyBtn);
    selectorContainer.appendChild(selectorLabel);
    selectorContainer.appendChild(selectorWrapper);

    // Create text field container
    const textContainer = document.createElement('div');
    textContainer.className = 'selector-field-container';
    
    const textLabel = document.createElement('label');
    textLabel.className = 'selector-field-label';
    textLabel.textContent = 'Element text';
    
    const textWrapper = document.createElement('div');
    textWrapper.className = 'selector-field-wrapper';
    
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.className = 'selector-field';
    textInput.value = elementText || '';
    textInput.readOnly = true;
    
    const textCopyBtn = document.createElement('button');
    textCopyBtn.className = 'copy-button';
    const textIcon = document.createElement('i');
    textIcon.className = 'fa fa-clone';
    const textCopyText = document.createElement('span');
    textCopyText.textContent = 'Copy';
    textCopyBtn.appendChild(textIcon);
    textCopyBtn.appendChild(textCopyText);
    textCopyBtn.onclick = () => {
      navigator.clipboard.writeText(elementText || '').then(() => {
        textCopyText.textContent = 'Copied';
        setTimeout(() => {
          textCopyText.textContent = 'Copy';
        }, 2000);
      });
    };
    
    textWrapper.appendChild(textInput);
    textWrapper.appendChild(textCopyBtn);
    textContainer.appendChild(textLabel);
    textContainer.appendChild(textWrapper);

    // Build modal
    const modalTitle = document.createElement('h2');
    modalTitle.textContent = 'Selector Details';
    
    selectorModal.appendChild(closeBtn);
    selectorModal.appendChild(modalTitle);
    selectorModal.appendChild(textContainer);
    selectorModal.appendChild(selectorContainer);
    
    selectorOverlay.appendChild(selectorModal);
    document.body.appendChild(selectorOverlay);
  }

  // Select button: close + custom action
  const selectButton = modal.querySelector('.button-grid .custom-button.select');
  attachCloseAction(selectButton);
  attachButtonAction(selectButton, () => {
    function inject(doc) {
      // Add crosshair cursor style
      const style = doc.createElement("style");
      style.textContent = `* { cursor: crosshair !important }`;
      style.setAttribute("data-selector-style", "");
      doc.head.appendChild(style);

      // Ensure cursor stays crosshair even if overridden
      const observer = new MutationObserver(() => {
        doc.body.style.setProperty("cursor", "crosshair", "important");
      });
      observer.observe(doc.body, { attributes: true, attributeFilter: ["style"] });
      doc._selectorObserver = observer;

      // MutationObserver to capture original className before hover classes are added
      const classObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const el = mutation.target;
            // Only capture if we don't already have it stored
            if (!el.hasAttribute("data-original-class")) {
              // If we have oldValue, use it; otherwise use current (captured before change)
              const oldValue = mutation.oldValue !== null ? mutation.oldValue : (el.className || "");
              el.setAttribute("data-original-class", oldValue);
            }
          }
        });
      });

      // Start observing class changes on all elements
      classObserver.observe(doc.body, {
        attributes: true,
        attributeFilter: ['class'],
        attributeOldValue: true,
        subtree: true
      });
      doc._classObserver = classObserver;

      let lastHovered = null;
      let mouseDownTime = null;
      let mouseDownTarget = null;
      const CLICK_DURATION_THRESHOLD = 300; // milliseconds

      // Capture className on mouseenter (fires before mouseover and before hover states)
      function captureOriginalClass(e) {
        const el = e.target;
        if (el && el.nodeType === 1 && !el.hasAttribute("data-original-class")) {
          el.setAttribute("data-original-class", el.className || "");
        }
      }

      // Track mousedown to detect click duration
      function handleMouseDown(e) {
        mouseDownTime = Date.now();
        mouseDownTarget = e.target;
      }

      // Track mouseup and determine if it's a short click
      function handleMouseUp(e) {
        if (mouseDownTime === null) return;
        
        const clickDuration = Date.now() - mouseDownTime;
        const isShortClick = clickDuration < CLICK_DURATION_THRESHOLD;
        const isSameTarget = mouseDownTarget === e.target;
        
        // Reset tracking
        mouseDownTime = null;
        mouseDownTarget = null;
        
        // Only process selector for short clicks on the same target
        if (isShortClick && isSameTarget) {
          e.preventDefault();
          e.stopPropagation();
          let selector = getSelector(e.target);
          let elementText = getElementText(e.target);
          // Clean up selector mode first
          window.top.postMessage("__selector_cleanup__", "*");
          // Show modal with selector and text
          showSelectorModal(selector, elementText);
        }
        // For long clicks, let the event propagate normally (don't prevent default)
      }

      // Highlight hovered element
      function hoverIn(e) {
        if (lastHovered) {
          lastHovered.removeAttribute("data-selector-shadow");
          lastHovered.style.boxShadow = "";
        }
        lastHovered = e.target;
        lastHovered.setAttribute("data-selector-shadow", "");
        
        // Ensure we have the original className (should already be captured by mouseenter or MutationObserver)
        if (!lastHovered.hasAttribute("data-original-class")) {
          lastHovered.setAttribute("data-original-class", lastHovered.className || "");
        }

        // Special styling for iframes
        if (doc === document && lastHovered.tagName.toLowerCase() === "iframe") {
          lastHovered.style.boxShadow = "0 0 0 2px rgba(255,193,7,0.75), inset 0 0 0 9999px rgba(255,193,7,0.15)";
          try {
            lastHovered.contentDocument.documentElement.style.boxShadow = "";
          } catch { }
        } else {
          lastHovered.style.boxShadow = "0 0 0 2px rgba(0,123,255,0.75), inset 0 0 0 9999px rgba(0,123,255,0.15)";
        }
      }

      // Remove highlight on mouse out
      function hoverOut(e) {
        if (e.target === lastHovered) {
          e.target.removeAttribute("data-selector-shadow");
          e.target.style.boxShadow = "";
        }
      }

      // Extract element text with fallbacks
      function getElementText(el) {
        // First try to get text content
        let text = el.innerText || el.textContent || '';
        if (text && text.trim()) {
          return text.trim();
        }
        
        // Fallback to title
        if (el.title) {
          return el.title;
        }
        
        // Fallback to aria-label
        if (el.getAttribute('aria-label')) {
          return el.getAttribute('aria-label');
        }
        // Fallback to aria-labelledby
        if (el.getAttribute('aria-labelledby')) {
          return el.getAttribute('aria-labelledby');
        }
        
        // Fallback to name attribute
        if (el.name) {
          return el.name;
        }
        
        // Fallback to alt attribute
        if (el.alt) {
          return el.alt;
        }
        
        return '';
      }

      // Generate CSS selector path
      function getSelector(el) {
        let path = [];
        while (el && el.nodeType === 1 && el.tagName.toLowerCase() !== "html") {
          let tag = el.tagName.toLowerCase();
          // Use original className if available (captured before hover classes), otherwise current className
          const originalClass = el.getAttribute("data-original-class");
          const className = originalClass !== null ? originalClass : (el.className || "");
          let cls = tag !== "body" && className
            ? "." + className.trim().split(/\s+/).map(c => CSS.escape(c)).join(".")
            : "";
          let siblings = Array.from(el.parentNode?.children || []);
          let sameTagSiblings = siblings.filter(sib => sib.tagName === el.tagName);
          let selector = `${tag}${cls}`;
          if (sameTagSiblings.length > 1 || cls === "") {
            selector += `:nth-child(${siblings.indexOf(el) + 1})`;
          }
          path.unshift(selector);
          el = el.parentElement;
        }
        return path.join(" > ");
      }

      // Cleanup function
      function destroy(doc) {
        try {
          doc.body.style.cursor = "";
          doc.querySelectorAll("style[data-selector-style]").forEach(s => s.remove());
          doc.querySelectorAll("[data-selector-shadow]").forEach(el => el.style.boxShadow = "");
          doc.querySelectorAll("[data-original-class]").forEach(el => el.removeAttribute("data-original-class"));
          doc.removeEventListener("mouseenter", captureOriginalClass, true);
          doc.removeEventListener("mousedown", handleMouseDown, true);
          doc.removeEventListener("mouseup", handleMouseUp, true);
          doc.removeEventListener("mouseover", hoverIn);
          doc.removeEventListener("mouseout", hoverOut);
          if (doc._selectorObserver) {
            doc._selectorObserver.disconnect();
            delete doc._selectorObserver;
          }
          if (doc._classObserver) {
            doc._classObserver.disconnect();
            delete doc._classObserver;
          }
          // Clear iframe highlights in main document
          if (doc === document) {
            Array.from(document.querySelectorAll("iframe")).forEach(f => {
              f.style.boxShadow = "";
              try {
                if (f.contentDocument && f.contentDocument.documentElement) {
                  f.contentDocument.documentElement.style.boxShadow = "";
                }
              } catch (e) {
                // Cross-origin iframe, ignore
              }
            });
          }
        } catch (e) {
          console.warn("Cleanup failed:", e);
        }
      }

      // Attach event listeners
      // Use mouseenter with capture to catch className before hover effects
      doc.addEventListener("mouseenter", captureOriginalClass, true);
      doc.addEventListener("mouseover", hoverIn);
      doc.addEventListener("mouseout", hoverOut);
      doc.addEventListener("mousedown", handleMouseDown, true);
      doc.addEventListener("mouseup", handleMouseUp, true);
      window.addEventListener("message", e => {
        if (e.data === "__selector_cleanup__") destroy(doc);
      });
    }

    // Inject into main document
    inject(document);

    // Track iframe event listeners for cleanup
    const iframeHandlers = [];

    // Inject into all iframes
    Array.from(document.querySelectorAll("iframe")).forEach(f => {
      try {
        inject(f.contentDocument || f.contentWindow.document);
        
        const iframeMouseOver = () => {
          f.style.boxShadow = "";
          f.contentDocument.documentElement.style.boxShadow = "0 0 0 2px rgba(255,193,7,0.75), inset 0 0 0 9999px rgba(255,193,7,0.15)";
        };
        
        const iframeMouseOut = () => {
          f.contentDocument.documentElement.style.boxShadow = "";
        };
        
        f.contentDocument.documentElement.addEventListener("mouseover", iframeMouseOver);
        f.contentDocument.documentElement.addEventListener("mouseout", iframeMouseOut);
        
        // Store handlers for cleanup
        iframeHandlers.push({
          iframe: f,
          mouseover: iframeMouseOver,
          mouseout: iframeMouseOut,
          documentElement: f.contentDocument.documentElement
        });
      } catch (e) {
        console.warn("Cross-origin iframe skipped");
      }
    });

    // Cleanup iframe handlers when cleanup message is received
    const cleanupHandler = (e) => {
      if (e.data === "__selector_cleanup__") {
        iframeHandlers.forEach(handler => {
          try {
            handler.iframe.style.boxShadow = "";
            handler.documentElement.style.boxShadow = "";
            handler.documentElement.removeEventListener("mouseover", handler.mouseover);
            handler.documentElement.removeEventListener("mouseout", handler.mouseout);
          } catch (err) {
            // Ignore errors (e.g., iframe removed or cross-origin)
          }
        });
      }
    };
    
    window.addEventListener("message", cleanupHandler);
  });

  const selectButtonMainOnly = modal.querySelector('.button-grid .custom-button.select-main-only');
  attachCloseAction(selectButtonMainOnly);
  attachButtonAction(selectButtonMainOnly, () => {
    function inject(doc) {
      // Add crosshair cursor style
      const style = doc.createElement("style");
      style.textContent = `* { cursor: crosshair !important }`;
      style.setAttribute("data-selector-style", "");
      doc.head.appendChild(style);

      // Ensure cursor stays crosshair even if overridden
      const observer = new MutationObserver(() => {
        doc.body.style.setProperty("cursor", "crosshair", "important");
      });
      observer.observe(doc.body, { attributes: true, attributeFilter: ["style"] });
      doc._selectorObserver = observer;

      // MutationObserver to capture original className before hover classes are added
      const classObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const el = mutation.target;
            // Only capture if we don't already have it stored
            if (!el.hasAttribute("data-original-class")) {
              // If we have oldValue, use it; otherwise use current (captured before change)
              const oldValue = mutation.oldValue !== null ? mutation.oldValue : (el.className || "");
              el.setAttribute("data-original-class", oldValue);
            }
          }
        });
      });

      // Start observing class changes on all elements
      classObserver.observe(doc.body, {
        attributes: true,
        attributeFilter: ['class'],
        attributeOldValue: true,
        subtree: true
      });
      doc._classObserver = classObserver;

      let lastHovered = null;
      let mouseDownTime = null;
      let mouseDownTarget = null;
      const CLICK_DURATION_THRESHOLD = 300; // milliseconds

      // Capture className on mouseenter (fires before mouseover and before hover states)
      function captureOriginalClass(e) {
        const el = e.target;
        if (el && el.nodeType === 1 && !el.hasAttribute("data-original-class")) {
          el.setAttribute("data-original-class", el.className || "");
        }
      }

      // Track mousedown to detect click duration
      function handleMouseDown(e) {
        mouseDownTime = Date.now();
        mouseDownTarget = e.target;
      }

      // Track mouseup and determine if it's a short click
      function handleMouseUp(e) {
        if (mouseDownTime === null) return;
        
        const clickDuration = Date.now() - mouseDownTime;
        const isShortClick = clickDuration < CLICK_DURATION_THRESHOLD;
        const isSameTarget = mouseDownTarget === e.target;
        
        // Reset tracking
        mouseDownTime = null;
        mouseDownTarget = null;
        
        // Only process selector for short clicks on the same target
        if (isShortClick && isSameTarget) {
          e.preventDefault();
          e.stopPropagation();
          let selector = getSelector(e.target);
          let elementText = getElementText(e.target);
          // Clean up selector mode first
          window.top.postMessage("__selector_cleanup__", "*");
          // Show modal with selector and text
          showSelectorModal(selector, elementText);
        }
        // For long clicks, let the event propagate normally (don't prevent default)
      }

      // Highlight hovered element
      function hoverIn(e) {
        if (lastHovered) {
          lastHovered.removeAttribute("data-selector-shadow");
          lastHovered.style.boxShadow = "";
        }
        lastHovered = e.target;
        lastHovered.setAttribute("data-selector-shadow", "");
        
        // Ensure we have the original className (should already be captured by mouseenter or MutationObserver)
        if (!lastHovered.hasAttribute("data-original-class")) {
          lastHovered.setAttribute("data-original-class", lastHovered.className || "");
        }

        // Special styling for iframes
        if (doc === document && lastHovered.tagName.toLowerCase() === "iframe") {
          lastHovered.style.boxShadow = "0 0 0 2px rgba(255,193,7,0.75), inset 0 0 0 9999px rgba(255,193,7,0.15)";
          try {
            lastHovered.contentDocument.documentElement.style.boxShadow = "";
          } catch { }
        } else {
          lastHovered.style.boxShadow = "0 0 0 2px rgba(0,123,255,0.75), inset 0 0 0 9999px rgba(0,123,255,0.15)";
        }
      }

      // Remove highlight on mouse out
      function hoverOut(e) {
        if (e.target === lastHovered) {
          e.target.removeAttribute("data-selector-shadow");
          e.target.style.boxShadow = "";
        }
      }

      // Extract element text with fallbacks
      function getElementText(el) {
        // First try to get text content
        let text = el.innerText || el.textContent || '';
        if (text && text.trim()) {
          return text.trim();
        }
        
        // Fallback to title
        if (el.title) {
          return el.title;
        }
        
        // Fallback to aria-label
        if (el.getAttribute('aria-label')) {
          return el.getAttribute('aria-label');
        }
        
        // Fallback to aria-labelledby
        if (el.getAttribute('aria-labelledby')) {
          return el.getAttribute('aria-labelledby');
        }
        
        // Fallback to name attribute
        if (el.name) {
          return el.name;
        }
        
        // Fallback to alt attribute
        if (el.alt) {
          return el.alt;
        }
        
        return '';
      }

      // Generate CSS selector path
      function getSelector(el) {
        if (!el || el.nodeType !== 1) return "";

        let tag = el.tagName.toLowerCase();
        // Use original className if available (captured before hover classes), otherwise current className
        const originalClass = el.getAttribute("data-original-class");
        const className = originalClass !== null ? originalClass : (el.className || "");
        let cls = className
          ? "." + className.trim().split(/\s+/).map(c => CSS.escape(c)).join(".")
          : "";

        // If element has no class, find first parent with a class and add it to hierarchy
        let selector = `${tag}${cls}`;
        if (cls === "") {
          let parentWithClass = el.parentElement;
          while (parentWithClass && parentWithClass.nodeType === 1 && parentWithClass.tagName.toLowerCase() !== "html" && parentWithClass.tagName.toLowerCase() !== "body") {
            const parentOriginalClass = parentWithClass.getAttribute("data-original-class");
            const parentClassName = parentOriginalClass !== null ? parentOriginalClass : (parentWithClass.className || "");
            if (parentClassName) {
              const parentTag = parentWithClass.tagName.toLowerCase();
              const parentCls = "." + parentClassName.trim().split(/\s+/).map(c => CSS.escape(c)).join(".");
              selector = `${parentTag}${parentCls} ${selector}`;
              break;
            }
            parentWithClass = parentWithClass.parentElement;
          }
        }

        return selector;
      }

      // Cleanup function
      function destroy(doc) {
        try {
          doc.body.style.cursor = "";
          doc.querySelectorAll("style[data-selector-style]").forEach(s => s.remove());
          doc.querySelectorAll("[data-selector-shadow]").forEach(el => el.style.boxShadow = "");
          doc.querySelectorAll("[data-original-class]").forEach(el => el.removeAttribute("data-original-class"));
          doc.removeEventListener("mouseenter", captureOriginalClass, true);
          doc.removeEventListener("mousedown", handleMouseDown, true);
          doc.removeEventListener("mouseup", handleMouseUp, true);
          doc.removeEventListener("mouseover", hoverIn);
          doc.removeEventListener("mouseout", hoverOut);
          if (doc._selectorObserver) {
            doc._selectorObserver.disconnect();
            delete doc._selectorObserver;
          }
          if (doc._classObserver) {
            doc._classObserver.disconnect();
            delete doc._classObserver;
          }
          // Clear iframe highlights in main document
          if (doc === document) {
            Array.from(document.querySelectorAll("iframe")).forEach(f => {
              f.style.boxShadow = "";
              try {
                if (f.contentDocument && f.contentDocument.documentElement) {
                  f.contentDocument.documentElement.style.boxShadow = "";
                }
              } catch (e) {
                // Cross-origin iframe, ignore
              }
            });
          }
        } catch (e) {
          console.warn("Cleanup failed:", e);
        }
      }

      // Attach event listeners
      // Use mouseenter with capture to catch className before hover effects
      doc.addEventListener("mouseenter", captureOriginalClass, true);
      doc.addEventListener("mouseover", hoverIn);
      doc.addEventListener("mouseout", hoverOut);
      doc.addEventListener("mousedown", handleMouseDown, true);
      doc.addEventListener("mouseup", handleMouseUp, true);
      window.addEventListener("message", e => {
        if (e.data === "__selector_cleanup__") destroy(doc);
      });
    }

    // Inject into main document
    inject(document);

    // Track iframe event listeners for cleanup
    const iframeHandlers = [];

    // Inject into all iframes
    Array.from(document.querySelectorAll("iframe")).forEach(f => {
      try {
        inject(f.contentDocument || f.contentWindow.document);
        
        const iframeMouseOver = () => {
          f.style.boxShadow = "";
          f.contentDocument.documentElement.style.boxShadow = "0 0 0 2px rgba(255,193,7,0.75), inset 0 0 0 9999px rgba(255,193,7,0.15)";
        };
        
        const iframeMouseOut = () => {
          f.contentDocument.documentElement.style.boxShadow = "";
        };
        
        f.contentDocument.documentElement.addEventListener("mouseover", iframeMouseOver);
        f.contentDocument.documentElement.addEventListener("mouseout", iframeMouseOut);
        
        // Store handlers for cleanup
        iframeHandlers.push({
          iframe: f,
          mouseover: iframeMouseOver,
          mouseout: iframeMouseOut,
          documentElement: f.contentDocument.documentElement
        });
      } catch (e) {
        console.warn("Cross-origin iframe skipped");
      }
    });

    // Cleanup iframe handlers when cleanup message is received
    const cleanupHandler = (e) => {
      if (e.data === "__selector_cleanup__") {
        iframeHandlers.forEach(handler => {
          try {
            handler.iframe.style.boxShadow = "";
            handler.documentElement.style.boxShadow = "";
            handler.documentElement.removeEventListener("mouseover", handler.mouseover);
            handler.documentElement.removeEventListener("mouseout", handler.mouseout);
          } catch (err) {
            // Ignore errors (e.g., iframe removed or cross-origin)
          }
        });
      }
    };
    
    window.addEventListener("message", cleanupHandler);
  });

  const selectButtonMainOnly2 = modal.querySelector('.button-grid .custom-button.select-main-only-2');
  attachCloseAction(selectButtonMainOnly2);
  attachButtonAction(selectButtonMainOnly2, () => {
    function inject(doc) {
      // Add crosshair cursor style
      const style = doc.createElement("style");
      style.textContent = `* { cursor: crosshair !important }`;
      style.setAttribute("data-selector-style", "");
      doc.head.appendChild(style);

      // Ensure cursor stays crosshair even if overridden
      const observer = new MutationObserver(() => {
        doc.body.style.setProperty("cursor", "crosshair", "important");
      });
      observer.observe(doc.body, { attributes: true, attributeFilter: ["style"] });
      doc._selectorObserver = observer;

      // MutationObserver to capture original className before hover classes are added
      const classObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const el = mutation.target;
            // Only capture if we don't already have it stored
            if (!el.hasAttribute("data-original-class")) {
              // If we have oldValue, use it; otherwise use current (captured before change)
              const oldValue = mutation.oldValue !== null ? mutation.oldValue : (el.className || "");
              el.setAttribute("data-original-class", oldValue);
            }
          }
        });
      });

      // Start observing class changes on all elements
      classObserver.observe(doc.body, {
        attributes: true,
        attributeFilter: ['class'],
        attributeOldValue: true,
        subtree: true
      });
      doc._classObserver = classObserver;

      let lastHovered = null;
      let mouseDownTime = null;
      let mouseDownTarget = null;
      const CLICK_DURATION_THRESHOLD = 300; // milliseconds

      // Capture className on mouseenter (fires before mouseover and before hover states)
      function captureOriginalClass(e) {
        const el = e.target;
        if (el && el.nodeType === 1 && !el.hasAttribute("data-original-class")) {
          el.setAttribute("data-original-class", el.className || "");
        }
      }

      // Track mousedown to detect click duration
      function handleMouseDown(e) {
        mouseDownTime = Date.now();
        mouseDownTarget = e.target;
      }

      // Track mouseup and determine if it's a short click
      function handleMouseUp(e) {
        if (mouseDownTime === null) return;
        
        const clickDuration = Date.now() - mouseDownTime;
        const isShortClick = clickDuration < CLICK_DURATION_THRESHOLD;
        const isSameTarget = mouseDownTarget === e.target;
        
        // Reset tracking
        mouseDownTime = null;
        mouseDownTarget = null;
        
        // Only process selector for short clicks on the same target
        if (isShortClick && isSameTarget) {
          e.preventDefault();
          e.stopPropagation();
          let selector = getSelector(e.target);
          let elementText = getElementText(e.target);
          // Clean up selector mode first
          window.top.postMessage("__selector_cleanup__", "*");
          // Show modal with selector and text
          showSelectorModal(selector, elementText);
        }
        // For long clicks, let the event propagate normally (don't prevent default)
      }

      // Highlight hovered element
      function hoverIn(e) {
        if (lastHovered) {
          lastHovered.removeAttribute("data-selector-shadow");
          lastHovered.style.boxShadow = "";
        }
        lastHovered = e.target;
        lastHovered.setAttribute("data-selector-shadow", "");
        
        // Ensure we have the original className (should already be captured by mouseenter or MutationObserver)
        if (!lastHovered.hasAttribute("data-original-class")) {
          lastHovered.setAttribute("data-original-class", lastHovered.className || "");
        }

        // Special styling for iframes
        if (doc === document && lastHovered.tagName.toLowerCase() === "iframe") {
          lastHovered.style.boxShadow = "0 0 0 2px rgba(255,193,7,0.75), inset 0 0 0 9999px rgba(255,193,7,0.15)";
          try {
            lastHovered.contentDocument.documentElement.style.boxShadow = "";
          } catch { }
        } else {
          lastHovered.style.boxShadow = "0 0 0 2px rgba(0,123,255,0.75), inset 0 0 0 9999px rgba(0,123,255,0.15)";
        }
      }

      // Remove highlight on mouse out
      function hoverOut(e) {
        if (e.target === lastHovered) {
          e.target.removeAttribute("data-selector-shadow");
          e.target.style.boxShadow = "";
        }
      }

      // Extract element text with fallbacks
      function getElementText(el) {
        // First try to get text content
        let text = el.innerText || el.textContent || '';
        if (text && text.trim()) {
          return text.trim();
        }
        
        // Fallback to title
        if (el.title) {
          return el.title;
        }
        
        // Fallback to aria-label
        if (el.getAttribute('aria-label')) {
          return el.getAttribute('aria-label');
        }
        
        // Fallback to aria-labelledby
        if (el.getAttribute('aria-labelledby')) {
          return el.getAttribute('aria-labelledby');
        }
        
        // Fallback to name attribute
        if (el.name) {
          return el.name;
        }
        
        // Fallback to alt attribute
        if (el.alt) {
          return el.alt;
        }
        
        return '';
      }

      // Generate CSS selector path
      function getSelector(el) {
        if (!el || el.nodeType !== 1) return "";

        let tag = el.tagName.toLowerCase();
        // Use original className if available (captured before hover classes), otherwise current className
        const originalClass = el.getAttribute("data-original-class");
        const className = originalClass !== null ? originalClass : (el.className || "");
        let cls = className
          ? "." + className.trim().split(/\s+/).map(c => CSS.escape(c)).join(".")
          : "";

        // Build the base selector
        let selector = `${tag}${cls}`;

        // Check if element comes after div with widgetid="OASWSUPAPPSection-stc_tablist"
        const elDoc = el.ownerDocument || doc;
        
        // Check for tablist div in current document first
        let tablistDiv = elDoc.querySelector('div[widgetid="OASWSUPAPPSection-stc_tablist"]');
        let tablistDoc = elDoc;
        
        // If not found, also check main document (whether in iframe or not)
        if (!tablistDiv) {
          try {
            const mainDoc = window.top.document;
            if (mainDoc !== elDoc) {
              tablistDiv = mainDoc.querySelector('div[widgetid="OASWSUPAPPSection-stc_tablist"]');
              if (tablistDiv) {
                tablistDoc = mainDoc;
              }
            }
          } catch (e) {
            // Cross-origin iframe, ignore
          }
        }
        
        if (tablistDiv) {
          // Check if the selected element is a descendant of or comes after this div
          let currentEl = el;
          let isAfterTablist = false;
          
          // Check if element is descendant of tablist div (only if in same document)
          if (elDoc === tablistDoc) {
            while (currentEl && currentEl !== elDoc.body) {
              if (currentEl === tablistDiv) {
                isAfterTablist = true;
                break;
              }
              currentEl = currentEl.parentElement;
            }
            
            // If not descendant, check if element comes after tablist div in DOM
            if (!isAfterTablist && tablistDiv.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) {
              isAfterTablist = true;
            }
          } else {
            // Element is in iframe, tablist is in main document
            // Consider element as "after" tablist if tablist exists in main doc
            isAfterTablist = true;
          }
          
          if (isAfterTablist) {
            // Find the .tabLabel element with aria-selected="true" inside the tablist div
            const activeTabLabel = tablistDiv.querySelector('.tabLabel[aria-selected="true"]');
            
            if (activeTabLabel) {
              const elementTitle = activeTabLabel.getAttribute('title') || '';
              
              if (elementTitle) {
                const tabSelector = `.tabLabel[title="${CSS.escape(elementTitle)}"][aria-selected="true"]`;
                selector = `${selector} <<< ${tabSelector}`;
              }
            }
          }
        }

        return selector;
      }

      // Cleanup function
      function destroy(doc) {
        try {
          doc.body.style.cursor = "";
          doc.querySelectorAll("style[data-selector-style]").forEach(s => s.remove());
          doc.querySelectorAll("[data-selector-shadow]").forEach(el => el.style.boxShadow = "");
          doc.querySelectorAll("[data-original-class]").forEach(el => el.removeAttribute("data-original-class"));
          doc.removeEventListener("mouseenter", captureOriginalClass, true);
          doc.removeEventListener("mousedown", handleMouseDown, true);
          doc.removeEventListener("mouseup", handleMouseUp, true);
          doc.removeEventListener("mouseover", hoverIn);
          doc.removeEventListener("mouseout", hoverOut);
          if (doc._selectorObserver) {
            doc._selectorObserver.disconnect();
            delete doc._selectorObserver;
          }
          if (doc._classObserver) {
            doc._classObserver.disconnect();
            delete doc._classObserver;
          }
          // Clear iframe highlights in main document
          if (doc === document) {
            Array.from(document.querySelectorAll("iframe")).forEach(f => {
              f.style.boxShadow = "";
              try {
                if (f.contentDocument && f.contentDocument.documentElement) {
                  f.contentDocument.documentElement.style.boxShadow = "";
                }
              } catch (e) {
                // Cross-origin iframe, ignore
              }
            });
          }
        } catch (e) {
          console.warn("Cleanup failed:", e);
        }
      }

      // Attach event listeners
      // Use mouseenter with capture to catch className before hover effects
      doc.addEventListener("mouseenter", captureOriginalClass, true);
      doc.addEventListener("mouseover", hoverIn);
      doc.addEventListener("mouseout", hoverOut);
      doc.addEventListener("mousedown", handleMouseDown, true);
      doc.addEventListener("mouseup", handleMouseUp, true);
      window.addEventListener("message", e => {
        if (e.data === "__selector_cleanup__") destroy(doc);
      });
    }

    // Inject into main document
    inject(document);

    // Track iframe event listeners for cleanup
    const iframeHandlers = [];

    // Inject into all iframes
    Array.from(document.querySelectorAll("iframe")).forEach(f => {
      try {
        inject(f.contentDocument || f.contentWindow.document);
        
        const iframeMouseOver = () => {
          f.style.boxShadow = "";
          f.contentDocument.documentElement.style.boxShadow = "0 0 0 2px rgba(255,193,7,0.75), inset 0 0 0 9999px rgba(255,193,7,0.15)";
        };
        
        const iframeMouseOut = () => {
          f.contentDocument.documentElement.style.boxShadow = "";
        };
        
        f.contentDocument.documentElement.addEventListener("mouseover", iframeMouseOver);
        f.contentDocument.documentElement.addEventListener("mouseout", iframeMouseOut);
        
        // Store handlers for cleanup
        iframeHandlers.push({
          iframe: f,
          mouseover: iframeMouseOver,
          mouseout: iframeMouseOut,
          documentElement: f.contentDocument.documentElement
        });
      } catch (e) {
        console.warn("Cross-origin iframe skipped");
      }
    });

    // Cleanup iframe handlers when cleanup message is received
    const cleanupHandler = (e) => {
      if (e.data === "__selector_cleanup__") {
        iframeHandlers.forEach(handler => {
          try {
            handler.iframe.style.boxShadow = "";
            handler.documentElement.style.boxShadow = "";
            handler.documentElement.removeEventListener("mouseover", handler.mouseover);
            handler.documentElement.removeEventListener("mouseout", handler.mouseout);
          } catch (err) {
            // Ignore errors (e.g., iframe removed or cross-origin)
          }
        });
      }
    };
    
    window.addEventListener("message", cleanupHandler);
  });

  // Toggle listener
  const testToggle = modal.querySelector('#testModeToggle');
  testToggle.checked = loadStorageProp("testMode") || false;
  testToggle.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    saveToStorage("testMode", isChecked);
    usertour.enableUserTour();
  });

  // Option buttons example
  const optionButtons = modal.querySelectorAll('.button-list .custom-button');
  attachButtonAction(optionButtons[0], () => console.log('Option A clicked'));
  attachButtonAction(optionButtons[1], () => console.log('Option B clicked'));
  attachButtonAction(optionButtons[2], () => console.log('Option C clicked'));
})();