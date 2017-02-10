var types = getTypes();
var select = document.getElementById('type');
var div = document.getElementById('subtypes');
var table = document.getElementById('table');

select.onchange = function(){
    showSubOptions();
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
                opt.value = t.option;
                opt.innerHTML = t.option;
                select.appendChild(opt); 
                types.push(t)
            });
        }
    };
    xhttp.open('GET', '/types?json=1', true);
    xhttp.send();

    return(types);

}
function showSubOptions(){
    while(div.hasChildNodes()){
        div.removeChild(div.lastChild);
    }

    var selectValue = select.value; 
    var suboptions = types.filter(function(v){ return v.option === selectValue })[0].suboptions; 
    suboptions.forEach(function(s){
        var check = document.createElement('input');
        check.type = 'checkbox';
        check.id = s;
        check.name = 'so';
        //TODO: format values for human readability on front end
        check.value = s;

        var label = document.createElement('label');
        label.htmlFor = s;
        label.appendChild(document.createTextNode(s));

        div.appendChild(check);
        div.appendChild(label);
        div.appendChild(document.createElement('br'));
    });

    var addToB = document.createElement('input');
    addToB.type = 'submit';
    addToB.value = 'Add to Table';
    div.appendChild(addToB);

}

var form = document.getElementById('basketAdder');
form.onsubmit = function(){
    event.preventDefault();
    addDataToBasket();
}


function addDataToBasket(){
    var type = document.getElementById('type');
        type = type.options[type.selectedIndex].value.split(',')[0];
    var checks = document.getElementsByName('so');
    var subtypes = [];
    for (var i=0;i<checks.length;i++){
        if (checks[i].checked){
            subtypes.push(checks[i].value);
        }
    }
    //if (subtypes) subtypes = subtypes.substring(1);
    var slist = document.createElement('div');
    table.appendChild(slist);
    var head = document.createElement('h4');
    var h = document.createTextNode(type);
    head.appendChild(h);
    slist.appendChild(head);

    subtypes.forEach(function(s){
        var item = document.createElement('li');
        var iv = document.createTextNode(s); 
        item.appendChild(iv);
        slist.appendChild(item);
    });

    var genForm = document.getElementById('generate');
    var format;

    document.getElementById('json').onclick = function() {
        format = this.value;
    }
    document.getElementById('csv').onclick = function() {
        format = this.value;
    }

    genForm.style.display = 'block';
    genForm.onsubmit = function(event){
        event.preventDefault();
        var send = {
            name: event.target[0].value,
            count: event.target[1].value,
            format: format
        };

        var body = [];
        var groups = table.getElementsByTagName('div');
        for (var i = 0; i<groups.length; i++){
            var data = {};

            var opt = groups[i].firstChild.innerHTML;
            data.option = opt;

            var sopts = groups[i].getElementsByTagName('li');
            var s = [];
            for (var j = 0; j<sopts.length; j++){
                s.push(sopts[j].innerHTML);
            }
            data.suboptions = s;
            body.push(data);
        }
            send.tables = body; 

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/generate");
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.onreadystatechange = function(){
            if(xhttp.readyState == 4 && xhttp.status == 200) {
                console.log(xhttp.responseText);
            }
        }
        xhttp.send(JSON.stringify(send));
    }
}
