// A script loader with lazy scripts loading to avoid unnecessary script loading in index.html
// Revealing module pattern is used for singleton-like behaviour
// default is exported so scripts will be shared when the instance is imported
const ScriptLoader = () => {
  const scriptsLoaded = new Map();
  const scriptsLoading = new Map();

  const loadScript = (src, options = {}) => {
    // Destructure options
    const {
      id = null,
      async = true,
      defer = true,
      onLoad = null,
      onError = null,
      attributes = {},
    } = options;

    // Return existing promise if script is currently loading
    if (scriptsLoading.has(src)) {
      return scriptsLoading.get(src);
    }

    // Return resolved promise if script is already loaded
    if (scriptsLoaded.has(src)) {
      return Promise.resolve();
    }

    // Create loading promise
    const loadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = async;
      script.defer = defer;

      if (id) script.id = id;

      // Add custom attributes
      Object.entries(attributes).forEach(([key, value]) => {
        script.setAttribute(key, value);
      });

      script.onload = () => {
        scriptsLoaded.set(src, true);
        scriptsLoading.delete(src);
        onLoad?.();
        resolve();
      };

      script.onerror = (error) => {
        scriptsLoading.delete(src);
        onError?.(error);
        reject(new Error(`Failed to load script: ${src}`));
      };

      document.head.appendChild(script);
    });

    scriptsLoading.set(src, loadingPromise);
    return loadingPromise;
  };

  return {
    loadScript,
  };
};

const scriptLoader = ScriptLoader();
export default scriptLoader;
