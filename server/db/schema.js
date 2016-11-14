//this table is for review types: buyer review (a buyer reviewing a seller), and seller review (vice versa)
var types = `CREATE TABLE IF NOT EXISTS types (
  id              SERIAL        PRIMARY KEY,
  type            VARCHAR(30)   NOT NULL
);`

// statuses might include: pending, in progress, completed, cancelled
var statuses = `CREATE TABLE IF NOT EXISTS statuses (
  id              SERIAL        PRIMARY KEY,
  status          VARCHAR(30)   NOT NULL
);`

var categories = `CREATE TABLE IF NOT EXISTS categories (
  id              SERIAL        PRIMARY KEY,
  category        VARCHAR(30)   NOT NULL
);`

var users = `CREATE TABLE IF NOT EXISTS users (
  id              SERIAL        PRIMARY KEY,
  username        VARCHAR(50)   NOT NULL,
  firstname       VARCHAR(50)   NOT NULL,
  lastname        VARCHAR(50)   NOT NULL,
  email           VARCHAR(255)  NOT NULL
);`

//this table stores info about each product available to rent
//I've left the deposit field off of this. I think it might be easier to calculate a deposit based on a % of total transaction value
var products = `CREATE TABLE IF NOT EXISTS products (
  id              SERIAL        PRIMARY KEY,
  category_id     INT           references categories(id),
  owner_id        INT           references users(id),
  productname     VARCHAR(30)   NOT NULL,
  priceperday     INT           NOT NULL,
  location        VARCHAR(255)  NOT NULL
);`

var transactions = `CREATE TABLE IF NOT EXISTS transactions (
  id              SERIAL        PRIMARY KEY,
  totalvalue      INT           ,
  buyer_id        INT           references users(id),
  seller_id       INT           references users(id),
  status_id       INT           references statuses(id),
  product_id      INT           references products(id),
  bookedfrom      DATE          NOT NULL,
  bookedto        DATE          NOT NULL
);`

var reviews = `CREATE TABLE IF NOT EXISTS reviews (
  id              SERIAL        PRIMARY KEY,
  transaction_id  INT           references transactions(id),
  buyer_id        INT           references users(id),
  seller_id       INT           references users(id),
  type_id         INT           references types(id),
  text            TEXT          NOT NULL,
  rating          INT
);`


module.exports = types + statuses + categories + users + products + transactions + reviews;