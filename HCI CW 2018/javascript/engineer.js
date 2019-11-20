// Check if there is log in data in local storage
// Prints all the submitted faults to the table in the page
function checkLogin(){
	var cust = getCookie("username");
	var emp = getCookie("employee");
	if(emp != null){
		document.getElementById('logout').style.display='block';
		document.getElementById('Login').style.display='none';
		welcome = "Hello " + emp + "!";
		document.getElementById('LoginID').innerHTML = welcome;
	}

	else if(cust != null){
		document.getElementById('logout').style.display='block';
		document.getElementById('Login').style.display='none';
		welcome = "Hello " + cust +"!";
		document.getElementById('LoginID').innerHTML = welcome;
	}

	else{
		document.getElementById('Login').style.display='block'
		document.getElementById('logout').style.display='none'
	}
	printFaults();
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

// Print out all the faults stored in local storage
function printFaults(){
	var hst = document.getElementById("fault");
	var count = localStorage.getItem("faultID");
	var current = null;
	var currentFault = null;
	var row = null;
	var id, fault, coachNo, train, notes, status;
	for (var i = 0; i <= count; i++) {
		current = localStorage.getItem(i);
		if(current != null){
			currentFault = JSON.parse(current);
			row = hst.insertRow();
			id = row.insertCell(0);
			fault = row.insertCell(1);
			coachNo = row.insertCell(2);
			train = row.insertCell(3);
			notes = row.insertCell(4);
			status = row.insertCell(5);

			id.innerHTML = i+1;
			fault.innerHTML = currentFault[0];
			coachNo.innerHTML = currentFault[1];
			train.innerHTML = currentFault[2];
			notes.innerHTML = currentFault[3];
			status.innerHTML = currentFault[4];
		}
	}
}


// Marks the selected fault's status as completed
function removeFault(){
	var id = document.forms["completeFault"]["ID"].value;
	var engID = document.forms["completeFault"]["empID"].value;
	var remove = localStorage.getItem(id);
	var fault = JSON.parse(remove);
	fault[4] = "Completed";
	remove = JSON.stringify(fault);
	localStorage.setItem(id, remove);
	window.location.href = "engineer.html";
	return false;
}

// Remove all faults stored in the system
function clearFaults(){
	var count = localStorage.getItem("faultID");
	for(var i = 0; i < count; i++){
		localStorage.removeItem(i);
	}
	return false;
}

// Filter the fault by a certain value
function filterFault(){
	var type = document.forms["filterFault"]["filterType"].value;
	var value = document.forms["filterFault"]["filterVal"].value;
	var hst = document.getElementById("fault");
	switch(type){
		// Filter by fault type
		case "fault":
			for (var i = 1; i <= hst.rows.length; i++) {
				if(hst.rows[i].cells[1].innerHTML !=  value){
					hst.deleteRow(i);
				}
			}
			break;
		// Filter by coach number
		case "coach":
			for (var i = 1; i <=  hst.rows.length; i++) {
				if(hst.rows[i].cells[2].innerHTML !=  value){
					hst.deleteRow(i);
				}
			}
			break;
		// Filter by train class
		case "train":
			for (var i = 1; i <=  hst.rows.length; i++) {
				if(hst.row[i].cell[3].innerHTML !=  value){
					hst.deleteRow(i);
				}
			}
			break;
		}
		return false;
}