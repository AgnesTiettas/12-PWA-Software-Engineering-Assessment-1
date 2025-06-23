const loginform = document.querySelector(".login-form");
const registerForm=document.querySelector(".register-form");
const container= document.querySelector(".container"); 
const loginTitle= document.querySelector(".title-login")
const registerTitle = document.querySelector(".title-register");
const signupBtn= document.querySelector("#SignUpBtn");
const signinBtn= document.querySelector("#SignInBtn");


function loginFunction(){
    loginform.style.left="50%";
    loginform.style.opacity=1; 
    registerForm.style.left= "150%"; 
    registerForm.style.opacity=0; 
    container.style.height="500px"; 
    loginTitle.style.height="50%"; 
    loginTitle.style.opacity=1; 
    registerTitle.style.top="50px"; 
    registerTitle.style.opacity= 0; 
    
}

function registerFunction() {
    loginform.style.left="-50%";
    loginform.style.opacity=0; 
    registerForm.style.left= "50%"; 
    registerForm.style.opacity=1; 
    container.style.height="580px"; 
    loginTitle.style.height="-60%"; 
    loginTitle.style.opacity=0; 
    registerTitle.style.top="50%"; 
    registerTitle.style.opacity= 1; 

}


var myInput = document.getElementById("reg-pass");
var letter = document.getElementById("letter");
var capital=document.getElementById("capital");
var number=document.getElementById("number");
var length=document.getElementById("length");

//Display message box
myInput.onfocus = function() {
    document.getElementById("Password-message").style.display="block";

}

//Hide message box 
myInput.onblur = function() {
    document.getElementById("Password-message").style.display ="none"; 

}
myInput.onkeyup = function() {
  // Validate lowercase letters
  var lowerCaseLetters = /[a-z]/g;
  if(myInput.value.match(lowerCaseLetters)) {
    letter.classList.remove("Invalid");
    letter.classList.add("Valid");
  } else {
    letter.classList.remove("Valid");
    letter.classList.add("Invalid");
}

  // Validate capital letters
  var upperCaseLetters = /[A-Z]/g;
  if(myInput.value.match(upperCaseLetters)) {
    capital.classList.remove("Invalid");
    capital.classList.add("Valid");
  } else {
    capital.classList.remove("Valid");
    capital.classList.add("Invalid");
  }

  // Validate numbers
  var numbers = /[0-9]/g;
  if(myInput.value.match(numbers)) {
    number.classList.remove("Invalid");
    number.classList.add("Valid");
  } else {
    number.classList.remove("Valid");
    number.classList.add("Invalid");
  }

  // Validate length
  if(myInput.value.length >= 8) {
    length.classList.remove("Invalid");
    length.classList.add("Valid");
  } else {
    length.classList.remove("Valid");
    length.classList.add("Invalid");
  }
}
