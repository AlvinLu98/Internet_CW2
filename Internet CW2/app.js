const Booking = require('./Booking');


// const Booking1 = new Booking(13011, 12146, 130.00, 130.00, ' ');
// console.log(`Customer paid ${Booking1.calculateAmountPaid()}`);
// Booking1.toString();


const Logger = require('./Reference/logger');
// const logger = new Logger();
// logger.on('message', (data) => console.log('Called Listener:', data));
// logger.log('Hello world');

const express = require('express');
const router = express.Router();
const app = express();

// app.use(express.static('public'));
// app.listen(8104, function() {
//     console.log('Routed ap listening to port 8104!');
// })

// app.get('/', function(req, res) {
//     res.send('index')
// })

//----------------------------------- Database stuff -----------------------------------
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Client } = require('pg');
const connectionString = 'postgresql://groupbe:groupbe@cmp-19teach2.uea.ac.uk/groupbe'

const client = new Client({ connectionString: connectionString });
client.query('SET search_path to hotelbooking');

//----------------------------------- General queries -----------------------------------
async function showAllBooking() {
    await client.connect();

    const res1 = await client.query('SELECT * FROM booking');

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json_str_new);

}

async function showAllRates() {
    await client.connect();

    const res1 = await client.query('SELECT * FROM rates');

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json_str_new);
}

async function getRate(roomCode) {
    await client.connect();

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
    await client.connect();

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
    await client.connect();

    query = 'INSERT INTO roombooking '
    var values = [checkIn, checkOut, roomType];
    const res1 = await client.query(query, values);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json);
}

async function customerDetails(customer_name, email) {
    await client.connect();

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
    await client.connect();

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
    await client.connect();

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
    await client.connect();

    var query = 'SELECT * FROM room';
    const res1 = await client.query(query);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json);
}

async function checkIn(status, booking_ref) {
    await client.connect();

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
    await client.connect();

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
    await client.connect();

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
    await client.connect();

    var query = 'SELECT c_cardtype, c_cardexp, c_cardno FROM customer WHERE c_name = $1'
    var values = [customer_Name]
    const res1 = await client.query(query, values);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json);
}

async function viewPayments(customer_name, checkOut) {
    await client.connect();

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
async function getCheckedOutRooms() {
    await client.connect();

    query = 'SELECT * FROM room WHERE r_status = $1';
    values = ['C']
    const res1 = await client.query(query, values);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json);
}

async function changeStatus(status, roomNo) {
    await client.connect();

    query = 'UPDATE room SET r_status = $1 WHERE r_no = $2';
    values = [status, roomNo]
    const res1 = await client.query(query, values);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    console.log(json);
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