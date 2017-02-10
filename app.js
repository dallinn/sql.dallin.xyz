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

 //   desired output
 //   var returned = {
 //       users: {
 //         name: {
 //             { firstName: xxx, lastName: xxx, findName: xxx },
 //             { firstName: xxx, lastName: xxx, findName: xxx },
 //             { firstName: xxx, lastName: xxx, findName: xxx },
 //             { firstName: xxx, lastName: xxx, findName: xxx },
 //             { firstName: xxx, lastName: xxx, findName: xxx }
 //         },
 //         address: {
 //
 //         }
 //       }
 //   };

    var returned = {
        [name]: {},
    };

    //need suboption values TODO
    tables.forEach(function(t){
        var tt = [];
        for (j=count; j > 0; j--){
            var tt1 = [];
                for (var i = 0;i<t.suboptions.length;i++){
                    tt1.push(faker[t.option][t.suboptions[i]]());
                }
            tt.push(tt1);
        }
        returned[name][t.option] = tt;
    });
    
    console.log(JSON.stringify(returned));

    res.end(JSON.stringify(returned));

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
