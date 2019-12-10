function saveRefForm() {

    // create an empty object
    var receptionData = {}; // showing elements added dynamically
    receptionData.b_ref = $('#b_ref').val(); //get booking ref
    return receptionData
}

function saveNameForm() {

    // create an empty object
    var receptionData = {}; // showing elements added dynamically
    receptionData.custName = $('#cName').val(); //get customer name
    receptionData.checkIn = $('#cidate').val(); //get check-in date
    receptionData.checkOut = $('#codate').val(); //  get check-out date
    return receptionData
}

// submit data for storage using the POST method
function send_post(path, data) {
    fetch(path, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        res.json().then(data => {

            rows = "<tr><td>Name: " + data[0].c_name + "</td></tr>" +
                "<tr><td>Check in: " + data[0].b_ref + "</td></tr>" +
                "<tr><td>Check out: " + data[0].checkin.substr(0, 10) + "</td></tr>" +
                "<tr><td>Booking ref: " + data[0].checkout.substr(0, 10) + "</td></tr>";
            $('#c_booking').append(rows)
        })
    })
};

function onStreamProcessed(text) {
    var obj = JSON.parse(text);

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
    $('#b_ref').val("");
    send_post('getBookingByRef', data)
}

function getbookingName() {
    data = saveNameForm();
    send_post('getBookingByName', data)
}

function getAllRooms() {
    fetch('allRooms').then(onSuccess, onError).then(onStreamProcessed);
}

function checkIn() {
    fetch('checkIn').then(onSuccess, onError).then(onStreamProcessed);
    window.alert("Check In Complete");
}

function checkOut() {
    if (val.key.localeCompare(item[$.bref]) == 0) {
        fetch('checkOut').then(onSuccess, onError).then(onStreamProcessed);
    } else {
        fetch('checkOutByRoom').then(onSuccess, onError).then(onStreamProcessed);
    }
}

function viewPayments() {
    fetch('getPaymentType').then(onSuccess, onError).then(onStreamProcessed);
}