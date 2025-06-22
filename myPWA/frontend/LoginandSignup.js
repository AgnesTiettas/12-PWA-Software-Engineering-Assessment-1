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
