// this will prompt with a menu first including:
// -----------------------------------------------
// -view products for sale
// >>app should list all available items (item_id, product_name, price, stock_quantity)
// -----------------------------------------------
// -view low inventory
// >>app should list items with inventory count lower than 5
// -----------------------------------------------
// -add to inventory
// >>app should display a prompt that lets manager "add more" of any item currently in bamazon (update db)
// -----------------------------------------------
// -add new product
// >>app should allow manager to add new product into bamazon (update db)

// requiring mysql2 and inquirer
const mysql = require('mysql2')
const inquirer = require('inquirer')

// connection to bamazon_db
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bamazon_db'
})

// function to list menu items
function menu() {

    // inquirer asking which item from menu
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'hello manager, what would you like to do?',
            choices: 
                [
                    'view all products',
                    'view low inventory',
                    'add to inventory',
                    'add new product'
                ],
            // where to go based on menu selection
            filter: function (option) {
                if (option === 'view all products') {
                    return 'prod'
                } else if (option === 'view low inventory') {
                    return 'low'
                } else if (option === 'add to inventory') {
                    return 'addInv'
                } else if (option === 'add new product') {
                    return 'addProd'
                } else {
                    console.log('please select an option from menu')
                    menu()
                }
            }
        }
    ])
    // which function to prompt upon menu selection
    .then(function(input) {
        if (input.menu === 'prod') {
            listItems()
        } else if (input.menu === 'low') {
            lowStock()
        } else if (input.menu === 'addInv') {
            addInventory()
        } else if (input.menu === 'addProd') {
            addProduct()
        } else {
            console.log('error 404: input invalid')
            db.end()
        }
    })
}

// function to display items from mysql db
function listItems () {
    query = 'SELECT * FROM products'

    db.query(query, function (e, data) {
        if (e) {
            console.log(e)
        }
        console.log('current bamazon inventory: ')
        console.log('-----------------------------------------')

        for (let i=0; i<r.length; i++) {
            console.log(data[i].item_id + ' // ' + data[i].product_name + ' // ' + data[i].price + ' // ' + data[i].stock_quantity)
            console.log('-----------------------------------------')
        }
        db.end()
    })
}

// function to show low stock inventory (less than 5)
function lowStock () {
    
}