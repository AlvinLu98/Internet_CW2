function saveForm(){

    // create an empty object
	var housekeepingData = {}; 							// showing elements added dynamically
	housekeepingData.empId = $('#employeeid').val();//get employee ID
	housekeepingData.roomNumber = $('#roomNumber').val();//get room number
    housekeepingData.newStatus = $('#newStatus').val();//  get room status

    return housekeepingData
};

function updateRoomStatus(){
	var data = saveForm();

    console.log(data);

	send_post('get_form2', data); // submit data via POST

};

function onTextReady(text) {

    console.log(text);

    var json = JSON.parse(text); 

    $('#ret').html( json.course + ", " + json.studentName + ", " + json.school + ", " + json.adviser); 
}

function onResponse(response) {
  return response.text();
}

// submit data for storage using the POST method
function send_post(path, data) {

    fetch(path, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(onResponse)
    .then(onTextReady);

};


function onStreamProcessed(text) {
  console.log(text);
  var obj = JSON.parse(text);

  console.log(obj);
  $('#info').empty()
  $.each(obj, function (index, item) {
     var eachrow = "<tr>"
                 + "<td>" + item['roomNumber'] + "</td>"
                 + "<td>" + item['newStatus'] + "</td>"
                 + "<td>" + item['empId'] + "</td>"
                 + "</tr>";
     $('#info').append(eachrow); // use JQuery append method
  });

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

// fetch data from a server
function fetchRoomDetails() {

    var json = fetch('show_all').then(onSuccess, onError).then(onStreamProcessed);

};
