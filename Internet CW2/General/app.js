//------------------------------------- Variables -------------------------------------
const express = require('express');
const url = require('url')
const router = express.Router();
const app = express();

const cookieParser = require('cookie-parser')
const session = require('express-session')

const http = require('http')
const fs = require('fs')
const path = require('path')

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Client } = require('pg');
const connectionString = 'postgresql://groupbe:groupbe@cmp-19teach2.uea.ac.uk/groupbe'

const dir = __dirname + '/public'

//------------------------------------ Server setup ------------------------------------
app.use(express.static(dir));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(session({
    key: 1,
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
        rooms: [],
        checkin: new Date(),
        checkout: new Date(),
        numrooms: 0,
        rate: [],
        basket: { item: [] },
        customer: {}
    }
}))

app.listen(8000, () => {
    console.log('Routed app listening to port 8000!');
})

//----------------------------------- Link functions -----------------------------------
app.get('/', (req, res) => {
    res.sendFile(path.join(dir + '/index.html'));
})

app.get('/about', (req, res) => {
    res.sendFile(path.join(dir + '/about.html'));
})

app.get('/rooms', (req, res) => {
    res.sendFile(path.join(dir + '/rooms.html'));
})

app.get('/restaurant', (req, res) => {
    res.sendFile(path.join(dir + '/Restaurant.html'));
})

app.get('/contact', (req, res) => {
    res.sendFile(path.join(dir + '/contact.html'));
})

app.get('/housekeeping', (req, res) => {
    res.sendFile(path.join(dir + '/housekeeping.html'));
})

app.get('/roomList', (req, res) => {
    res.sendFile(path.join(dir + '/roomlist.html'));
})

app.get('/checkInReception', (req, res) => {
    res.sendFile(path.join(dir + '/checkin.html'));
})

app.get('/checkOutReception', (req, res) => {
    res.sendFile(path.join(dir + '/checkout.html'));
})

app.get('/bookingForm', (req, res) => {
    res.sendFile(path.join(dir + '/bookingform.html'))
})

app.get('/paymentForm', (req, res) => {
    res.sendFile(path.join(dir + '/roomlist.html'));
})

app.get('/gym', (req, res) => {
    res.sendFile(path.join(dir + '/Gym.html'));
})

app.get('/meetingRooms', (req, res) => {
    res.sendFile(path.join(dir + '/meetingrooms.html'));
})

app.get('/confirmation', (req, res) => {
    res.sendFile(path.join(dir + '/bookingform.html'))
})

//--------------------------------- Database functions ---------------------------------
app.get('/allRooms', (req, res) => {
    getAllRooms().then(data => {
        res.send(data);
    });
})

app.get('/checkedOut', (req, res) => {
    getCheckedOutRooms().then(data => {
        return res.send(data);
    });
})

app.post('/changeStatus', jsonParser, async(req, res) => {
    const data = req.body;
    const loop = async _ => {
        for (var i in data) {
            await changeStatus(data[i].r_status, data[i].r_no);
        }
    }
    await loop().then(_ => {
        res.redirect('/housekeeping');
    })

})


app.post('/getAvailableRooms', jsonParser, async(req, res) => {
    const checkInDate = req.body.b_checkIn;
    const checkOutDate = req.body.b_checkOut;
    const type = req.body.type;
    const rooms = req.body.rooms

    req.session.checkIn = checkInDate;
    req.session.checkOut = checkOutDate;
    req.session.numrooms = rooms;
    // console.log(checkInDate + " - " + checkOutDate + " : " + type);
    getAvailableRooms(checkInDate, checkOutDate, type).then(rooms => {
        req.session.rooms = rooms;
        return res.redirect('/roomList');
    });
})

app.post('/getAlternative', jsonParser, async(req, res) => {
    const data = req.body;
    var alt = {}
    getAvailableRooms(data.checkIn, data.checkOut, data.type).then(rooms => {
        alt.rooms = JSON.parse(rooms);
        getRate(alt.rooms[0].r_class).then(rate => {
            alt.rate = JSON.parse(rate);
            res.send(alt);
        })
    });
})

