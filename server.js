
express = require('express');
bodyParser = require('body-parser');
mongoClient = require('mongodb').MongoClient;

app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view-engine', 'ejs');

var db;
var brands = [];
var clothes = [];

mongoClient.connect('mongodb://root:root@ds019936.mlab.com:19936/brands-cloth', (err, database) => {
    if (err) return console.log(err);
    db = database;
    app.listen(3000, function() {
        console.log('Listening on port 3000');
    });    
});


app.get('/', (req, res) => {
    res.render('index.ejs',{"formattedString" : ""});
});

app.post('/search', (req, res) => {
    var formattedString = formatString(req.body.name, res);

   
});

function elementExists(array, element) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == element.toLowerCase()) return i;
    }
    return null;
}

function formatString(value, res) {
    tokens = value.split(' ');
    var brandNames = [];
    var clothNames = [];
    var string = [];

    brands = db.collection('brands').find().toArray((err, results) => {
        results.forEach(function(item) {
            brand = item.name.split(' ');
            if (brand.length > 1) {
                brand.forEach(function(element) {
                    brandNames.push(element);
                }, this);
            } else {
                brandNames.push(brand[0]);
            }      
        }, this);
    });

    clothes = db.collection('clothes').find().toArray((err, results) => {
        results.forEach(function(item) {
            clothNames.push(item.name);
        }, this);
    });

    setTimeout(function() {
        console.log(brandNames)
        tokens.forEach(function(token) {
            //Bold it
            if (elementExists(brandNames, token) != null){
                token = token.bold();
            } else if (elementExists(clothNames, token) != null) { //Itallic it
                token = token.italics();
            }
            string.push(token);
        }, this);

        res.render('index.ejs', {"formattedString" : string.join(' '), "value" : value});
    }, 1000);
}