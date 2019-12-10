function saveForm() {

    // create an empty object
    var customerData = {}; // showing elements added dynamically
    customerData.name = $('#name').val(); // get a radio button value
    customerData.email = $('#email').val(); // gets a single value
    customerData.phone = $('#phone').val();
    customerData.adress = $('#hono').val() + ", " + $('#street').val() + ", " +
        $('#city').val() + ", " + $('#country').val() + ", " + $('#postcode').val()

    return customerData
};

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

async function send_post(path, data) {
    fetch(path, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
    })
}

function goToPayment() {
    data = saveForm();
    send_post("goToPayment", data)
}