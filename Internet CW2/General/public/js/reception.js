function saveRoomForm() {

    // create an empty object
    var receptionData = {}; // showing elements added dynamically
    receptionData.r_no = $('#roomNo').val(); //get booking ref
    return receptionData
}

function saveRefForm() {

    // create an empty object
    var receptionData = {}; // showing elements added dynamically
    receptionData.b_ref = $('#b_ref').val(); //get booking ref
    receptionData.email = $('#r_email').val(); //get booking ref
    return receptionData
}

function saveNameForm() {

    // create an empty object
    var receptionData = {}; // showing elements added dynamically
    receptionData.custName = $('#cName').val(); //get customer name
    receptionData.email = $('#email').val(); //get customer name
    receptionData.checkIn = $('#cidate').val(); //get check-in date
    receptionData.checkOut = $('#codate').val(); //  get check-out date
    return receptionData
}

// submit data for storage using the POST method
function send_post_checkIn(path, data) {
    fetch(path, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        res.json().then(checkInData)
    })
};

function send_post_checkOutRoom(path, data) {
    fetch(path, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        res.json().then(checkOutDataRoom)
    })
};

function send_post_receptionDataCI(path, data) {
    fetch(path, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        res.json().then(receptionDataCI)
    })
};

function send_post_receptionDataCO(path, data) {
    fetch(path, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        res.json().then(receptionDataCO)
    })
};

function clearData() {
    $('#b_ref').val("");
    $('#room').val("");
    $('#cName').val("");
    $('#r_email').val("");
    $('#email').val("");
    $('#cidate').val("");
    $('#codate').val("");

    $('#c_booking_title').empty()
    $('#c_booking').empty()
    $('#c_rooms').empty()
    $('#c_button').empty()
    $('#room_container_title').empty()
}

function checkOutDataRoom(data) {
    clearData();
    room = JSON.parse(data.room)
    $('#room_container_title').append("<h4>Room</h4>")
    $('#c_rooms').append("<tr><th>no</th><th>type</th><th>status</th><th>notes</th></tr>")
    row = "<tr><td>" + room[0].r_no + "</td>" +
        "<td>" + room[0].r_class + "</td>" +
        "<td>" + room[0].r_status + "</td>" +
        "<td>" + room[0].r_notes + "</td></tr>";
    $('#c_rooms').append(row)
    $('#c_button').append('<form><input type="submit" onclick="checkOutRoom()" value="Check Out" /></form>')
}

function receptionDataCI(data) {
    clearData();
    $('#c_booking_title').append("<h4>Customer details</h4>")
    rows = "<tr><td>Booking ref: </td><td>" + data.cust[0].b_ref + "</td></tr>" +
        "<tr><td>Name: </td><td>" + data.cust[0].c_name + "</td></tr>" +
        "<tr><td>Email: </td><td>" + data.details[0].c_email + "</td></tr>" +
        "<tr><td>Check in: </td><td>" + data.cust[0].checkin.substr(0, 10) + "</td></tr>" +
        "<tr><td>Check out: </td><td>" + data.cust[0].checkout.substr(0, 10) + "</td></tr>" +
        ">tr></tr><tr><td>Card no: </td><td>" + data.details[0].c_cardno + "</td></tr>" +
        "<tr><td>Card type: </td><td>" + data.details[0].c_cardtype + "</td></tr>" +
        "<tr><td>Card expiry: </td><td>" + data.details[0].c_cardexp + "</td></tr>" +
        "<tr><td>Cost: </td><td>" + data.details[0].b_cost + "</td></tr>" +
        "<tr><td>Outstanding: </td><td>" + data.details[0].b_cost + "</td></tr>";
    $('#c_booking').append(rows)
    $('#room_container_title').append("<h4>Rooms</h4>")
    $('#c_rooms').append("<tr><th>no</th><th>type</th><th>status</th><th>notes</th></tr>")
    $.each(data.rooms, (i, room) => {
        row = "<tr><td>" + room.r_no + "</td>" +
            "<td>" + room.r_class + "</td>" +
            "<td>" + room.r_status + "</td>" +
            "<td>" + room.r_notes + "</td></tr>";
        $('#c_rooms').append(row)
    })
    $('#c_button').append('<input type="submit" onclick="checkIn()" value="Check In" />');
}

