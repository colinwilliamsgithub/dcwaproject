var pmysql = require('promise-mysql')
var pool;

pmysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'proj2023'
})
    .then((p) => {
        pool = p
    })
    .catch((e) => {
        console.log("pool error:" + e)
    })

const MongoClient = require('mongodb').MongoClient

var coll;

MongoClient.connect('mongodb://127.0.0.1:27017')
    .then((client) => {
        db = client.db('proj2023MongoDB')
        coll = db.collection('managers')
    })
    .catch((error) => {
        console.log(error.message)
    })

// Function to get store info from database
function getStores() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM store')
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

// Function to update a store in the database
function updateStore(storeId, updatedStore) {
    const { location, mgrid } = updatedStore;

    const query = `UPDATE store SET location = ?, mgrid = ? WHERE sid = ?`;

    return new Promise((resolve, reject) => {
        pool.query(query, [location, mgrid, storeId], (error, results) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
}

// Function to add a store to the database
function addStore(newStore) {
    const { sid, location, mgrid } = newStore;

    const query = `INSERT INTO store (sid, location, mgrid) VALUES (?, ?, ?)`;

    return new Promise((resolve, reject) => {
        pool.query(query, [sid, location, mgrid], (error, results) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
}

// Function to get product info from the database
function getProducts() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT p.pid, s.sid, ps.Price, s.location, p.productdesc FROM product p LEFT JOIN (store s, product_store ps) ON ps.pid = p.pid AND ps.sid = s.sid ORDER BY p.pid asc;')
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

// Function to delete product info from the database
function deleteProduct(productID) {

    const query = `DELETE FROM product WHERE pid = ?`;

    return new Promise((resolve, reject) => {
        pool.query(query, [productID], (error, results) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
}

// Function to get manager info from the database
function getManagers() {
    return new Promise((resolve, reject) => {
        var cursor = coll.find({}).sort({ "_id": 1 })
        cursor.toArray()
            .then((documents) => {
                resolve(documents)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// Function to add manager info to the database
function addManager(newManager) {
    return new Promise((resolve, reject) => {
        coll.insertOne(newManager, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = { getProducts, getStores, updateStore, addStore, deleteProduct, getManagers, addManager }