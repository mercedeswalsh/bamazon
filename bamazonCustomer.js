// this will first deploy all of the items available for sale (id's, names, & prices)
// prompt with two messages:
// 'what is the id of the product you would like to buy?'
// 'how many units of that product would you like to buy?'
// once customer makes order, app should check if store has enough in stock for customer's order
// if not, app should log 'insufficient stock!' and prevent order from going through
// if we have enough in stock, fulfil customers order which means:
// -updating SQL db to reflect remaining quantity
// -once update goes through, show customer total cost of their purchase

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

// check if number is positive
function validate(value) {
	const integer = Number.isInteger(parseFloat(value))
	const sign = Math.sign(value)

	if (integer && (sign === 1)) {
		return true
	} else {
		return 'enter whole positive number please'
	}
}

// function to prompt inquirer questions and purchase from bamazon
function buyItems () {

	// which item id & how many
	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'what is the id of the item you would like to buy?',
			validate: validate,
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'how many of the item would you like?',
			validate: validate,
			filter: Number
		}
	]).then(function(input) {

		const item = input.item_id
		const quantity = input.quantity

		// check item stock
		const query = 'SELECT * FROM products WHERE ?'

		db.query(query, {item_id: item}, function(e, data) {
			if (e) {
                console.log(e)
            }

            // error if item isn't from db
			if (data.length === 0) {
				console.log('404 error: item not found')
				listItems()

			} else {
				const product = data[0]

				// if item is in stock
				if (quantity <= product.stock_quantity) {
					console.log('item in stock, confirming order')

					// db update
					const queryUpdate = 'UPDATE products SET stock_quantity = ' + (product.stock_quantity - quantity) + ' WHERE item_id = ' + item

					// update stock inventory
					db.query(queryUpdate, function(e, data) {
						if (e) {
                            console.log(e)
                        }

						console.log('order placed: your total is $' + product.price * quantity)
						console.log('thanks for shopping, please come again')
						console.log('-----------------------------------------')

						// exit console process
						db.end()
					})
				} else {
					console.log('item not in stock, sorry.')
					console.log('please update order')
					console.log('-----------------------------------------')

					listItems()
				}
			}
		})
	})
}

// function to list items from db
function listItems () {
    console.log('---------------! bamazon !---------------')
    db.query(
        'SELECT * FROM products', function (e, r) {
            if (e) {
                console.log(e)
            }
            for (let i=0; i<r.length; i++) {
                console.log(r[i].item_id + ' // ' + r[i].product_name + ' // ' + r[i].price)
                console.log('-----------------------------------------')
            }
            buyItems(r)
    })
}

// bamazon will start app
function bamazon () {

	// lists the items
	listItems()
}

// running app originally
bamazon()
