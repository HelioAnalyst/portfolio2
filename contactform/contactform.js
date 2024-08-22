jQuery(document).ready(function ($) {
  "use strict";

  // Contact form submission
  $('form.contactForm').submit(function (e) {
    e.preventDefault(); // Prevent default form submission behavior

    var form = $(this),
      f = form.find('.form-group'),
      ferror = false,
      emailExp = /^[^\s()<>@,;:\/]+@\w[\w.-]+\.[a-z]{2,}$/i;

    f.children('input').each(function () { // Validate all inputs
      var i = $(this); // Current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // Error flag for current input
        var pos = rule.indexOf(':', 0);
        var exp = rule.substr(pos + 1, rule.length);

        switch (rule.substr(0, pos)) {
          case 'required':
            if (i.val().trim() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;

          case 'email':
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;

          case 'checked':
            if (!i.is(':checked')) {
              ferror = ierror = true;
            }
            break;

          case 'regexp':
            exp = new RegExp(exp);
            if (!exp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });

    f.children('textarea').each(function () { // Validate all textareas
      var i = $(this); // Current textarea
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // Error flag for current textarea
        var pos = rule.indexOf(':', 0);
        var exp = rule.substr(pos + 1, rule.length);

        switch (rule.substr(0, pos)) {
          case 'required':
            if (i.val().trim() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') != undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });

    if (ferror) return false;

    var action = form.attr('action') || '/contactform/contactform.php'; // Default action URL

    $.ajax({
      type: "POST",
      url: action,
      data: form.serialize(), // Serialize form data
      dataType: 'json', // Expect a JSON response
      success: function (response) {
        if (response.status === 'success') {
          $("#sendmessage").addClass("show").html(response.message);
          $("#errormessage").removeClass("show");
          form.find("input, textarea").val(""); // Clear form fields
        } else {
          $("#sendmessage").removeClass("show");
          $("#errormessage").addClass("show").html(response.message);
        }
      },
      error: function (xhr, status, error) {
        $("#sendmessage").removeClass("show");
        $("#errormessage").addClass("show").html("An error occurred. Please try again later.");
      }
    });

    return false; // Prevent default form submission
  });

});
