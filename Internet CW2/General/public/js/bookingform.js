function saveForm() {

    // create an empty object
    var bookingData = {}; // showing elements added dynamically
    bookingData.checkIn = $('#b_checkIn').val(); // get a radio button value
    bookingData.checkOut = $('#b_checkOut').val(); // gets a single value
    bookingData.rooms = $('#b_rooms').val();
    bookingData.type = $('#b_type').val();

    return bookingData
};

function loadBasket() {
    fetch("basketData").then(onSuccess, onError).then(onStreamProcessed)
}

function onSuccess(response) {
    if (response.status !== 200) {
        throw new Error("Not 200 response");
    }
    return response.text();
}

function onError(error) {
    console.log('Error: ' + error);
}

function onStreamProcessed(text) {
    var data = JSON.parse(text);
    $('#basket_table').empty();
    $.each(data.basket.item, (i, rooms) => {
        var row = "<tr>" +
            "<td>" + rooms.roomNo + "</td>" +
            "<td>" + rooms.roomType + "</td>" +
            "<td>" + rooms.price + "</td>";
        $('#basket_table').append(row);
    })
}