const express = require('express')
const app = express()
const port = process.env.PORT || 4040;
const cors = require('cors')
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });


const getUrlStats = (url) => {
  nightmare
    .goto(url)
    .evaluate( () => {
      return {  navStart: window.performance.timing.navigationStart,
                loadEventEnd: window.performance.timing.loadEventEnd,
                requestStart: window.performance.timing.requestStart,
                responseStart: window.performance.timing.responseStart,
                pageSize: window.performance.memory.usedJSHeapSize
              }
    })
    .end()
    .then(res => {
      console.log(`TTFB: ${(res.responseStart - res.requestStart)/1000} seconds`)
      console.log(`Page load time: ${(res.loadEventEnd - res.navStart)/1000} seconds`)
      console.log(`Page size: ${(res.pageSize)/10000000} MB`)
      return res
    })
    .catch( e => {
      console.error('Search failed:', e);
    });
}

getUrlStats('http://www.hikarl.com')

// allow cross origin sharing
app.use(cors())

app.get('/getstats/:url', (req, res) => {
  res.send(getUrlStats(req.params.url))
  console.log(`url to analyze: ${req.params.url} ...`)
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
