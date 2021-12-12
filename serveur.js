const express = require('express')
const fetch = require('node-fetch');
var cors = require('cors')
const app = express()
var ipcalc = require("./cal.js");
const PORT = process.env.PORT || 5000;

app.use(cors())

app.use(express.static('public'));

app.get('/api/:ipmask', async (request, response) => {
  console.log(request.params);
  const ipmask = request.params.ipmask;
  var ip_data = ipcalc.ret(ipmask);

  response.send(ip_data);
});


app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})
