const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.etmscluster.3lqlpoe.mongodb.net",
  (err, records) => {
    console.log("ERROR:", err);
    console.log("RECORDS:", records);
  }
);