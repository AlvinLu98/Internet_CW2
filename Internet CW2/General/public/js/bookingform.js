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
    $('#basket_table').empty();
    $.each(data.basket.item, (i, rooms) => {
        var row = "<tr>" +
            "<td>" + rooms.roomNo + "</td>" +
            "<td>" + rooms.roomType + "</td>" +
            "<td>" + rooms.price + "</td>";
        $('#basket_table').append(row);
    })
}

function findCust() {
    data = {};
    data.name = $('#name').val();
    data.email = $('#email').val();
    fetch("findCust", {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        if (res.status === 200) {
            alert("Customer not found!")
            return false;
        } else {
            return true;
        }
    })

}