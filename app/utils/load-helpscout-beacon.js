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

    // Set up a MutationObserver to watch for the Beacon script
    const observer = new MutationObserver((mutations) => {
      const beaconScript = document.querySelector('script[src="https://beacon-v2.helpscout.net"]');
      if (beaconScript) {
        observer.disconnect();
        beaconScript.addEventListener('load', () => {
          setTimeout(() => {
            if (typeof window.Beacon === 'function') {
              resolve();
            } else {
              reject(new Error('Beacon API not available after script load'));
            }
          }, 100);
        });
        beaconScript.addEventListener('error', () => {
          reject(new Error('Failed to load Beacon script'));
        });
      }
    });

    // Start observing
    observer.observe(document.head, {
      childList: true,
      subtree: true
    });

    // Create and configure the initialization script
    const initScript = document.createElement('script');
    initScript.type = 'text/javascript';
    initScript.innerHTML = `
      !function(e,t,n){
        function a(){
          var e=t.getElementsByTagName("script")[0],
              n=t.createElement("script");
          n.type="text/javascript",
          n.async=!0,
          n.src="https://beacon-v2.helpscout.net",
          e.parentNode.insertBefore(n,e)
        }
        if(e.Beacon=n=function(t,n,a){
          e.Beacon.readyQueue.push({method:t,options:n,data:a})
        },
        n.readyQueue=[],
        "complete"===t.readyState)return a();
        e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)
      }(window,document,window.Beacon||function(){});
    `;

    // Append the script
    document.head.appendChild(initScript);
    console.log('script appended');

    // Add a timeout to prevent hanging
    setTimeout(() => {
      observer.disconnect();
      reject(new Error('Timeout waiting for Beacon script'));
    }, 10000); // 10 second timeout
  });
}