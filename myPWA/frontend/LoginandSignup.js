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
  container.style.height="600px"; 
  loginTitle.style.height="-60%"; 
  loginTitle.style.display="none"; 
  registerTitle.style.top="50%"; 
  registerTitle.style.display= "block"; 

}


//Input Validation for the form 
var myInput = document.getElementById("reg-pass");
var letter = document.getElementById("letter");
var capital=document.getElementById("capital");
var number=document.getElementById("number");
var specialCharacter=document.getElementById("specialCharacter");
var length=document.getElementById("length");

//Display the message box
myInput.onfocus = function() {
  document.getElementById("Password-message").style.display="block";

}

//Hide message box 
myInput.onblur = function() {
  document.getElementById("Password-message").style.display ="none"; 

}
myInput.onkeyup = function() { //event listner which watches for when the user releases key on keyboard.

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
//Validate for special characters
  var SpecialCharacter = /[^a-zA-Z\d]/g;
  if(myInput.value.match(SpecialCharacter)) {
    specialCharacter.classList.remove("Invalid");
    specialCharacter.classList.add("Valid");
  } else {
    specialCharacter.classList.remove("Valid");
    specialCharacter.classList.add("Invalid");
  }

  // Validate the length
  if(myInput.value.length >= 8) {
    length.classList.remove("Invalid");
    length.classList.add("Valid");
  } else {
    length.classList.remove("Valid");
    length.classList.add("Invalid");
  }
  //Hide the password validation check section once all of the criteria is met. 
  if (
    myInput.value.match(lowerCaseLetters) && 
    myInput.value.match(upperCaseLetters) && 
    myInput.value.match(numbers) && 
    myInput.value.match(SpecialCharacter) && 
    myInput.value.length >=8   
  ) {
    document.getElementById("Password-message").style.display ="none";
  }
};


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

    //Checks and displays error message if the username or email used for registration already exists in the database.
    const usernameField = document.getElementById("reg-username");
    const UsernameError= document.getElementById("usernameerror");
    const emailError= document.getElementById("emailerror");
    const emailField = document.getElementById("reg-email");

    if(error.message.includes("Username already exists")) { //Message for used username. 
      usernameField.classList.add("error");
      UsernameError.style.display ="block";
      UsernameError.textContent= "Username already exists. Try a different username";
    } else if (error.message.includes("Email already exists")) { //Message for used email. 
      emailField.classList.add("error");
      emailError.style.display ="block";
      emailError.textContent="Try a different Email";
    }else {
       alert("Signup failed: " + error.message);
    }
  });
});

//hide visiblity of the error message for Usernames which are repeated
document.getElementById("reg-username").addEventListener("input", function(){
  this.classList.remove("error");
  document.getElementById("usernameerror").style.display ="none";
})

document.getElementById("reg-email").addEventListener("input", function(){
  this.classList.remove("error");
  document.getElementById("emailerror").style.display ="none";
})

//Intialises items for the limit of attempts and time out function
let attemptsLeft = 3; 
let lockout = false; 
let lockouttime= 0;  
const lockoutDuration = 240000; //Duration of time out, 4 minutes. 
const passLimitDiv = document.getElementById("Pass_limit");

//Login Form functionality 
loginform.addEventListener("submit", function(event) {
  event.preventDefault();

  const now = Date.now(); // assigns current timestap in milliseconds

  if(lockout && now < lockouttime) {
    const MinutesLeft = Math.ceil((lockouttime -now ) /60000); //Displays the time remaining in minutes. 
    passLimitDiv.textContent = `Too many failed attempts. Try again in ${MinutesLeft} minute(s).`; //Dislays error message.
   
    return;
  }

  if (lockout && now >= lockouttime) {
    attemptsLeft= 3;  
    lockout =false; 
    passLimitDiv.textContent = "";
  }



  const Username = document.getElementById("log-username").value.trim(); //Gets rid of whitespace
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
      attemptsLeft=3;
      alert("Login Successful")
      window.location.href ="Home.html"; //Redirect page when successful
    } else{
      attemptsLeft--;

      if (attemptsLeft >0 ) {
        passLimitDiv.textContent = `Incorrect username and/or password, try again. ${attemptsLeft} attempt(s) remaining.`;
        passLimitDiv.style.color="red";
      } else {
        lockout= true; 
        lockouttime = Date.now() + lockoutDuration;
        passLimitDiv.textContent ="Too many failed attempts. Please wait 4 minutes.";
        passLimitDiv.style.color="red";
      }
    }
  })
  .catch(error => {
    console.error("Login error:", error.message);
    passLimitDiv.textContent ="Network error:"+ error.message;
    passLimitDiv.style.color="red";
  });
});

document.getElementById("log-username").addEventListener("input", () => {
  passLimitDiv.textContent = "";
});

document.getElementById("logpass").addEventListener("input", () => {
  passLimitDiv.textContent="";
})


