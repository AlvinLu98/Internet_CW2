// Check if there is log in data in local storage
// Adds extra fault type to the selection if the user is engineer or driver
function checkLogin(){
	var cust = getCookie("username")
	var emp = getCookie("employee")
	if(emp != null){
		document.getElementById('logout').style.display='block';
		document.getElementById('Login').style.display='none';
		document.forms["faultForm"]["role"].value = emp;
		var welcome = "Hello " + emp + "!";
		document.getElementById('LoginID').innerHTML = welcome;

		if(emp == "Engineer"){
			document.getElementById('engineer').style.display='block'
		}
		
		if(emp == "Driver" || emp == "Engineer"){
			var x=document.getElementById("fault");
			var track = document.createElement("option");
			track.text = "Track";
			track.value = "Track";

			var controls = document.createElement("option");
			controls.text = "Control problems";
			controls.value = "Controls";

			x.add(track);
			x.add(controls);
		}
	}

	else if(cust != null){
		document.getElementById('logout').style.display='block';
		document.getElementById('Login').style.display='none';
		var welcome = "Hello " + cust +"!";
		document.getElementById('LoginID').innerHTML = welcome;
	}

	else{
		document.getElementById('Login').style.display='block'
		document.getElementById('logout').style.display='none'
	}

}

// Get the item stored in local storage by the name
function getCookie(value) {
    var c = localStorage.getItem(value);
    return c;
}

// Remove the log in data from local storage
function logout(){
	localStorage.clear()
	window.location.href = "Generic_form.html";
}

// Processes the fields that's shown based on the fault type selected
function changeValue(){
	var fault = document.forms["faultForm"]["fault"].value;
	clearFaultDisplay();
	switch(fault){
		case "Wear":
			document.getElementById('wear').style.display='block';
			document.getElementById('SeatNumber').style.display='block';
			document.forms["faultForm"]["seatNumber"].required = true;
			document.forms["faultForm"]["wearVal"].required = true;
			break;

		case "Toilet":
			document.getElementById('Toilet').style.display='block';
			break;

		case "Wifi":
			document.getElementById('Wi-Fi').style.display='block';
			break;

		case "Track":
			document.getElementById('coachYN').style.display='none';
			document.getElementById('TrackNo').style.display='block';
			document.forms["faultForm"]["coachNoYN"].required = false;
			break;

		case "Controls":
			document.getElementById('coachYN').style.display='none';
			document.getElementById('TrainFault').style.display='block';
			document.forms["faultForm"]["coachNoYN"].required = false;
			break;

		case "Other":
			document.getElementById('faultOther').style.display='block';
			break;

		default:
			break;
	}
	coachNumYN();
}

// Function to reset the fields to default state when no fault type is selected
function clearFaultDisplay(){
	document.getElementById('coachYN').style.display='block';
	document.getElementById('faultOther').style.display='none';
	document.getElementById('wear').style.display='none';
	document.getElementById('Toilet').style.display='none';
	document.getElementById('origin').style.display='none';
	document.getElementById('destination').style.display='none';
	document.getElementById('SeatNumber').style.display='none';
	document.getElementById('Wi-Fi').style.display='none';
	document.getElementById('TrackNo').style.display='none';
	document.getElementById('TrainFault').style.display='none';
	document.forms["faultForm"]["wearVal"].required = false;
	document.forms["faultForm"]["seatNumber"].required = false;
	document.forms["faultForm"]["coachNoYN"].required = true;
}

// Function to show the extra text box if 'other' is selected in the wear item
function wearObjectChange(){
	var wear = document.forms["faultForm"]["wearVal"].value;
	document.getElementById('wearOther').style.display='none';
	if(wear == "Other"){
		document.getElementById('wearOther').style.display='block';
	}
}

// Function to show relevant fields and information based on user's knowledge on coach number
function coachNumYN(){
	var coachYN = document.forms["faultForm"]["coachNoYN"].value;
	clearCoachNum();
	if(coachYN == "y"){
		document.forms["faultForm"]["coachNumber"].required = true;
		document.getElementById('coachNo').style.display='block';
	}

	else if(coachYN == "dk"){
		document.getElementById('coachNo').style.display='block';
		document.getElementById('coachNoGuide').style.display='block';
	}

	else if(coachYN == "n"){
		document.getElementById('TrainOrigin').style.display='block';
		document.getElementById('origin').style.display='block';
		document.getElementById('TrainDestination').style.display='block';
		document.getElementById('destination').style.display='block';
		document.getElementById('Time').style.display='block';
		document.forms["faultForm"]["origin"].required = true;
		document.forms["faultForm"]["destination"].required = true;
		document.forms["faultForm"]["time"].required = true;
	}
}

// Resets the form to default state when no there's no selection on coach number knowledge
function clearCoachNum(){
	document.getElementById('coachNo').style.display='none';
	document.getElementById('coachNoGuide').style.display='none';
	document.getElementById('TrainOrigin').style.display='none';
	document.getElementById('origin').style.display='none';
	document.getElementById('TrainDestination').style.display='none';
	document.getElementById('destination').style.display='none';
	document.getElementById('Time').style.display='none';
	document.forms["faultForm"]["coachNumber"].required = false;
	document.forms["faultForm"]["origin"].required = false;
	document.forms["faultForm"]["destination"].required = false;
	document.forms["faultForm"]["time"].required = false;
}

// Function to show relevant fields when user opt for update
function update(){
	var update = document.forms["faultForm"]["updates"].value;
	var cust = getCookie("username")
	var emp = getCookie("employee")
	document.getElementById('updateEmail').style.display='none';
	document.getElementById('updateName').style.display='none';
	document.forms["faultForm"]["updtEmail"].required = false;
	document.forms["faultForm"]["updtName"].required = false;
	if(update == "Yes"){
		if(cust != null){
			document.getElementById('updtName').value = cust;
			document.getElementById('updateLogIn').innerHTML="Update to username: " + cust;
		}
		else if(emp != null){
			document.getElementById('updtName').value = cust;
			document.getElementById('updateLogIn').innerHTML="Update to employee: " + emp;
		}
		else{
			document.getElementById('updateEmail').style.display='block';
			document.getElementById('updateName').style.display='block';
			document.forms["faultForm"]["updtEmail"].required = true;
			document.forms["faultForm"]["updtName"].required = true;
		}
		
	}
}

// Function to show all the relevant fields for user to enter extra information
function showAllInfo(){
	document.getElementById('SeatNumber').style.display='block';
	document.getElementById('coachNo').style.display='block';
	document.getElementById('TrainOrigin').style.display='block';
	document.getElementById('origin').style.display='block';
	document.getElementById('TrainDestination').style.display='block';
	document.getElementById('destination').style.display='block';
	document.getElementById('Time').style.display='block';
	return false;
}

// Function to hide all field that is not required
function hideAllInfo(){
	changeValue();
	coachNumYN();
	wearObjectChange();
	return false;
}

// Function to remove the image that is uploaded
function removeUpload(){
	document.forms["faultForm"]['image'].value = "";
	document.getElementById('uploadImage').src = "";
	document.getElementById('clearUpload').style.display = "none";
	return false;
}
