(() => {
  const STORAGE_KEY = 'ut-configurator';

  const loadStorageProp = (prop) => {
    const local = localStorage.getItem(STORAGE_KEY);
    const storage = JSON.parse(local) || {};
    return storage && storage[prop] ? storage[prop] : null;
  };

  const enableTestMode = () => {
    const testMode = loadStorageProp('testMode');

    const existingBanner = document.querySelector('.vertical-banner');
    if (existingBanner) existingBanner.remove();

    const existingStyle = document.querySelector('style[data-testmode-style]');
    if (existingStyle) existingStyle.remove();

    if (testMode) {
      const banner = document.createElement('div');
      banner.className = 'vertical-banner';
      banner.innerHTML = '<span class="vertical-text">Usertour Mode: Test</span>';

      const style = document.createElement('style');
      style.setAttribute('data-testmode-style', 'true');
      style.textContent = `
        body {
          padding-left: 15px!important;
        }
        .vertical-banner {
          width: 15px;
          height: 100%;
          background-color: rgb(255, 0, 90);
          display: flex;
          align-items: center;
          justify-content: center;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
        }
        .vertical-text {
          writing-mode: vertical-lr;
          text-orientation: mixed;
          color: white;
          font-size: 12px;
          font-weight: bold;
        }
      `;

      document.body.appendChild(style);
      document.body.appendChild(banner);
    }
  };

  const waitForUsertour = (callback, interval = 100, timeout = 5000) => {
    const start = Date.now();
    const check = () => {
      if (window.usertour && typeof window.usertour.init === 'function') {
        callback();
      } else if (Date.now() - start < timeout) {
        setTimeout(check, interval);
      } else {
        console.warn('Usertour object not ready after timeout');
      }
    };
    check();
  };

  waitForUsertour(() => {
    usertour.enableUserTour = (userData) => {
      const environment = loadStorageProp('testMode')
        ? window.USERTOURJS_ENV_VARS.ENVIRONMENT_TEST
        : window.USERTOURJS_ENV_VARS.ENVIRONMENT_LIVE;

      usertour.init(environment);
      const role = userData?.role
        || usertour._app?.userInfo?.data?.role
        || null;

      usertour.identifyAnonymous({ role });
      enableTestMode();
    };
  });
})();
