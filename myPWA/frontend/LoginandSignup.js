const loginform = document.querySelector(".login-form");
const registerForm=document.querySelector(".register-form");
const container= document.querySelector(".container"); 
const loginTitle= document.querySelector(".title-login")
const registerTitle = document.querySelector(".title-register");
const signupBtn= document.querySelector("#SignUpBtn");
const signinBtn= document.querySelector("#SignInBtn");


function loginFunction(){
  registerForm.reset(); //Makes the register form reset
  // Changes the display so that only the login form is visible
  loginform.style.left="50%";
  loginform.style.display="block"; 
  registerForm.style.left= "150%"; 
  registerForm.style.display="none"; 
  container.style.height="500px"; 
  loginTitle.style.height="50%"; 
  loginTitle.style.display="block"; 
  registerTitle.style.top="50px"; 
  registerTitle.style.display= "none"; 
    
}

function registerFunction() {
  loginform.reset(); //Make the login form reset
  // Changes the display so that only the register form is visible
  loginform.style.left="-50%";
  loginform.style.display="none"; 
  registerForm.style.left= "50%"; 
  registerForm.style.display="block"; 
  container.style.height="580px"; 
  loginTitle.style.height="-60%"; 
  loginTitle.style.display="none"; 
  registerTitle.style.top="50%"; 
  registerTitle.style.display= "block"; 

}

//Input Validation 
var myInput = document.getElementById("reg-pass");
var letter = document.getElementById("letter");
var capital=document.getElementById("capital");
var number=document.getElementById("number");
var length=document.getElementById("length");

//Display the message box
myInput.onfocus = function() {
  document.getElementById("Password-message").style.display="block";

}

//Hide message box 
myInput.onblur = function() {
  document.getElementById("Password-message").style.display ="none"; 

}
myInput.onkeyup = function() {

  // Validate the lowercase letters
  var lowerCaseLetters = /[a-z]/g;
  if(myInput.value.match(lowerCaseLetters)) {
    letter.classList.remove("Invalid");
    letter.classList.add("Valid");
  } else {
    letter.classList.remove("Valid");
    letter.classList.add("Invalid");
}

  // Validate for capital letters
  var upperCaseLetters = /[A-Z]/g;
  if(myInput.value.match(upperCaseLetters)) {
    capital.classList.remove("Invalid");
    capital.classList.add("Valid");
  } else {
    capital.classList.remove("Valid");
    capital.classList.add("Invalid");
  }

  // Validate the numbers
  var numbers = /[0-9]/g;
  if(myInput.value.match(numbers)) {
    number.classList.remove("Invalid");
    number.classList.add("Valid");
  } else {
    number.classList.remove("Valid");
    number.classList.add("Invalid");
  }

  // Validate the length
  if(myInput.value.length >= 8) {
    length.classList.remove("Invalid");
    length.classList.add("Valid");
  } else {
    length.classList.remove("Valid");
    length.classList.add("Invalid");
  }
}

//Registration form submission
registerForm.addEventListener("submit", function(event) {
  event.preventDefault();

    const Username = document.getElementById("reg-username").value;
    const Email = document.getElementById("reg-email").value
    const Password = document.getElementById("reg-pass").value;
    
    //Allows for the server to access the data

    fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Username, Email, Password }) 
    })
    .then(response => {
        if (response.ok) {
            alert( "Your registration was successful!" );
            loginFunction(); 
        } else {
            return response.text().then(text => { throw new Error(text); });
        }
    })

    .catch(error => {
        console.error("Signup error:", error.message);
        alert("Signup failed: " + error.message);
    });
});


//Login Form functionality 
loginform.addEventListener("submit", function(event) {
  event.preventDefault();

  const Username = document.getElementById("log-username").value;
  const Password = document.getElementById("logpass").value;
    
    //Allows for the server to access the data

  fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ Username, Password }) 
  })
  .then(response => response.text()) 
  .then(message => {
    if(message.includes("Welcome")) {
      alert("Login Successful")
      window.location.href ="Home.html"; //Redirect page when successful
    } else{
      alert(message);
    }
  })
  .catch(error => {
      console.error("Login error:", error.message);
      alert("Login failed: " + error.message);
  });
});
