window.onload = function() {
    var select = document.getElementById("type");
    var types = [];
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            types = JSON.parse(this.responseText);
            types.forEach(function(t) {
                var opt = document.createElement('option');
                opt.value = t.option;
                opt.innerHTML = t.option;
                select.appendChild(opt); 
            });
            return types;
        }
    };
    xhttp.open("GET", "/types?json=1", true);
    xhttp.send();

}

var select = document.getElementById("type");
var div = document.getElementById("subtypes");

select.onchange = function() {
    div.innerHTML = select.value; 
}

