var express    = require('express');
var hbs        = require('hbs');
var app        = express();
var faker      = require('faker');
var json2csv   = require('json2csv');
var bodyParser = require('body-parser');

app.set('view engine', 'hbs');

app.use(bodyParser.json()); 

app.use('/public/', express.static('public'));

app.get('/', (req,res) => {
    res.render('home');
});

app.post('/generate', (req,res) => {
    var all = req.body;
    var name = req.body.name;
    var count = req.body.count;
    var format = req.body.format;
    var tables = req.body.tables;

    var returned = {};

    tables.forEach(function(t){
        var tt = [];
        for (j=count; j > 0; j--){
            var tt1 = [];
                for (var i = 0;i<t.suboptions.length;i++){
                    tt1.push({ [t.suboptions[i]]: faker[t.option][t.suboptions[i]]()} );
                }
            tt.push(tt1);
        }
        returned[t.option] = tt;
    });

    if (format === 'JSON') {
        res.send(JSON.stringify(returned));
    } else if (format === 'CSV') {
        //TODO: proper csv format
        //var data = Object.keys(returned).map(function(key) {
        //    console.log(key);
        //    return returned[key];
        //});
        //var csv = json2csv({ data: data, fields: Object.keys(returned) });
        //res.send(data);
        res.send('CSV coming soon');
    } else {
        res.send('Undefined format'); 
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
    console.log(1);
    var types = [];
    var options = Object.keys(faker)
    //remove uneeded faker types
    options.splice(0,5);
    options.splice(1,1);

    options.forEach(function(o) {
        var t = {};
        t.option = o;
        t.suboptions = Object.keys(faker[o]);
        types.push(t);
    });
    
    return types;
}
