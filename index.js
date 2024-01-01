var express = require('express')
var ejs = require('ejs')
var mySQLmongoDB = require('./mySQLmongoDB')
var axios = require('axios');

var app = express()

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Routes

// Default route
app.get('/', (req, res) => {
    res.render("index")
})

// Displays list of stores
app.get('/stores', (req, res) => {
    mySQLmongoDB.getStores()
        .then((data) => {
            console.log(data)
            res.render("store", { "store": data })
        })
        .catch((error) => res.send(error))
})

// Edit a specific store
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

// POST request to update store
app.post('/stores/edit/:sid', (req, res) => {
    const storeId = req.params.sid;
    const updatedStore = {
        location: req.body.location,
        mgrid: req.body.mgrid,
    }

    // Update and return to stores, or render error page if an error occurs
    mySQLmongoDB.updateStore(storeId, updatedStore)
        .then(() => {
            console.log(`Store with ID ${storeId} updated successfully`)
            res.redirect('/stores')
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

// Page to add stores
app.get('/stores/add', (req, res) => {
    res.render("storeAdd")
})

// POST request to add a store
app.post('/stores/add', (req, res) => {
    const newStore = {
        sid: req.body.sid,
        location: req.body.location,
        mgrid: req.body.mgrid,
    }

    // Redirect to the stores page after successful update
    mySQLmongoDB.addStore(newStore)
        .then(() => {
            console.log(`Store added successfully`)
            res.redirect('/stores')
        })
        .catch(error => {
            console.error(error)
        })
})

// Displays list of products
app.get('/products', (req, res) => {
    mySQLmongoDB.getProducts()
        .then((data) => {
            console.log(data)
            res.render("product", { "product": data })
        })
        .catch((error) => res.send(error))
})

// Delete a specific product
app.get('/products/delete/:pid', (req, res) => {
    const productID = req.params.pid
    // If successful, delete product and redirect to products page. Otherwise render error page
    mySQLmongoDB.deleteProduct(productID)
        .then(() => {
            console.log(`Product with ID ${productID} deleted successfully`)
            res.redirect('/products')
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

// Display list of managers
app.get('/managers', (req, res) => {
    mySQLmongoDB.getManagers()
        .then((data) => {
            console.log(data)
            res.render("managers", { "managers": data })
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
        })
})

// Page to add a manager
app.get('/managers/add', (req, res) => {
    res.render("managersAdd")
})

// POST request to add a manager
app.post('/managers/add', (req, res) => {
    const newManager = {
        _id: req.body._id,
        name: req.body.name,
        salary: parseInt(req.body.salary),
    }

    // If the salary is not in the specified range, render error page
    if (newManager.salary < 30000 || newManager.salary > 70000) {
        res.render("managerError")
        return;
    }

    // Redirect to managers
    res.redirect('/managers')

    mySQLmongoDB.addManager(newManager)
        .catch(error => {
            console.error(error)
        })
})

// Start server and listen on port 3000
app.listen(3000, () => {
    console.log("Listening on port 3000")
})