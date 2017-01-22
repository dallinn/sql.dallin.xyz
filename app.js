var express = require('express');
var hbs     = require('hbs');
var app     = express();
var faker   = require('faker');
var json2csv= require('json2csv');

app.set('view engine', 'hbs');

app.get('/', (req,res) => {
    res.render('home', {
        option: Object.getOwnPropertyNames(faker),    
    });
});

app.get('/generate', (req,res) => {
    var count = req.query.count;
    var format = req.query.format;
    var table = [];
    
    for (count; count > 0; count--) {
        var user = {
            name: faker.name.findName(),
            phone: faker.phone.phoneNumber(),
            email: faker.internet.email(),
        };
        table.push(user);
    }

    if (format === 'JSON') {

    } else if (format === 'CSV') {
        var table = json2csv({data: table, fields: Object.keys(user)});
    } else {
       table = "Undefined format"; 
    }
    res.send(table);
});

app.get('/types',(req,res) => {
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

    res.render('types', {
        types: types,
    });

});

app.listen(3000);
