export function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${src}"]`);

    if (existingScript) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;

    script.onload = () => {
      resolve();
    };

    script.onerror = () => reject(new Error(`Failed to load script ${src}`));

    document.head.appendChild(script);
  });
}