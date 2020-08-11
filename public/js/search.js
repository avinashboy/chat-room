document.getElementById("keyword").addEventListener("keyup", function () {
  var content = $(".chumma");
  var form = $("body");
  var searchTerm = this.value;
  console.log(searchTerm)
  var options = {};
  var values = form.serializeArray();
  /* Because serializeArray() ignores unset checkboxes */
  values = values.concat(
    form.find("input[type='checkbox']:not(:checked)").map(
      function () {
        return {
          "name": this.name,
          "value": "false"
        }
      }).get()
  );
  $.each(values, function (i, opt) {
    var key = opt.name;
    var val = opt.value;
    if (key === "keyword" || !val) {
      return;
    }
    if (val === "false") {
      val = false;
    } else if (val === "true") {
      val = true;
    }
    options[key] = val;
  });
  content.unmark();
  content.mark(searchTerm, options);

}, false);

