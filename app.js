var express = require('express');
var hbs     = require('hbs');
var app     = express();
var faker   = require('faker');
var json2csv= require('json2csv');

app.set('view engine', 'hbs');

app.use('/public/', express.static('public'));

app.get('/', (req,res) => {
    var types = getFakerTypes();

    res.render('home', {
        types: types,
    });
});

app.get('/generate', (req,res) => {
    var name = req.query.name;
    var count = req.query.count;
    var format = req.query.format;
    var option = req.query.option;
    var suboption = req.query.so;
    if (typeof suboption === 'string') suboption = suboption.split();

    var table = [];

    for (count; count > 0; count--) {
        var data = {};
            for (var i = 0;i < suboption.length; i++) {
                data[suboption[i]] = faker[option][suboption[i]]();
            }
        table.push(data);
    }

    if (format === 'JSON') {
        res.send({[name]: table});
    } else if (format === 'CSV') {
        var table = json2csv({data: table, fields: Object.keys(data)});
        res.send(table);
    } else {
       table = "Undefined format"; 
    }
});

app.get('/types',(req,res) => {
    var types = getFakerTypes();
    
    if (req.query.json){
        res.send(types)
    } else {
        res.render('types', {
            types: types,
        });
    };
});

app.listen(3000);

function getFakerTypes(){
    var types = [];
    var options = Object.keys(faker)
    //remove first three options from faker and then 5th, unneeded
    //TODO: remove helpers option
    options.splice(0,3);
    options.splice(1,1);

    options.forEach(function(o) {
        var t = {};
        t.option = o;
        t.suboptions = Object.keys(faker[o]);
        types.push(t);
    });
    
    return types;
}
