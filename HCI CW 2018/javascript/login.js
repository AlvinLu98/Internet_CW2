// Check if the value entered is correct for customer log in
function checkCustLogin() 
{
	var username = document.forms["customerForm"]["uname"].value;
	var pwd = document.forms["customerForm"]["pwd"].value;
	if(pwd == 123){
		setCookie("username", username);
		goHome();
	}
	else{
		alert("Password invalid");
	}
  	
  	return false;
}

// Check if the value entered is correct for employee log in
function checkEmpLogin() 
{
	var ID = document.forms["employeeForm"]["ID"].value;
	var pwd = document.forms["employeeForm"]["pwdE"].value;
	var success = false;
	switch(ID){
		case "D":
			if (pwd == "D123") {
				setCookie("employee", "Driver");
				success = true;
			}
			break;

		case "E":
			if (pwd == "E123") {
				setCookie("employee", "Engineer");
				success = true;
			}
			break;

		case "C":
			if (pwd == "C123") {
				setCookie("employee", "Cleaner");
				success = true;
			}
			break;

		case "O":
			if (pwd == "O123") {
				setCookie("employee", "Other Employee");
				success = true;
			}
			break;

		default:
			alert("Invalid ID or password!");
			break;
	}
	if(success)
	{
		goHome();
	}
	return false;
}

function setCookie(c_name, value) {
    return localStorage.setItem(c_name, value);
}

function getCookie() {
    var c = localStorage.getItem("username");
    alert(c)
}

function goHome()
{
	window.location.href = "home.html";
}