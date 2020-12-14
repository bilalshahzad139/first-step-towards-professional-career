var mysql = require('mysql');
const http = require('http');

var con = mysql.createConnection({
  //host: "localhost",
  //host: "172.17.0.3",
  host: "mytestsql_net",
  user: "root",
  password: "123",
  insecureAuth : true,
  database: 'mytestdb'
});

const requestListener = function (req, res) {
  
  if(con.state === 'disconnected'){
    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      getData();
    });
  }
  else {
    getData();
  }
    

    res.writeHead(200);
    
    res.end('Hello, World!');
}

function getData(){
  con.query('SELECT * FROM mytable ', function(err, result)
  {
      console.log(err,result, new Date());
  });
}
const server = http.createServer(requestListener);
server.listen(8080);