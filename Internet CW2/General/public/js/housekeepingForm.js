function onTextReady(text) {

    console.log(text);

    var json = JSON.parse(text);

    $('#ret').html(json.course + ", " + json.studentName + ", " + json.school + ", " + json.adviser);
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
        .then(res => {
            res.json()
        })

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

function changeStatus() {
    var data = [];
    var r_no, r_status;
    //https://www.fourfront.us/blog/store-html-table-data-to-javascript-array#step1
    $('#info tr').each((row, tr) => {
        r_no = $(tr).find('td:eq(0)').text();
        r_status = $(tr).find('td:eq(2)').find('select').val();
        var room = new Object();
        room.r_no = r_no;
        room.r_status = r_status;
        data[row] = room;
    });
    send_post("changeStatus", data);
}