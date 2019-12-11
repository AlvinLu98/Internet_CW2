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

function send_post_getBooking(path, data) {
    fetch(path, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        res.json().then(getBookingData)
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

function getBookingData(data) {
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
    $('#c_button').append('<input type="button" onclick="cancelBooking()" value="Cancel" />');
}

function getbookingRef() {
    data = saveRefForm();
    send_post_getBooking('getBookingByRef', data)
}

function getbookingName() {
    data = saveNameForm();
    send_post_getBooking('getBookingByName', data)
}

function getAllRooms() {
    fetch('allRooms').then(onSuccess, onError).then(onStreamProcessed);
}

function cancelBooking() {
    var row = $('#c_booking tr').find('td:eq(0):contains(Booking ref: )').parent();
    const b_ref = row[0].cells[1].innerHTML
    data = {}
    data.b_ref = b_ref;
    console.log(data)
    send_post_cancel('cancelBooking', data);
}

function send_post_cancel(path, data) {
    fetch(path, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(_ => {
        $('#c_booking_title').empty()
        $('#c_booking_title').append("<h4>Cancelled</h4>")
        $('#c_booking').empty()
        $('#room_container_title').empty()
        $('#c_rooms').empty()
    })
}