function loadBasket() {
    fetch("basketData").then(onSuccess, onError).then(onStreamProcessed)
    fetch('getBookingDetails').then(res => {
        res.json().then(obj => {
            $('#details_table').empty()
            $('#details_table').append('<tr><td>Check in: </td><td>' + obj.checkIn + '</td></tr>')
            $('#details_table').append('<tr><td>Check in: </td><td>' + obj.checkOut + '</td></tr>')
            $('#details_table').append('<tr><td>Number of rooms: </td><td>' + obj.numrooms + '</td></tr>')
        })
    })
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
    var total = 0;
    $('#basket_table').empty();
    $.each(data.basket.item, (i, rooms) => {
        var row = "<tr>" +
            "<td>" + rooms.roomNo + "</td>" +
            "<td>" + rooms.roomType + "</td>" +
            "<td>" + rooms.price + "</td> </tr>";
        $('#basket_table').append(row);
        total = total + parseFloat(rooms.price);
    });
    $('#basket_table').append('<tr>Total: ' + total + '</tr>');
}