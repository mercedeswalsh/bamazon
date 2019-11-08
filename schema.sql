DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;
CREATE TABLE products (
	item_id INTEGER(255) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(255) NOT NULL,
	department_name VARCHAR(255) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INTEGER(255) NOT NULL,
	PRIMARY KEY (item_id)
);