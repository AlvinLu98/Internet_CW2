function saveIncomeForm() {

    // create an empty object
    var sales = {}; // showing elements added dynamically
    sales.start = $('#sDate').val();
    sales.end = $('#eDate').val();
    return sales
}

function saveRoomForm() {

    // create an empty object
    var sales = {}; // showing elements added dynamically
    sales.start = $('#r_sDate').val();
    sales.end = $('#r_eDate').val();
    return sales
}

function getSalesData() {
    data = saveIncomeForm();

    send_post_sales("salesdata", data)
}

function getIncomeData() {
    data = saveIncomeForm();

    send_post_income("incomedata", data)
}

function occupied() {
    data = saveRoomForm();

    send_post_room("occupied", data)
}

function unoccupied() {
    data = saveRoomForm();

    send_post_room("unoccupied", data)
}

function send_post_sales(path, data) {
    fetch(path, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        res.json().then(salesData)
    })
};

function salesData(sales) {
    $('#sales_table').empty()
    $('#sales_table').append("<thead><tr><th>Check In</th><th>Check Out</th>" +
        "<th>Room</th><th>Price</th></tr></thead>")
    $.each(sales, (i, sale) => {
        row = "<tr><td>" + sale.checkin.substr(0, 10) + "</td>" +
            "<td>" + sale.checkout.substr(0, 10) + "</td>" +
            "<td>" + sale.r_no + "</td>" +
            "<td>" + sale.b_cost + "</td></tr>";
        $('#sales_table').append(row)
    })
}

function send_post_income(path, data) {
    fetch(path, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        res.json().then(incomeData)
    })
};

function incomeData(income) {
    $('#sales_table').empty()
    $('#sales_table').append("<tr><td>Total income: </td> <td>" + income[0].total + "</td></tr>")
}

function send_post_room(path, data) {
    fetch(path, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        res.json().then(rooms)
    })
};

function rooms(rooms) {
    $('#sales_table').empty()
    $('#sales_table').append("<thead><tr><th>Room no</th><th>Type</th><th>Check in</th>" +
        "<th>Check out</th></tr></thead>")
    $.each(rooms, (i, room) => {
        row = "<tr> <td>" + room.r_no + "</td>" +
            "<td>" + room.r_class + "</td>"
        if (room.checkin != null) {
            row = row + "<td>" + room.checkin.substr(0, 10) + "</td>" +
                "<td>" + room.checkout.substr(0, 10) + "</td>";
        } else {
            row = row + "<td> - </td><td> - </td>"
        }
        row = row + "</tr>"
        $('#sales_table').append(row);
    })
}