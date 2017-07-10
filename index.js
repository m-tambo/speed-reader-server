const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });

nightmare
  .goto('http://www.invivolink.com')
  .evaluate( () => {
    return {  start: window.performance.timing.navigationStart,
              end: window.performance.timing.loadEventEnd
            }
  })
  .end()
  .then(res => {
    console.log(res)
  })
  .catch( e => {
    console.error('Search failed:', e);
  });
