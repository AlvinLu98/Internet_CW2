const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

var connect = require("connect");

var app = connect.createServer().use(connect.static('U:\Documents\GitHub\Internet_CW2' + '/public'));

app.listen(8104);

// we will learn this later -- it starts a simple web server
app.use(express.static('public'));

app.get('/get_form', function (req, res) {
  const queryParams = req.query;
  console.log(queryParams);

  logger(queryParams); // log the submission to database

  // return the submitted information
  var json_str_new = JSON.stringify(queryParams);
  console.log(json_str_new);
  res.send(json_str_new);
    
});

app.post('/get_form2', jsonParser, function (req, res) {
  const body = req.body;
  console.log(body);

  logger(body);

  // return the submitted information
  var json_str_new = JSON.stringify(body);
    // TODO (0.3) use body-parser (jsonParser) to receive transmitted data via POST body
  // TODO (0.5) call the function logger(obj) to store the received form data object
  // TODO (0.3) return the received form dat object as a json string back to the client
  // hint: modify the below line.
  console.log(json_str_new);
  res.send(json_str_new);
});

app.get('/show_all', async function (req, res) {
    var json = await show_all();
    res.send(json);
})

app.listen(8104, function () {
  console.log('Routed app listening on port 8104!');
});

async function logger(obj) {
 
    const client = new Client({
      connectionString: connectionString,
    });
    await client.connect();
    

    const text = 'INSERT INTO people(name, school, course, adviser) VALUES($1, $2, $3, $4) RETURNING *';
    const values = [obj.studentName, obj.school, obj.course, obj.adviser];


    const res1 = await client.query(text, values);

    await client.end();

}

async function show_all() {

   const client = new Client({
      connectionString: connectionString,
    });
    await client.connect(); // create a database connection
    
    const res2 = await client.query('SELECT * FROM people');
    await client.end(); // close the connection
    json = res2.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json_str_new);

    return json_str_new;
}
