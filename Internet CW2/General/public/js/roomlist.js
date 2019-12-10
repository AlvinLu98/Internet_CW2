function onStreamProcessed(text) {
    var obj = JSON.parse(text);

    $('#details_table').empty()
    $('#details_table').append('<tr><td>Check in: </td><td>' + obj.checkIn + '</td></tr>')
    $('#details_table').append('<tr><td>Check in: </td><td>' + obj.checkOut + '</td></tr>')
    $('#details_table').append('<tr><td>Number of rooms: </td><td>' + obj.numrooms + '</td></tr>')

    $('#info').empty()
    if (obj.rooms.length > 0) {
        $.each(obj.rooms, (index, item) => {
            var eachrow = "<tr>" +
                "<td class='pic'>" + findImage(item['r_class']) + "</td>" +
                "<td>" + item[`r_no`] + "</td>" +
                "<td>" + item[`r_class`] + "</td>" +
                "<td>" + obj.rate[0].price + "</td>" +
                "<td> <button type='button' onclick='addToList(this)'> Add to cart </button></td></tr>"
            $('#info').append(eachrow);
        });
    }
    if (obj.rooms.length < obj.numrooms) {
        getAlternativeRooms(obj.checkIn, obj.checkOut, getAlternative(obj.rooms[0].r_class))
            .then(values => {
                $('#alternativeRooms').append('<h1> Alternative rooms</h1>');
                $('#alternativeRooms').append('<p>*Not enough room time for selected date,' +
                    ' showing alternative</p>');
                $('#altInfoHead').append(
                    '<tr> <th class="pic">Pictures | </th> <th>Room | </th>' +
                    '<th>Type | </th> <th>Price | </th> <th>Options</th> </tr>'
                )
                $.each(values.rooms, (index, item) => {
                    var row = "<tr>" +
                        "<td class='pic'>" + findImage(item['r_class']) + "</td>" +
                        "<td>" + item[`r_no`] + "</td>" +
                        "<td>" + item[`r_class`] + "</td>" +
                        "<td>" + obj.rate[0].price + "</td>" +
                        "<td> <button type='button' class='addbasket' onclick='addToList(this)'>" +
                        "Add to cart </button></td></tr>";
                    $('#altInfo').append(row);
                })
            })
    }
}

function findImage(type) {
    switch (type) {
        case 'sup_d':
            return '<img src="images/room_1.jpg" alt="Superior double">';
        case 'std_d':
            return '<img src="images/room_2.jpg" alt="Standard double">';
        case 'sup_t':
            return '<img src="images/room_3.jpg" alt="Superior twin">';
        case 'std_t':
            return '<img src="images/room_4.jpg" alt="Standard twin">';
    }
}

function getAlternative(type) {
    switch (type) {
        case 'sup_d':
            return 'sup_t';
        case 'std_d':
            return 'std_t';
        case 'sup_t':
            return 'sup_d';
        case 'std_t':
            return 'std_d';
    }
}

async function send_post(path, data) {
    fetch(path, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(res => {
        res.json().then(fillBasket)
    });
}

function fillBasket(data) {
    $('#basket_table').empty();
    $.each(data.item, (i, rooms) => {
        var row = "<tr>" +
            "<td>" + rooms.roomNo + "</td>" +
            "<td>" + rooms.roomType + "</td>" +
            "<td>" + rooms.price + "</td>" +
            '<td><button type="button" onclick="deleteFromBasket(this)">X</button></td>'
        $('#basket_table').append(row);

        var row = $('#info tr').find('td:eq(1):contains(' + rooms.roomNo + ')').parent();
        row[0].cells[4].innerHTML = "<button type='button' class='addbasket' onclick='addToList(this)'" +
            "style='display:none'>Add to cart </button></td></tr>";
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

function listRooms() {
    fetch('listAvailableRooms').then(onSuccess, onError).then(onStreamProcessed).then(_ => {
        fetch('basketData').then(res => {
            res.json().then(data => {
                fillBasket(data.basket);
            })
        });
    })
}

async function getAlternativeRooms(checkIn, checkOut, type) {
    var data = {};
    data.checkIn = checkIn;
    data.checkOut = checkOut;
    data.type = type;
    var alt = {}
    var rooms, rate;
    res = await fetch("getAlternative", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
    });
    values = await res.json();
    return values;
}

function addToList(element) {
    var row = $('#details_table tr').find('td:eq(0):contains(Number of rooms: )').parent();
    var rooms = row[0].cells[1].innerHTML;
    var curRooms = $('#basket_table tr').length;
    console.log(curRooms)
    if (rooms > curRooms) {
        element.style.display = 'none'
        row = element.closest('tr');

        var data = {};
        data.roomNo = row.cells[1].innerHTML;
        data.roomType = row.cells[2].innerHTML;
        data.price = row.cells[3].innerHTML;

        send_post('addToBasket', data);
    } else {
        alert("You've already selected " + rooms + " rooms!")
    }
}

function deleteFromBasket(element) {
    row = element.closest('tr');

    var data = {};
    data.roomNo = row.cells[0].innerHTML;
    data.roomType = row.cells[1].innerHTML;
    data.price = row.cells[2].innerHTML;

    var row = $('#info tr').find('td:eq(1):contains(' + data.roomNo + ')').parent();
    row[0].cells[4].innerHTML = "<button type='button' class='addbasket' onclick='addToList(this)'>" +
        "Add to cart </button></td></tr>";

    send_post('removeFromBasket', data);
}