export function loadScript(src) {
  return new Promise((resolve, reject) => {
    console.log('loadScript');
    const existingScript = document.querySelector('script[src="https://beacon-v2.helpscout.net"]');

    if (existingScript) {
      if (typeof window.Beacon === 'function') {
        resolve();
      } else {
        existingScript.addEventListener('load', resolve);
        existingScript.addEventListener('error', reject);
      }
      return;
    }

    // Create and configure the initialization script
    const initScript = document.createElement('script');
    initScript.type = 'text/javascript';
    initScript.innerHTML = `window.Beacon = function(method, options, data) { 
      window.Beacon.readyQueue = window.Beacon.readyQueue || [];
      window.Beacon.readyQueue.push({ method: method, options: options, data: data }); 
    };`;
    document.head.appendChild(initScript);

    // Create and configure the main Beacon script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://beacon-v2.helpscout.net';

    script.onload = () => {
      console.log('script.onload');
      // Add a longer delay to ensure Beacon is initialized
      setTimeout(() => {
        if (typeof window.Beacon === 'function') {
          resolve();
        } else {
          reject(new Error('Beacon API not available after script load'));
        }
      }, 500); // Increased timeout to 500ms
    };

    script.onerror = () => {
      console.log('script.onerror');
      reject(new Error(`Failed to load script for Helpscout Beacon`));
    };

    // Append the script
    document.head.appendChild(script);
    console.log('script appended');
  });
}