app.get('/listAvailableRooms', (req, res) => {
    sess = req.session

    rooms = JSON.parse(sess.rooms)

    getRate(rooms[0].r_class).then(rate => {
        var roomRate = JSON.parse(rate);
        sess.rate = roomRate;
        var data = {};
        data.rooms = rooms;
        data.checkIn = sess.checkIn;
        data.checkOut = sess.checkOut;
        data.rate = roomRate;
        data.numrooms = sess.numrooms;

        res.send(data);
    })
})

app.get('/getBookingDetails', (req, res) => {
    sess = req.session
    var data = {};
    data.checkIn = sess.checkIn;
    data.checkOut = sess.checkOut;
    data.numrooms = sess.numrooms;

    res.send(data);
})

app.post('/addToBasket', jsonParser, async(req, res) => {
    const data = req.body;
    if (req.session.basket) {
        var cart = req.session.basket
        cart['item'].push(data)
        req.session.basket = cart;
    } else {
        req.session.basket = { item: [data] };
    }
    // console.log(req.session.basket)
    res.send(req.session.basket);
})

app.post('/removeFromBasket', jsonParser, async(req, res) => {
    const data = req.body;
    var cart = req.session.basket
    cart['item'] = cart['item'].filter(item => item.roomNo != data.roomNo)

    req.session.basket = cart;
    // console.log(req.session.basket)
    res.send(req.session.basket);
})

app.get('/basketData', (req, res) => {
    sess = req.session;
    data = {}
    data.checkIn = sess.checkIn;
    data.checkOut = sess.checkOut;
    data.basket = sess.basket;
    res.send(data)
})

app.post('/getBookingByRef', jsonParser, async(req, res) => {
    const data = req.body
    getBookingByRef(data.b_ref).then(booking => {
        res.send(booking)
    })
})

app.post('/getBookingByName', jsonParser, async(req, res) => {
    const data = req.body
    getBookingByName(data.custName, data.checkIn, data.checkOut).then(booking => {
        console.log(booking)
        res.send(booking)
    })
})

app.post('/goToPayment', jsonParser, async(req, res) => {
    const data = {};
    data.name = req.body.name;
    data.email = req.body.email;
    data.phone = req.body.phone;
    data.address = req.body.hono + " " + req.body.street + ", " + req.body.city +
        ", " + req.body.country + ", " + req.body.postcode;
    sess = req.session;
    sess.customer = JSON.stringify(data);
    res.sendFile(path.join(dir + '/paymentform.html'))
})

