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
app.get('/', (req, res) => {
    res.sendFile('/public/index.html', { root: __dirname })
})

app.get('/checkedOut', (req, res) => {
    getAllRooms().then(data => {
        res.send(data);
    });
})

app.post('/changeStatus', jsonParser, async(req, res) => {
    const data = req.body;
    for (var i in data) {
        await changeStatus(data[i].r_status, data[i].r_no);
    }
    res.sendFile('/public/Housekeeping.html', { root: __dirname });
})

//----------------------------------- Database setup -----------------------------------

async function setUpDatabase() {
    const client = new Client({ connectionString: connectionString });
    await client.connect();
    await client.query('SET search_path to hotelbooking')
    return client;
}


//----------------------------------- General queries -----------------------------------
async function showAllBooking() {
    client = await setUpDatabase();

    const res1 = await client.query('SELECT * FROM booking');

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json_str_new);

}

async function showAllRates() {
    client = await setUpDatabase();

    const res1 = await client.query('SELECT * FROM rates');

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json_str_new);
}

async function getRate(roomCode) {
    client = await setUpDatabase();

    const query = 'SELECT price FROM rates where r_class=$1'
    const values = [roomCode]
    const res1 = await client.query(query, values);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json_str_new);
}

//----------------------------------- Customer Details -----------------------------------
async function getAvailableRooms(checkIn, checkOut, roomType) {
    client = await setUpDatabase();

    query = 'SELECT room.r_no FROM room LEFT JOIN (SELECT room.r_no, room.r_class ' +
        'FROM room JOIN roombooking ON roombooking.r_no = room.r_no ' +
        'WHERE ((roombooking.checkin <= $1 AND roombooking.checkout > $1) ' +
        'OR (roombooking.checkin < $2 AND roombooking.checkout >= $2))) ' +
        'AS r ON room.r_no = r.r_no WHERE r.r_no IS NULL AND room.r_class = $3'
    var values = [checkIn, checkOut, roomType];
    const res1 = await client.query(query, values);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json);
}

async function bookRoomExistingCustomer(b_ref, customer_name, email, checkIn, checkOut, roomNo) {
    client = await setUpDatabase();

    query = 'INSERT INTO roombooking '
    var values = [checkIn, checkOut, roomType];
    const res1 = await client.query(query, values);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json);
}

async function customerDetails(customer_name, email) {
    client = await setUpDatabase();

    query = 'SELECT * FROM customer WHERE c_name = $1 AND c_email = $2'
    var values = [customer_name, email];
    const res1 = await client.query(query, values);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json);
}

//----------------------------------- Reception queries -----------------------------------
async function getBookingByName(custName, checkIn, checkOut) {
    client = await setUpDatabase();

    query = 'SELECT cust.c_name,  b.b_ref, rb.checkin, rb.checkout ' +
        'FROM customer cust JOIN booking b ON cust.c_no = b.c_no JOIN roombooking rb ON b.b_ref = rb.b_ref ' +
        'WHERE cust.c_name = $1 AND rb.checkin = $2 AND rb.checkout = $3'
    var values = [custName, checkIn, checkOut];
    const res1 = await client.query(query, values);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json);
}

async function getBookingByRef(bookingRef) {
    client = await setUpDatabase();

    var query = 'SELECT cust.c_name,  b.b_ref, rb.checkin, rb.checkout ' +
        'FROM customer cust JOIN booking b ON cust.c_no = b.c_no JOIN roombooking rb ON b.b_ref = rb.b_ref ' +
        'WHERE b.b_ref = $1 ';
    var values = [bookingRef];
    const res1 = await client.query(query, values);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json);
}

async function getRoomStatus() {
    client = await setUpDatabase();

    var query = 'SELECT * FROM room';
    const res1 = await client.query(query);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json);
}

async function checkIn(status, booking_ref) {
    client = await setUpDatabase();

    var query = 'UPDATE room SET r_status = $1 WHERE r_no = ' +
        '(SELECT r_no FROM roombooking WHERE b_ref = $2)';
    var values = [status, booking_ref]
    const res1 = await client.query(query, values);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json);
}

async function checkOut(status, booking_ref, payments) {
    client = await setUpDatabase();

    var query = 'UPDATE room SET r_status = $1 WHERE r_no = ' +
        '(SELECT r_no FROM roombooking WHERE b_ref = $2)';
    var values = [status, booking_ref]
    const res1 = await client.query(query, values).then(rows => {
        query = 'UPDATE booking SET b_outstanding = (SELECT b_outstanding FROM booking WHERE b_ref = $1) ' +
            '- $2 WHERE b_ref = $1'
        values = [booking_ref, payments]
        return client.query(query, values);
    })

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json);
}

async function checkOutByRoom(status, room_no, checkOut, payment) {
    client = await setUpDatabase();

    var query = 'UPDATE room SET r_status = $1 WHERE r_no = $2';
    var values = [status, room_no]
    const res1 = await client.query(query, values).then(rows => {
        query = 'UPDATE booking SET b_outstanding = (SELECT b_outstanding ' +
            'FROM booking b JOIN roombooking r ON b.b_ref = r.b_ref WHERE r.r_no = $1 AND r.checkout = $2)' +
            ' - $3 WHERE b_ref = (SELECT r.b_ref FROM booking b JOIN roombooking r ON b.b_ref = r.b_ref ' +
            'WHERE r.r_no = $1 AND r.checkout = $2)'
        values = [room_no, checkOut, payment]
        return client.query(query, values);
    })

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json);
}

async function getPaymentType(customer_Name) {
    client = await setUpDatabase();

    var query = 'SELECT c_cardtype, c_cardexp, c_cardno FROM customer WHERE c_name = $1'
    var values = [customer_Name]
    const res1 = await client.query(query, values);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json);
}

async function viewPayments(customer_name, checkOut) {
    client = await setUpDatabase();

    var query = 'SELECT cust.c_name, cust.c_address, cust.c_cardtype, cust.c_cardexp, ' +
        'cust.c_cardno, b.b_cost, b.b_outstanding, rb.checkin, rb.checkout, rb.r_no ' +
        'FROM customer cust JOIN booking b ON cust.c_no = b.c_no JOIN roombooking rb ON b.b_ref = rb.b_ref ' +
        'WHERE cust.c_name = $1 AND rb.checkout = $2 '
    var values = [customer_name, checkOut]
    const res1 = await client.query(query, values);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json_str_new);
}

//----------------------------------- Cleaner queries -----------------------------------
async function getAllRooms() {
    client = await setUpDatabase();

    query = 'SELECT * FROM room';
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
    client = await setUpDatabase().then(client => {
        query = 'UPDATE room SET r_status = $1 WHERE r_no = $2';
        values = [status, roomNo]
        return client.query(query, values).then(res => {
            return client.end();
        })
    });
}


//----------------------------------- Testing -----------------------------------
// showAllBooking();
// showAllRates();
// getRate('std_t');

// customerDetails('Ann Hinchcliffe', 'Ann.Hinchcliffe@yahoo.com')

// getAvailableRooms('2019-01-01', '2019-02-01', 'sup_d');
// getBookingByName("Danny Keenan", '2019-02-02', '2019-02-04');
// getBookingByRef(13011)
// getRoomStatus()
// getCheckedOutRooms()
// changeStatus('A', 101);
// checkIn(13011)
// checkOut('C', 13011, 60)
// checkOutByRoom('C', 101, '2019-01-31', 60)
// getPaymentType('Danny Keenan')

// viewPayments('Ann Hinchcliffe', '2019-01-16')