function receptionDataCO(data) {
    clearData();
    $('#c_booking_title').append("<h4>Customer details</h4>")
    rows = "<tr><td>Booking ref: </td><td>" + data.cust[0].b_ref + "</td></tr>" +
        "<tr><td>Name: </td><td>" + data.cust[0].c_name + "</td></tr>" +
        "<tr><td>Email: </td><td>" + data.details[0].c_email + "</td></tr>" +
        "<tr><td>Check in: </td><td>" + data.cust[0].checkin.substr(0, 10) + "</td></tr>" +
        "<tr><td>Check out: </td><td>" + data.cust[0].checkout.substr(0, 10) + "</td></tr>" +
        ">tr></tr><tr><td>Card no: </td><td>" + data.details[0].c_cardno + "</td></tr>" +
        "<tr><td>Card type: </td><td>" + data.details[0].c_cardtype + "</td></tr>" +
        "<tr><td>Card expiry: </td><td>" + data.details[0].c_cardexp + "</td></tr>" +
        "<tr><td>Cost: </td><td>" + data.details[0].b_cost + "</td></tr>" +
        "<tr><td>Outstanding: </td><td>" + data.details[0].b_cost + "</td></tr>";
    $('#c_booking').append(rows)
    $('#room_container_title').append("<h4>Rooms</h4>")
    $('#c_rooms').append("<tr><th>no</th><th>type</th><th>status</th><th>notes</th></tr>")
    $.each(data.rooms, (i, room) => {
        row = "<tr><td>" + room.r_no + "</td>" +
            "<td>" + room.r_class + "</td>" +
            "<td>" + room.r_status + "</td>" +
            "<td>" + room.r_notes + "</td></tr>";
        $('#c_rooms').append(row)
    })
    $('#c_button').append('<div class="row"> <div class="col-25"> <label for="cname">Payment</label>' +
        '</div> <div class="col-75"> <input type="text" id="payment" name="payment" size="25" placeholder=' +
        '"Enter amount paid"> </div> </div> <input type="button" onclick="checkOut()" value="Check Out" />')
}

function onStreamProcessed(text) {
    var obj = JSON.parse(text);
    $('#allRoom').append('<table id="all_room_table">' +
        '<thead> <tr> <th>Number | </th> <th>Type | </th>' +
        '<th>Status | </th> <th>Notes</th></tr></thead>' +
        '<tbody id="info"></tbody></table>')

    const values = [
        { value: 'O', key: 'O' },
        { value: 'C', key: 'C' },
        { value: 'A', key: 'A' },
        { value: 'X', key: 'X' }
    ]

    $('#info').empty()
    if (obj.length > 0) {
        $.each(obj, (index, item) => {
            var eachrow = "<tr>" +
                "<td>" + item['r_no'] + "</td>" +
                "<td>" + item['r_class'] + "</td>" +
                "<td>" + '<select size="1" id="newStatus">';
            $.each(values, (index, val) => {
                if (val.key.localeCompare(item['r_status']) == 0) {
                    eachrow = eachrow +
                        `<option value=${val.value} selected>` + `${val.key}` + `</option>`;
                } else {
                    eachrow = eachrow +
                        `<option value=${val.value}>` + `${val.key}` + `</option>`;
                }
            });
            eachrow = eachrow + "</select> <td>" + item['r_notes'] + "</td>" + "</tr>";
            $('#info').append(eachrow);
        });
        $('#change_room').append('<form action="/changestatus" method="POST">' +
            '<input type="submit" onclick="changeStatus()" value="Change"></input> <br> </form>')
    } else {
        row = "<tr>" +
            "<td>" + "---" + "</td>" +
            "<td>" + "---" + "</td>" +
            "<td>" + "---" + "</td>" +
            "<td>" + "---" + "</td>" +
            "</tr>";
        $('#info').append(row);
    }
}

// code for fetching data from the server

function onSuccess(response) {
    if (response.status !== 200) {
        throw new Error("Not 200 response");
    }
    return response.text();
}

function onError(error) {
    console.log('Error: ' + error);
}

function getbookingRef() {
    data = saveRefForm();
    send_post_receptionDataCI('getBookingByRef', data)
}

function getbookingRoom() {
    data = saveRoomForm();
    send_post_checkOutRoom('getBookingByRoom', data)
}

function getbookingNameCI() {
    data = saveNameForm();
    send_post_receptionDataCI('getBookingByName', data)
}

function getbookingNameCO() {
    data = saveNameForm();
    send_post_receptionDataCO('getBookingByName', data)
}

function getAllRooms() {
    fetch('allRooms').then(onSuccess, onError).then(onStreamProcessed);
}

function checkIn() {
    data = {}
    rooms = [];
    $('#c_rooms tr').each((i, row) => {
        var $row = $(row)
        if (i > 0) {
            rooms.push($row[0].cells[0].innerHTML);
        }
    })
    data.rooms = rooms;

    fetch("checkIn", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

function checkOut() {
    var row = $('#c_booking tr').find('td:eq(0):contains(Booking ref: )').parent();
    const b_ref = row[0].cells[1].innerHTML
    data = {}
    data.b_ref = b_ref;
    data.payment = $('#payment').val();
    send_post_checkOut("checkOut", data);
}

function send_post_checkOut(path, data) {
    fetch(path, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
};

function checkOutRoom() {
    var row = $('#c_rooms tr').eq(1)
    const b_ref = row[0].cells[1].innerHTML
    send_post_CO("checkOutRoom", data)
}

function send_post_CO(path, data) {
    fetch(path, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
};