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

function getProducts() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT ps.*, s.location, p.productdesc FROM product_store ps INNER JOIN (store s, product p) ON ps.pid = p.pid AND ps.sid = s.sid ORDER BY ps.pid asc')
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

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
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = { getProducts, getStores, updateStore }