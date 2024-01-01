var express = require('express')
var ejs = require('ejs')
var mySQLDAO = require('./mySQLDAO')
var axios = require('axios');

var app = express()

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render("index")
})

app.get('/stores', (req, res) => {
    mySQLDAO.getStores()
        .then((data) => {
            console.log(data)
            res.render("store", { "store": data })
        })
        .catch((error) => res.send(error))
})

app.get('/stores/edit/:sid', (req, res) => {
    const storeId = req.params.sid;
    mySQLDAO.getStores()
        .then((data) => {
            const currentStore = data.find(store => store.sid === storeId);
            console.log(data)
            res.render("storeupdate", { "store": currentStore })
        })
        .catch((error) => res.send(error))
})

// Add a new route for handling the POST request
app.post('/stores/edit/:sid', (req, res) => {
    const storeId = req.params.sid;
    const updatedStore = {
        location: req.body.location,
        mgrid: req.body.mgrid,
    };

    mySQLDAO.updateStore(storeId, updatedStore)
        .then(() => {
            console.log(`Store with ID ${storeId} updated successfully`);
            res.redirect('/stores'); // Redirect to the stores page after successful update
        })
        .catch(error => {
            console.error(error);
            res.send(error);
        });
});

app.get('/products', (req, res) => {
    mySQLDAO.getProducts()
        .then((data) => {
            console.log(data)
            res.render("product", { "product_store": data })
        })
        .catch((error) => res.send(error))
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})