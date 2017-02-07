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
    var count = req.query.count;
    var format = req.query.format;
    var option = req.query.option.split(',')[0];
    var suboption = req.query.suboption;
    if (typeof suboption === 'string') suboption = suboption.split();
    var table = [];

    console.log(suboption);
    for (count; count > 0; count--) {
        var data = {};
            for (var i = 0;i < suboption.length; i++) {
                data[suboption[i]] = faker[option][suboption[i]]();
            }
        table.push(data);
    }
    console.log(table);

    if (format === 'JSON') {

    } else if (format === 'CSV') {
        var table = json2csv({data: table, fields: Object.keys(data)});
    } else {
       table = "Undefined format"; 
    }
    res.send(table);
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
