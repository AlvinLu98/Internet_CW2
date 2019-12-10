function getConfirmationDetails() {
    fetch('confirmationDetails').then(onSuccess, onError).then(onStreamProcessed)
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
    var obj = JSON.parse(text);
    $('#bref').html(obj.b_ref[0].bref);
    $('#name').html(obj.cust.name);
    $('#email').html(obj.cust.email);
    $('#phone').html(obj.cust.phone);
    $('#numroom').html(obj.numrooms);
    $('#cidate').html(obj.checkIn);
    $('#codate').html(obj.checkOut);
    $('#total').html(obj.total);

    $.each(obj.basket.item, (i, rooms) => {
        var row = "<tr>" +
            "<td>" + rooms.roomNo + "</td>" +
            "<td>" + rooms.roomType + "</td>" +
            "<td>" + rooms.price + "</td></tr>";
        $('#roomlist').append(row);
    })
}