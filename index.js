var express = require('express')
var ejs = require('ejs')
var mySQLmongoDB = require('./mySQLmongoDB')
var axios = require('axios');

var app = express()

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render("index")
})

app.get('/stores', (req, res) => {
    mySQLmongoDB.getStores()
        .then((data) => {
            console.log(data)
            res.render("store", { "store": data })
        })
        .catch((error) => res.send(error))
})

app.get('/stores/edit/:sid', (req, res) => {
    const storeId = req.params.sid
    mySQLmongoDB.getStores()
        .then((data) => {
            const currentStore = data.find(store => store.sid === storeId)
            console.log(data)
            res.render("storeUpdate", { "store": currentStore })
        })
        .catch((error) => res.send(error))
})

// Add a new route for handling the POST request
app.post('/stores/edit/:sid', (req, res) => {
    const storeId = req.params.sid;
    const updatedStore = {
        location: req.body.location,
        mgrid: req.body.mgrid,
    }

    mySQLmongoDB.updateStore(storeId, updatedStore)
        .then(() => {
            console.log(`Store with ID ${storeId} updated successfully`)
            res.redirect('/stores') // Redirect to the stores page after successful update
        })
        .catch(error => {
            console.error(error)
            mySQLmongoDB.getStores()
                .then((data) => {
                    const currentStore = data.find(store => store.sid === storeId)
                    console.log(data)
                    res.render("storeError", { "store": currentStore })
                })
                .catch((error) => res.send(error))
        });
});

app.get('/stores/add', (req, res) => {
    res.render("storeAdd")
})

app.post('/stores/add', (req, res) => {
    const newStore = {
        sid: req.body.sid,
        location: req.body.location,
        mgrid: req.body.mgrid,
    }

    mySQLmongoDB.addStore(newStore)
        .then(() => {
            console.log(`Store added successfully`)
            res.redirect('/stores') // Redirect to the stores page after successful update
        })
        .catch(error => {
            console.error(error)
        })
})

app.get('/products', (req, res) => {
    mySQLmongoDB.getProducts()
        .then((data) => {
            console.log(data)
            res.render("product", { "product": data })
        })
        .catch((error) => res.send(error))
})

app.get('/products/delete/:pid', (req, res) => {
    const productID = req.params.pid
    mySQLmongoDB.deleteProduct(productID)
        .then(() => {
            console.log(`Product with ID ${productID} deleted successfully`)
            res.redirect('/products') // Redirect to the product page after successful update
        })
        .catch(() => {
            mySQLmongoDB.getProducts()
            .then((data) => {
                const currentProduct = data.find(product => product.pid === productID)
                console.log(data)
                res.render("productError", { "product": currentProduct })
            })
            .catch((error) => res.send(error))
        })
})

app.get('/managers', (req, res) => {
    mySQLmongoDB.findAll()
        .then((data) => {
            console.log("OK")
            console.log(data)
            res.render("managers", { "managers": data })
        })
        .catch((error) => {
            console.log("NOT OK")
            console.log(error)
            res.send(error)
        })
})

app.get('/managers/add', (req, res) => {
    res.render("managersAdd")
})

app.post('/managers/add', (req, res) => {
    const newManager = {
        _id: req.body._id,
        name: req.body.name,
        salary: req.body.salary,
    }

    res.redirect('/managers')

    mySQLmongoDB.addManager(newManager)
        .catch(error => {
            console.error(error)
        })
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})