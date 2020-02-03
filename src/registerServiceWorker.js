/* eslint-disable no-console */

import { register } from 'register-service-worker'

 

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered() {
      console.log('Service worker has been registered.');



      function showNotification() {
        Notification.requestPermission(function(result) {
          if (result === 'granted') {
            navigator.serviceWorker.ready.then(function(registration) {
              registration.showNotification('Vibration Sample', {
                body: 'Buzz! Buzz!',
                icon: '../images/touch/chrome-touch-icon-192x192.png',
                vibrate: [200, 100, 200, 100, 200, 100, 200],
                tag: 'vibration-sample'
              });
            });
          }
        });
      }
      
      showNotification();
         

    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('New content is downloading.')
    },
    updated() {
      var el = document.createElement("div");
      el.classList = "alert alert-primary";
      el.innerHTML = '<h1>Update!</h1>';
      el.onclick = function () {
        window.location.reload(true);
      };
      document.body.appendChild(el);
      console.log('New content is available; please refresh.')
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    }
  }) 

  


}
