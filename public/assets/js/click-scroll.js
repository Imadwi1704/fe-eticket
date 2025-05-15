// jquery-click-scroll
// by syamsul'isul' Arifin

var sectionArray = [1, 2, 3, 4, 5, 6];

$.each(sectionArray, function(index, value) {
  // Ambil elemen section terlebih dahulu
  var $section = $('#section_' + value);
  
  // Hanya lanjutkan jika elemen ditemukan
  if ($section.length) {
    // Event scroll: perbarui aktif pada navbar berdasarkan posisi scroll
    $(document).scroll(function() {
      var offsetSection = $section.offset().top - 83;
      var docScroll = $(document).scrollTop();
      var docScroll1 = docScroll + 1;
      
      if (docScroll1 >= offsetSection) {
        $('.navbar-nav .nav-item .nav-link').removeClass('active');
        $('.navbar-nav .nav-item .nav-link:link').addClass('inactive');
        $('.navbar-nav .nav-item .nav-link').eq(index).addClass('active');
        $('.navbar-nav .nav-item .nav-link').eq(index).removeClass('inactive');
      }
    });
    
    // Click event untuk melakukan scroll ke target section
    $('.click-scroll').eq(index).click(function(e) {
      e.preventDefault();
      var offsetClick = $section.offset().top - 83;
      $('html, body').animate({
        scrollTop: offsetClick
      }, 300);
    });
  }
});

$(document).ready(function() {
  $('.navbar-nav .nav-item .nav-link:link').addClass('inactive');    
  $('.navbar-nav .nav-item .nav-link').eq(0).addClass('active');
  $('.navbar-nav .nav-item .nav-link:link').eq(0).removeClass('inactive');
});
