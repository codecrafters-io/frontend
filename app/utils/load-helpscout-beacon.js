export function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${src}"]`);

    if (existingScript) {
      if (typeof window.Beacon === 'function') {
        resolve();
      } else {
        existingScript.addEventListener('load', resolve);
        existingScript.addEventListener('error', reject);
      }
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.text = `!function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});`;

    script.onload = () => {
      if (typeof window.Beacon === 'function') {
        resolve();
      } else {
        reject(new Error('Beacon API not available after script load'));
      }
    };

    script.onerror = () => reject(new Error(`Failed to load script for Helpscout Beacon`));

    document.head.appendChild(script);
  });
}