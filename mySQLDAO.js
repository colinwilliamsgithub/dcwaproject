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

module.exports = { getProducts, getStores, updateStore, deleteProduct }