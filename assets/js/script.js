// $(function () {
//     setFixedHeader();

//     window.addEventListener("scroll", (event) => {
//         setFixedHeader()
//     });

//     function setFixedHeader() {
//         if ($(window).width() >= 768) {
//             if (window.scrollY > 123) {
//                 $('#header').addClass('sticky');
//             } else {
//                 $('#header').removeClass('sticky');
//             }
//         }
//         else{
//             $('#header').addClass('sticky cl-dark');
//         }
//     }
//     window.setTimeout(() => {
//         $('#CLLoading').fadeOut();
//     }, 400)
// })
// $(document).ready(function(){
//     new WOW().init();
// })
// document.getElementById("mc-embedded-subscribe").addEventListener("click", function () {
//     var email = document.getElementById("mce-EMAIL").value;
//     if (validateEmail(email)) {
//         $.ajax({
//             type: 'post',
//             url: 'https://subscribe.metabase.build',
//             data: JSON.stringify({
//                 email: email,
//                 project: 'Codelight'
//             }),
//             contentType: "application/json; charset=utf-8",
//             success: function (res) {
//                 document.getElementById("message").innerHTML = "Your subscription has been successful.";
//                 bootstrap.Modal.getOrCreateInstance(document.getElementById('SubscribeModal')).show();
//             },
//             error: function (err) {
//                 document.getElementById("message").innerHTML = "Your subscription could not be saved. Please try again.";
//                 bootstrap.Modal.getOrCreateInstance(document.getElementById('SubscribeModal')).show();
//             }
//         });
//     }
// });
// function validateEmail(email) {
//     return /^\w+([+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
// }

jQuery.noConflict();

(function ($) {
  // your code here, using the $
  $(function () {
    setFixedHeader();

    window.addEventListener("scroll", (event) => {
      setFixedHeader();
    });

    function setFixedHeader() {
      if ($(window).width() >= 768) {
        if (window.scrollY > 123) {
          $("#header").addClass("sticky");
        } else {
          $("#header").removeClass("sticky");
        }
      } else {
        $("#header").addClass("sticky cl-dark");
      }
    }
    window.setTimeout(() => {
      $("#CLLoading").fadeOut();
    }, 400);
  });
  $(document).ready(function () {
    new WOW().init();
  });
  document
    .getElementById("mc-embedded-subscribe")
    .addEventListener("click", function () {
      var email = document.getElementById("mce-EMAIL").value;
      if (validateEmail(email)) {
        $.ajax({
          type: "post",
          url: "https://subscribe.metabase.build",
          data: JSON.stringify({
            email: email,
            project: "Codelight",
          }),
          contentType: "application/json; charset=utf-8",
          success: function (res) {
            document.getElementById("message").innerHTML =
              "Your subscription has been successful.";
            bootstrap.Modal.getOrCreateInstance(
              document.getElementById("SubscribeModal")
            ).show();
          },
          error: function (err) {
            document.getElementById("message").innerHTML =
              "Your subscription could not be saved. Please try again.";
            bootstrap.Modal.getOrCreateInstance(
              document.getElementById("SubscribeModal")
            ).show();
          },
        });
      }
    });
  function validateEmail(email) {
    return /^\w+([+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  }
})(jQuery);