app.post('/completeBooking', jsonParser, async(req, res) => {
    const card_type = req.body.cardtype
    const card_no = req.body.cardno
    var card_exp = req.body.cexdate
    const notes = req.body.notes
    const basket = req.session.basket
    var cus_no;
    var total = 0;
    const checkIn = req.session.checkIn;
    const checkOut = req.session.checkOut;

    card_exp = card_exp.substr(-2) + "/" + card_exp.substr(2, 2)

    const cus = JSON.parse(req.session.customer);
    addNewCustomer(cus.name, cus.email, cus.address, card_type, card_exp, card_no).then(_ => {
        customerDetails(cus.name, cus.email).then(customer => {
            var data = JSON.parse(customer)
            cus_no = data[0].c_no;
            for (i = 0; i < basket.item.length; i++) {
                total = total + parseFloat(basket.item[i].price);
            }
            createNewBooking(cus_no, total, notes).then(_ => {
                getBookingRef(cus_no, total).then(b_ref => {
                    data = JSON.parse(b_ref)
                    const createBooking = async _ => {
                        for (i = 0; i < basket.item.length; i++) {
                            console.log(checkIn + " " + checkOut)
                            await createRoomBookings(basket.item[i].roomNo, data[0].b_ref, checkIn, checkOut)
                        }
                    }
                    createBooking().then(_ => {
                        res.redirect("/confirmation")
                    })
                })
            })
        })
    })
})
app.get('/checkIn', (req, res) => {
    checkIn(C, data.b_ref).then(data => {
        return res.send(data);
    });
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

    const query = 'SELECT price FROM rates where r_class=$1 LIMIT 1'
    const values = [roomCode]
    const res1 = await client.query(query, values);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    // console.log(json_str_new);
    return json_str_new;
}

//----------------------------------- Customer Details -----------------------------------
async function getAvailableRooms(checkIn, checkOut, roomType) {
    client = await setUpDatabase();

    query = 'SELECT room.r_no, room.r_class FROM room LEFT JOIN (SELECT room.r_no, room.r_class ' +
        'FROM room JOIN roombooking ON roombooking.r_no = room.r_no ' +
        'WHERE ((roombooking.checkin <= $1 AND roombooking.checkout > $1) ' +
        'OR (roombooking.checkin < $2 AND roombooking.checkout >= $2))) ' +
        'AS r ON room.r_no = r.r_no WHERE r.r_no IS NULL AND room.r_class = $3'
    var values = [checkIn, checkOut, roomType];
    const res1 = await client.query(query, values);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    // console.log(json)
    return json_str_new
}

async function bookRoomExistingCustomer(b_ref, customer_name, email, checkIn, checkOut, roomNo) {
    client = await setUpDatabase();

    query = 'INSERT INTO roombooking '
    var values = [checkIn, checkOut, roomType];
    const res1 = await client.query(query, values);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    // console.log(json);
    return json_str_new
}

async function addNewCustomer(c_name, c_email, c_add, card_type, card_expiry, card_no) {
    client = await setUpDatabase();

    query = 'INSERT INTO customer(c_name, c_email, c_address, c_cardtype, c_cardexp, c_cardno) ' +
        'VALUES ($1, $2, $3, $4, $5, $6)'
    var values = [c_name, c_email, c_add, card_type, card_expiry, card_no];
    var res = await client.query(query, values)

    await client.end();

    json = res.rows;
    var json_str_new = JSON.stringify(json);
    // console.log(json);
    return json_str_new
}

async function createNewBooking(c_no, cost, notes) {
    client = await setUpDatabase();

    query = 'INSERT INTO booking(c_no, b_cost, b_outstanding, b_notes) ' +
        'VALUES ($1, $2, $2, $3)'
    var values = [c_no, cost, notes];
    var res = await client.query(query, values)

    await client.end();

    json = res.rows;
    var json_str_new = JSON.stringify(json);
    // console.log(json);
    return json_str_new
}

async function getBookingRef(c_no, cost) {
    client = await setUpDatabase();

    query = 'SELECT b_ref FROM booking WHERE c_no=$1 AND b_cost=$2 ORDER BY b_ref DESC'
    var values = [c_no, cost];
    var res = await client.query(query, values);

    await client.end();

    json = res.rows;
    var json_str_new = JSON.stringify(json);
    // console.log(json);
    return json_str_new
}



async function createRoomBookings(r_no, b_ref, checkIn, checkOut) {
    client = await setUpDatabase();

    query = 'INSERT INTO roombooking VALUES ($1, $2, $3, $4)'
    var values = [r_no, b_ref, checkIn, checkOut];
    var res = await client.query(query, values)

    await client.end();

    json = res.rows;
    var json_str_new = JSON.stringify(json);
    // console.log(json);
    return json_str_new
}

async function customerDetails(customer_name, email) {
    client = await setUpDatabase();

    query = 'SELECT * FROM customer WHERE c_name = $1 AND c_email = $2'
    var values = [customer_name, email];
    const res1 = await client.query(query, values);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    // console.log(json);
    return json_str_new
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
    // console.log(json);
    return json_str_new
}

async function getBookingByRef(bookingRef) {
    client = await setUpDatabase();

    var query = 'SELECT cust.c_name,  b.b_ref, rb.checkin, rb.checkout, ' +
        'FROM customer cust JOIN booking b ON cust.c_no = b.c_no JOIN roombooking rb ON b.b_ref = rb.b_ref ' +
        'WHERE b.b_ref = $1 ';
    var values = [bookingRef];
    const res1 = await client.query(query, values);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    // console.log(json);
    return json_str_new
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

    query = 'SELECT * FROM room ORDER BY r_no';
    const res1 = await client.query(query);

    await client.end();

    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    // console.log(json);
    return json_str_new;
}

async function getCheckedOutRooms() {
    var json;
    client = await setUpDatabase()
        .then(client => {
            query = 'SELECT * FROM room WHERE r_status = $1';
            values = ['C']
            return client.query(query, values).then(res => {
                client.end();
                json = res.rows;
            })
        })
        .catch(err => {
            console.log(err)
        })
    var json_str_new = JSON.stringify(json);
    // console.log(json);
    return json_str_new;
}

async function changeStatus(status, roomNo) {
    client = await setUpDatabase()
        .then(async client => {
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

// viewPayments('Ann Hinchcliffe', '2019-01-16')res.sendFile('/index.html')