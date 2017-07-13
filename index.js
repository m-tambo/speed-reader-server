const express = require('express')
const app = express()
const port = process.env.PORT || 4040;
const cors = require('cors')
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const expressValidator = require('express-validator')


// allow cross origin sharing
app.use(cors())

app.get('/getstats/:url', (req, res) => {
  nightmare
    .goto(`http://${req.params.url}`)
    .evaluate( () => {
      return {  navStart: window.performance.timing.navigationStart,
                loadEventEnd: window.performance.timing.loadEventEnd,
                requestStart: window.performance.timing.requestStart,
                responseStart: window.performance.timing.responseStart,
                pageSize: window.performance.memory.usedJSHeapSize
              }
    })
    .end()
    .then( data => {
      console.log(`data returned: ${data.pageSize}`)
      res.status(200).json(data)
    })
    .catch( e => {
      console.error('Search failed:', e);
    });
  console.log(`url analyzed: ${req.params.url} ...`)
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});


// TODO refctor into stand-alone async/await
// const getUrlStats = (url) => {
//   nightmare
//     .goto(url)
//     .evaluate( () => {
//       return {  navStart: window.performance.timing.navigationStart,
//                 loadEventEnd: window.performance.timing.loadEventEnd,
//                 requestStart: window.performance.timing.requestStart,
//                 responseStart: window.performance.timing.responseStart,
//                 pageSize: window.performance.memory.usedJSHeapSize
//               }
//     })
//     .end()
//     .then(res => {
//       console.log(`TTFB: ${(res.responseStart - res.requestStart)/1000} seconds`)
//       console.log(`Page load time: ${(res.loadEventEnd - res.navStart)/1000} seconds`)
//       console.log(`Page size: ${(res.pageSize)/10000000} MB`)
//       return res
//     })
//     .catch( e => {
//       console.error('Search failed:', e);
//     });
// }
//
// getUrlStats('http://www.hikarl.com')
