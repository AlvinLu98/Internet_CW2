function saveForm() {

    // create an empty object
    var bookingData = {}; // showing elements added dynamically
    bookingData.checkIn = $('#b_checkIn').val(); // get a radio button value
    bookingData.checkOut = $('#b_checkOut').val(); // gets a single value
    bookingData.rooms = $('#b_rooms').val();
    bookingData.type = $('#b_type').val();

    return bookingData
};

function onTextReady(text) {
    var json = JSON.parse(text);

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
        },
        redirect: 'follow'
    })

}


function onStreamProcessed(text) {
    var obj = JSON.parse(text);

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

function getAvailableRooms() {
    var bookingData = saveForm();
    send_post("getAvailableRooms", bookingData);
}

function selectRoom(type) {
    $(`#b_type`).val(type).change()
}