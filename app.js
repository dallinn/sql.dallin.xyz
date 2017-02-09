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
    var types = getFakerTypes();

    res.render('home', {
        types: types,
    });
});

app.post('/generate', (req,res) => {
    console.log(req.body);
    console.log();

    var all = req.body;
    var name = req.body.name;
    var count = req.body.count;
    var format = req.body.format;
    var tables = req.body.tables;

    console.log('all ' + req.body);
    console.log('name ' + name);
    console.log('count ' + count);
    console.log('format ' + format);
    console.log();

    var table = [];
    var tt0 = [];

    //my algorithms professor cries as bigo soars into the eternal
    tables.forEach(function(t){
        var data = {
            [t.option]: {}
        };
        for (j=count; j > 0; j--){
            var tt1 = [];
                for (var i = 0;i<t.suboptions.length;i++){
                    // data[t.option][t.suboptions[i]] = faker[t.option][t.suboptions[i]]();
                 //   if (i == 0 && j == count) tt0.push({ [t.option]: {} });
                    tt1.push({ 
                        [t.suboptions[i]]: faker[t.option][t.suboptions[i]]()
                    });
                     
                }
           // console.log(tt1);
            tt0.push(tt1);

        }
        data[t.option] = tt0;
        table.push(data);
    });

    console.log(table);



    res.end(JSON.stringify(table));
  //  var name = req.query.name;
  //  var count = req.query.count;
  //  var format = req.query.format;
  //  var option = req.query.option;
  //  var suboption = req.query.so;
  //  if (typeof suboption === 'string') suboption = suboption.split();

  //  var table = [];

  //  for (count; count > 0; count--) {
  //      var data = {};
  //          for (var i = 0;i < suboption.length; i++) {
  //              data[suboption[i]] = faker[option][suboption[i]]();
  //          }
  //      table.push(data);
  //  }

  //  if (format === 'JSON') {
  //      res.send({[name]: table});
  //  } else if (format === 'CSV') {
  //      var table = json2csv({data: table, fields: Object.keys(data)});
  //      res.send(table);
  //  } else {
  //     table = "Undefined format"; 
  //  }
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
