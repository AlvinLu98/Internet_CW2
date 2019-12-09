function saveForm() {

    // create an empty object
    var receptionData = {}; // showing elements added dynamically
    housekeepingData.bref = $('#bref').val(); //get booking ref
    housekeepingData.cusname = $('#cname').val(); //get customer name
    housekeepingData.roomNumber = $('#roomNumber').val(); //get room number
    housekeepingData.cidate = $('#cidate').val(); //get check-in date
    housekeepingData.codate = $('#codate').val(); //  get check-out date

    return receptionData
}

function updateRoomStatus() {
    var data = saveForm();

    console.log(data);

    send_post(data); // submit data via POST

}

function onTextReady(text) {

    console.log(text);

    var json = JSON.parse(text);

    $('#ret').html(json.roomNumber + ", " + json.newStatus);
}

function onResponse(response) {
    return response.text();
}

// submit data for storage using the POST method
function send_post(path, data) {

    fetch(path, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(onResponse)
        .then(onTextReady);

}

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

function getCheckedOutRooms() {
    fetch('checkedOut').then(onSuccess, onError).then(onStreamProcessed);
}
function getAllRooms() {
    fetch('allRooms').then(onSuccess, onError).then(onStreamProcessed);
}

function getbooking() {
    if (val.key.localeCompare(item[$.bref]) == 0) {
        fetch('getBookingByName($(#cname)').then(onSuccess, onError).then(onStreamProcessed);
    } else {
        fetch('getBookingByRef($(#bref)').then(onSuccess, onError).then(onStreamProcessed);
    }
}
    function checkIn() {
        fetch('checkIn()').then(onSuccess, onError).then(onStreamProcessed);
    }
    function checkOut() {
        if (val.key.localeCompare(item[$.bref]) == 0) {
            fetch('checkOut($(#bref)').then(onSuccess, onError).then(onStreamProcessed);
        } else {
            fetch('checkOutByRoom($(#codate)').then(onSuccess, onError).then(onStreamProcessed);
        }
    }
    function viewPayments() {
        fetch('getPaymentType').then(onSuccess, onError).then(onStreamProcessed);
    }
