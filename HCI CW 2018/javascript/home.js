// Check if there is log in data in local storage
function checkLogin(){
	var cust = getCookie("username")
	var emp = getCookie("employee")
	var submitted = getCookie("submitted")

	if(submitted != null){
		document.getElementById('form_submitted').innerHTML = submitted;
		localStorage.removeItem('submitted');
	}

	if(emp != null){
		document.getElementById('logout').style.display='block'
		document.getElementById('Login').style.display='none'
		welcome = "Hello " + emp + "!";
		document.getElementById('LoginID').innerHTML = welcome;
		if(emp == "Engineer"){
			document.getElementById('engineer').style.display='block'
		}
	}

	else if(cust != null){
		document.getElementById('logout').style.display='block'
		document.getElementById('Login').style.display='none'
		welcome = "Hello " + cust +"!";
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
	window.location.href = "home.html";
}

// If the enginner's hub button is pressed, check if an engineer is logged in
function checkEngineer(){
	var emp = getCookie("employee");
	if(emp != null){
		if(emp = "Engineer"){
			window.location.href = "engineer.html";
		}
	}
	else{
		window.location.href = "login.html";
	}
	return false;
}

// Links to the departure page of the submitted station
function goToDeparture()
{
	var id = document.forms["liveDeparture"]["stnCd"].value;
	var url = "https://www.greateranglia.co.uk/travel-information/live-departure-arrival-boards";
	url = url+"/"+id;
	window.location.href = url;
	return false;
}