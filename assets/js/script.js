$(function () {
    setFixedHeader();

    window.addEventListener("scroll", (event) => {
        setFixedHeader()
    });

    function setFixedHeader() {
        if (window.scrollY > 123) {
            $('#header').addClass('sticky');
        } else {
            $('#header').removeClass('sticky');
        }
    }
    
    window.setTimeout(() => {
        $('#CLLoading').fadeOut();
    }, 400)
})