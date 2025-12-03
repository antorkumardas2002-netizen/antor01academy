// Toggle mobile menu
function toggleMenu() {
  document.getElementById("navbar").classList.toggle("active");
}

// Form submission (demo only)
document.getElementById("admissionForm").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Thank you! Your admission form has been submitted.");
});
function checkAccount() {
    // Alert message
    let message = "First, you have to create an account.\nIf you already have an account, please login.";
    
    // Show confirm dialog with option to go to login or signup
    if(confirm(message + "\n\nClick OK to Login or Cancel to Sign Up.")) {
        // OK clicked -> redirect to login
        window.location.href = "login.html";
    } else {
        // Cancel clicked -> redirect to signup
        window.location.href = "signup.html";
    }
}
function checkAccount() {
    if(confirm("First, create an account. Already have one? Click OK to login.")){
        window.location.href = "login.html";
    } else {
        window.location.href = "signup.html";
    }
}
