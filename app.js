var express = require('express');
var hbs     = require('hbs');
var app     = express();
var faker   = require('faker');
var json2csv= require('json2csv');

app.set('view engine', 'hbs');

app.get('/', (req,res) => {
    var types = getFakerTypes();

    res.render('home', {
        types: types,
    });
});

app.get('/generate', (req,res) => {
    var count = req.query.count;
    var format = req.query.format;
    var type = req.query.type;
    var table = [];
    
    for (count; count > 0; count--) {
        var data = {
           // name: faker.name.findName(),
           // phone: faker.phone.phoneNumber(),
           // email: faker.internet.email(),
            type: faker.fake([type])
        };
        table.push(data);
    }

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
    
    if (req.query.json){res.send(types)};

    res.render('types', {
        types: types,
    });

});

app.listen(3000);

function getFakerTypes(){
    var types = [];
    var options = Object.keys(faker)
    //remove first three options from faker, unneeded
    options.splice(0,3);

    options.forEach(function(o) {
        var t = {};
        t.option = o;
        t.suboptions = Object.keys(faker[o]);
        types.push(t);
    });
    
    return types;
}
