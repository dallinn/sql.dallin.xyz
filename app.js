var express    = require('express');
var hbs        = require('hbs');
var app        = express();
var faker      = require('faker');
var json2csv   = require('json2csv');
var bodyParser = require('body-parser');
var fs         = require('fs');

app.set('view engine', 'hbs');

app.use(bodyParser.json()); 

app.use('/public/', express.static('public'));
app.use('/json/', express.static('json'));

app.get('/', (req,res) => {
    res.render('home');
});

app.post('/generate', (req,res) => {
    var all = req.body;
    var name = req.body.name;
    var count = req.body.count;
    var format = req.body.format;
    var tables = req.body.tables;

    if (count > 100000) return res.sendStatus(501);

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

    var json = JSON.stringify(returned);

    if (format === 'JSON') {
        var f = fileDateFormat();
        var date = f.date;
        var dir = './json/' + f.dir;

        if (!fs.existsSync(dir)) fs.mkdirSync(dir);

        var filename = dir + '/' + name + date +'.json';
        fs.writeFile(filename, json, 'utf8', function(err){
            if(err) throw err;
            res.send(filename);
        });
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

function getFakerTypes() {
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

function fileDateFormat() {
    var d = new Date();
    var m = d.getMonth();
    var day = d.getDate();
    var h = d.getHours();
    var min = d.getMinutes();
    var ms = d.valueOf();
    var dirform = m + '-' + day;
    var fileform = m + '-' + day + '_' + h + '-' + min + '-' + ms;
    return({ dir: dirform, date: fileform });
    
}
