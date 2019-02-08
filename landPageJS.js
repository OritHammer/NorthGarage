var myIndex = 0;
        carousel();
    
       function carousel() {
         var i;
         var x = document.getElementsByClassName("mySlides");
           for (i = 0; i < x.length; i++) {
             x[i].style.display = "none";  
              }
           myIndex++;
          if (myIndex > x.length) {myIndex = 1}    
              x[myIndex-1].style.display = "block";  
       setTimeout(carousel, 2000); // Change image every 2 seconds
      }

    /**********login/signUp  window*************/
    // Get the login window
    var loginWindowComp = document.getElementById('loginWindows');
    // Get the sign up window
    var signUpWindowComp = document.getElementById('signUpWindows');
    // When the user clicks anywhere outside of the login/signup window, close it
    window.onclick = function (event) {
      if (event.target == loginWindowComp) {
        loginWindowComp.style.display = "none";
      }
      else if (event.target == signUpWindowComp) {
        signUpWindowComp.style.display = "none";
      }
    }

/*-----------------------------------------------------------------------------------*/


