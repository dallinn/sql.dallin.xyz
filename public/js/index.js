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
                //opt.value = res.indexOf(t);
                opt.value = t.option + ',' + res.indexOf(t);
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

    var selectValue = (select.value).split(',')[1]; 
    var suboptions = types[selectValue].suboptions;
    suboptions.forEach(function(s){
        var check = document.createElement('input');
        check.type = 'checkbox';
        check.id = s;
        check.name = 'so';
        //TODO: format values
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
    genForm.style.display = 'block';
    genForm.onsubmit = function(){
        var all = table.children;

        for (var i = 0; i<all.length; i++){
            for (var j = 0; j<all[i].children.length; j++){
                var hidden = document.createElement('input');
                hidden.type = 'hidden';
                if (all[i].children[j].tagName == 'H4'){
                    hidden.name = 'option';
                    hidden.value = all[i].children[j].innerHTML;
                    console.log('OPTION: ' + all[i].children[j].innerHTML);
                } else {
                    hidden.name = 'so';
                    hidden.value = all[i].children[j].innerHTML;
                    console.log('SUBOPTIONS:' + all[i].children[j].innerHTML);
                }
            genForm.appendChild(hidden);
            }
        }
        console.log(genForm.children);
        //event.preventDefault();

    }
}
