export function loadBeaconScript() {
  return new Promise((resolve) => {
    (function (window, document, Beacon) {
      function loadBeaconScript() {
        var firstScript = document.getElementsByTagName('script')[0];
        var beaconScript = document.createElement('script');
        beaconScript.type = 'text/javascript';
        beaconScript.async = true;
        beaconScript.src = 'https://beacon-v2.helpscout.net';
        firstScript.parentNode.insertBefore(beaconScript, firstScript);
        beaconScript.onload = resolve;
      }

      if (
        ((window.Beacon = Beacon =
          function (method, options, data) {
            window.Beacon.readyQueue.push({ method, options, data });
          }),
        (Beacon.readyQueue = []),
        document.readyState === 'complete')
      ) {
        return loadBeaconScript();
      }

      if (window.attachEvent) {
        window.attachEvent('onload', loadBeaconScript);
      } else {
        window.addEventListener('load', loadBeaconScript, false);
      }
    })(window, document, window.Beacon || function () {});

    window.Beacon('init', 'bb089ae9-a4ae-4114-8f7a-b660f6310158');
  });
}
