//------------------------------------- Variables -------------------------------------
const express = require('express');
const router = express.Router();
const app = express();

const http = require('http')
const fs = require('fs')
const path = require('path')

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Client } = require('pg');
const connectionString = 'postgresql://groupbe:groupbe@cmp-19teach2.uea.ac.uk/groupbe'

const dir = __dirname + '/public'

//------------------------------------ Server setup ------------------------------------
app.use(express.static('./public'));
app.listen(8000, () => {
    console.log('Routed app listening to port 8000!');
})

//--------------------------------- Database functions ---------------------------------
app.get('/allRooms', (req, res) => {
    getAllRooms().then(data => {
        res.send(data);
    });
})

app.get('/checkedOut', (req, res) => {
    getCheckedOutRooms().then(data => {
        res.send(data);
    });
})

app.post('/changeStatus', jsonParser, async(req, res) => {
    const data = req.body;
    for (var i in data) {
        await changeStatus(data[i].r_status, data[i].r_no);
    }
    res.sendFile('/public/index.html', { root: __dirname });
})

//----------------------------------- Database setup -----------------------------------

async function setUpDatabase() {
    const client = new Client({ connectionString: connectionString });
    await client.connect();
    await client.query('SET search_path to hotelbooking')
    return client;
}

//----------------------------------- Cleaner queries -----------------------------------
async function getAllRooms() {
    client = await setUpDatabase();

    query = 'SELECT * FROM room ORDER BY r_no';
    const res1 = await client.query(query);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    // console.log(json);
    return json_str_new;
}

async function getCheckedOutRooms() {
    client = await setUpDatabase();

    query = 'SELECT * FROM room WHERE r_status = $1';
    values = ['C']
    const res1 = await client.query(query, values);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    // console.log(json);
    return json_str_new;
}

async function changeStatus(status, roomNo) {
    client = await setUpDatabase()
        .then(client => {
            query = 'UPDATE room SET r_status = $1 WHERE r_no = $2';
            values = [status, roomNo]
            return client.query(query, values)
                .then(res => {
                    return client.end();
                })
                .catch(err => {
                    console.log(err)
                });
        })
        .catch(err => {
            console.log(err)
        });
}