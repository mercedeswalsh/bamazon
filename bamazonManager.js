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

// validations
// check if number is positive
function validatePos(value) {
	const integer = Number.isInteger(parseFloat(value))
	const sign = Math.sign(value)

	if (integer && (sign === 1)) {
		return true
	} else {
		return 'enter whole positive number please'
	}
}

// checks if number is positive
function validateNum(value) {
	const number = (typeof parseFloat(value)) === 'number'
	const positive = parseFloat(value) > 0

	if (number && positive) {
		return true
	} else {
		return 'enter whole positive number please'
	}
}

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
                    'add stock to inventory',
                    'add new product'
                ],
            // where to go based on menu selection
            filter: function (option) {
                if (option === 'view all products') {
                    return 'prod'
                } else if (option === 'view low inventory') {
                    return 'low'
                } else if (option === 'add stock to inventory') {
                    return 'updateStock'
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
        } else if (input.menu === 'updateStock') {
            updateStock()
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

    db.query(query, function (e, all) {
        if (e) {
            console.log(e)
        }
        console.log('current bamazon inventory: ')
        console.log('-----------------------------------------')

        for (let i=0; i<all.length; i++) {
            console.log(all[i].item_id + ' // ' + all[i].product_name + ' // ' + all[i].price + ' // ' + all[i].stock_quantity)
            console.log('-----------------------------------------')
        }
        db.end()
    })
}

// function to show low stock inventory (less than 5)
function lowStock () {
    query = 'SELECT * FROM products WHERE stock_quantity < 5'

    db.query(query, function(e, low) {
        if (e) {
            console.log(e)
        }
        console.log('low stock inventory: ')
        console.log('-----------------------------------------')

        for (let i=0; i<low.length; i++) {
            console.log(low[i].item_id + ' // ' + low[i].product_name + ' // ' + low[i].price + ' // ' + low[i].stock_quantity)
            console.log('-----------------------------------------')
        }
        db.end()
    })
}

// function to update inventory stock to bamazon and update db
function updateStock () {
    inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: `what's the item ID for the item you are wanting to update stock quantity?`,
            validate: validateNum,
            filter: Number
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'how many of this item would you like to add into inventory?',
            validate: validateNum,
            filter: Number
        }
    ])
    .then(function(input) {
        const item = input.id
        const addStock = input.quantity

        const query = 'SELECT * FROM products WHERE ?'

        // updating with new stock
        db.query(query, {item_id: item}, function (e, itemId) {
            if (e) {
                console.log(e)
            }
            if (itemId.length === 0) {
                console.log('error 404: item not able to be added. please try again.')
                updateStock()
            } else {
                const prodUpdate = itemId[0]

                console.log('updating bamazon inventory now :-)')

                const updateDb = 'UPDATE products SET stock_quantity = ' + (prodUpdate.stock_quantity + addStock) + ' WHERE item_id = ' + item

                db.query(updateDb, function (e, stock) {
                    if (e) {
                        console.log(e)
                    }
                    console.log('stock for Item ID ' + item + ' has been updated to ' + (prodUpdate.stock_quantity + addStock))
                    db.end()
                })
            }
        })
    })
}

// function to add new product into bamazon and update db
function addProduct () {
    inquirer.prompt([
		{
			type: 'input',
			name: 'product_name',
			message: 'enter new product name:',
		},
		{
			type: 'input',
			name: 'department_name',
			message: 'enter department that new product belongs in:',
		},
		{
			type: 'input',
			name: 'price',
			message: 'enter cost of each of new item:',
			// validate: validatePos
		},
		{
			type: 'input',
			name: 'stock_quantity',
			message: 'enter how many of new item you will be adding to inventory:',
			validate: validateNum
		}
    ])
    .then(function(input) {
        console.log('adding new item to bamazon: \n    product_name = ' + input.product_name + '\n' +  
        '    department_name = ' + input.department_name + '\n' +  
        '    price = ' + input.price + '\n' +  
        '    stock_quantity = ' + input.stock_quantity)

        const query = 'INSERT INTO products SET ?'

        db.query(query, input, function (e, r, fields) {
            if (e) {
                console.log(e)
            }
            console.log('new product added to inventory. id for new item is: ' + r.insertId)
            db.end()
        })
    })
}

// bamazon will start app
function bamazon () {

	// shows manager menu
	menu()
}

// running app originally
bamazon()