//Auto login if account info stored in cache
if( localStorage['email'] != null && localStorage['password'] != null ){
	loginWithDatabase(localStorage['email'],localStorage['password']);
	getFavourites();
}

//Function
function logout(){
	$("#nav-login").removeClass("hidden");
	$("#nav-signup").removeClass("hidden");
	$("#nav-logout").addClass("hidden");
	$("#nav-favourites").addClass("hidden");
	$("#system-message").html("");
	$("#error-message").html("");
	$('#logoutModal').removeClass("show");
	$('#logoutModal').attr("style","display:none");
	$('.modal-backdrop').remove();

	//remove account info in cache
	localStorage.removeItem('email');
	localStorage.removeItem('password');
	
}

function login(){
	var email = $("#login-email").val();
	var password = $("#login-password").val();
	$("#login-system-message").html("");
	$("#login-error-message").html("");
	if(!validateEmail(email)) {
		$("#login-system-message").html("");
		$("#login-error-message").html("Login Fail, invaild email!!");
	}
	if( email == "" || password == ""){
		$("#login-system-message").html("");
		$("#login-error-message").html("Please input login details.");
	} else {
		loginWithDatabase(email, password);
	}
}

function signup(){
	var conf = true;
	var email = $("#signup-email").val();
	var confemail = $("#signup-confemail").val();
	var password = $("#signup-password").val();
	var confpassword = $("#signup-confpassword").val();
	$("#signup-system-message").html("");
	$("#signup-error-message").html("");
	if(!validateEmail(email) || !validateEmail(confemail)) {
		$("#signup-system-message").html("");
		$("#signup-error-message").html("Sign up Fail, invaild email!!");
	}
	if( email == "" || password == "" || confemail == "" || confpassword == ""){
		$("#signup-system-message").html("");
		$("#signup-error-message").html("Please input login details.");
	} else {
		if(email != confemail) {
			$("#signup-system-message").html("");
			$("#signup-error-message").html("Sign up Fail, Email Not Matching!!");
	    } else if(password != confpassword) {
			$("#signup-system-message").html("");
			$("#signup-error-message").html("Sign up Fail, Password Not Matching!!");
	    } else {
	    	signupWithDatabase(email, password);
	    }
	}
}

//Function
function loginWithDatabase(email, password) {
    $.ajax({
        type: "GET",
		url: "https://assigment2-305cde.herokuapp.com/user/login/email=" + email + "&pw=" + password,
		format:"jsonp",
		dataType: "jsonp",
		beforeSend: function(){	            
			$("#loader").show();
		},
		success : function(data) {
			if(data[0] != "1"){
				$("#login-system-message").html("");
				$("#login-error-message").html(data[1]);
			} else {
				$("#nav-login").addClass("hidden");
				$("#nav-signup").addClass("hidden");
				$("#nav-logout").removeClass("hidden");
				$("#nav-favourites").removeClass("hidden");
				$("#system-message").html(data[1]);
				$("#error-message").html("");
				$("#login-error-message").html("");
				$("#login-email").val("");
				$("#login-password").val("");
				$('#loginModal').removeClass("show");
				$('#loginModal').attr("style","display:none");
				$('.modal-backdrop').remove();
				
				//strore account info in cache
				localStorage['email'] = email;
				localStorage['password'] = password;
				
			}
         },
		error : function(e) {
			$("#login-system-message").html("");
			$("#login-error-message").html("Login Fail: " + e.responseText);
		},
		complete : function(data) {
			$("#loader").hide();
		}
	});
}

function signupWithDatabase(email, password) {
    $.ajax({
        type: "GET",
		url: "https://assigment2-305cde.herokuapp.com/user/signup/email=" + email + "&pw=" + password,
		format:"jsonp",
		dataType: "jsonp",
		beforeSend: function(){	            
			$("#loader").show();
		},
		success : function(data) {
			if(data[0] != "1"){
				$("#signup-system-message").html("");
				$("#signup-error-message").html(data[1]);
			} else {
				$("#nav-login").addClass("hidden");
				$("#nav-signup").addClass("hidden");
				$("#nav-logout").removeClass("hidden");
				$("#nav-favourites").removeClass("hidden");
				$("#system-message").html(data[1]);
				$("#error-message").html("");
				$("#signup-error-message").html("");
				$("#signup-email").val("");
				$("#signup-password").val("");
				$("#signup-confemail").val("");
				$("#signup-confpassword").val("");
				$('#signupModal').removeClass("show");
				$('#signupModal').attr("style","display:none");
				$('.modal-backdrop').remove();
				
				//strore account info in cache
				localStorage['email'] = email;
				localStorage['password'] = password;
			}
         },
		error : function(e) {
			$("#signup-system-message").html("");
			$("#signup-error-message").html("Sign up Fail: " + e.responseText);
		},
		complete : function(data) {
			$("#loader").hide();
		}
	});
}


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

