// Saves a new fault to the local storage
function submitFault(){
	var role = document.forms["faultForm"]["role"].value;
	var fault = document.forms["faultForm"]["fault"].value;
	var otherFault = document.forms["faultForm"]["otherFault"].value;
	var coachNum = document.forms["faultForm"]["coachNumber"].value;
	var seatNum = document.forms["faultForm"]["seatNumber"].value;
	var origin = document.forms["faultForm"]["origin"].value;
	var destination = document.forms["faultForm"]["destination"].value;
	var time = document.forms["faultForm"]["time"].value;
	var wearItem = document.forms["faultForm"]["wearVal"].value;
	var otherWear = document.forms["faultForm"]["wearOther"].value;
	var toiletVal = document.forms["faultForm"]["toiletVal"].value;
	var wifi = document.forms["faultForm"]["wifi"].value;
	var trackCode = document.forms["faultForm"]["trackID"].value;
	var trainType = document.forms["faultForm"]["trainType"].value;
	var description = document.forms["faultForm"]["description"].value;
	var updateEmail = document.forms["faultForm"]["updtEmail"].value;
	var updateName = document.forms["faultForm"]["updtName"].value;
	var result = null;

	var desc = null;
	var faultID = getCookieP("faultID");
	faultID++;
	setCookieP("faultID", faultID);


	switch(fault){
		case "Wear":
			desc = seatNum + ", " + wearItem + ": " + description;
			result = [fault, coachNum, "-", desc, "submitted"];
			break;

		case "Toilet":
			result = [fault, coachNum, "-", toiletVal, "submitted"];
			break;

		case "Wifi":
			result = [fault, coachNum, "-", wifi, "submitted"];
			break;

		case "Track":
			result = [fault, "-", trackCode, description, "submitted"];
			break;

		case "Controls":
			result = [fault, "-", trainType, description, "submitted"];
			break;

		default:
			result = [fault, coachNum, "-", description, "submitted"];
			break;
	}
	 var newFault = JSON.stringify(result);
	 setCookieP(faultID, newFault);
	 setCookieP("submitted", "Form Submitted");
	 window.location.href = "home.html";
	 return false;
}

// Set a cookie with the given name and value
function setCookieP(c_name, value) {
    return localStorage.setItem(c_name, value);
}

// Get the cookie with a specific name
function getCookieP(cname) {
    var c = localStorage.getItem(cname);
    return c;
}