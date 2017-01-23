window.onload = function() {
}

var types = getTypes();
var select = document.getElementById("type");
var div = document.getElementById("subtypes");

select.onchange = function() {
    while(div.hasChildNodes()){
        div.removeChild(div.lastChild);
    }
    var selectValue = select.value; 
    var suboptions = types[selectValue].suboptions;
    suboptions.forEach(function(s){
        var check = document.createElement("input");
        check.type = "checkbox";
        check.id = s;
        check.value = s;

        var label = document.createElement("label");
        label.htmlFor = s;
        label.appendChild(document.createTextNode(s));

        div.appendChild(check);
        div.appendChild(label);
        div.appendChild(document.createElement("br"));
    });
}
// ajax to /types uri, sets all option tags from api
function getTypes(){
    var select = document.getElementById("type");
    var types = [];
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);
            res.forEach(function(t) {
                var opt = document.createElement('option');
                opt.value = res.indexOf(t);
                opt.innerHTML = t.option;
                select.appendChild(opt); 
                types.push(t)
            });
        }
    };
    xhttp.open("GET", "/types?json=1", true);
    xhttp.send();


    return(types);

}

