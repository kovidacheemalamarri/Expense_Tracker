USE expense_tracker;

CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255),
    name VARCHAR(255),
    password VARCHAR(255)
);

CREATE TABLE payment_method (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    method_name VARCHAR(255)
);

CREATE TABLE category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    user_user_id INT,
    FOREIGN KEY (user_user_id) REFERENCES user(user_id)
);

CREATE TABLE budget (
    budget_id INT AUTO_INCREMENT PRIMARY KEY,
    limit_amount DOUBLE NOT NULL,
    category_category_id INT,
    user_user_id INT,
    FOREIGN KEY (category_category_id) REFERENCES category(category_id),
    FOREIGN KEY (user_user_id) REFERENCES user(user_id)
);

CREATE TABLE expense (
    expense_id INT AUTO_INCREMENT PRIMARY KEY,
    amount DOUBLE NOT NULL,
    date VARCHAR(255),
    category_category_id INT,
    payment_method_payment_id INT,
    user_user_id INT,
    FOREIGN KEY (category_category_id) REFERENCES category(category_id),
    FOREIGN KEY (payment_method_payment_id) REFERENCES payment_method(payment_id),
    FOREIGN KEY (user_user_id) REFERENCES user(user_id)
);

INSERT INTO user (name, email, password) VALUES
('Kovida', 'kovi@gmail.com', '123'),
('Ravi', 'ravi@gmail.com', '123'),
('Anu', 'anu@gmail.com', '123'),
('Raj', 'raj@gmail.com', '123'),
('Neha', 'neha@gmail.com', '123');

INSERT INTO payment_method (method_name) VALUES
('Cash'),
('UPI'),
('Card'),
('Net Banking'),
('Wallet');

INSERT INTO category (name, user_user_id) VALUES
('Food', 1),
('Travel', 2),
('Shopping', 3),
('Bills', 4),
('Health', 5);

INSERT INTO budget (limit_amount, category_category_id, user_user_id) VALUES
(2000, 1, 1),
(3000, 2, 2),
(4000, 3, 3),
(1500, 4, 4),
(2500, 5, 5);

INSERT INTO expense (amount, date, user_user_id, category_category_id, payment_method_payment_id) VALUES
(200, '2026-03-01', 1, 1, 2),
(500, '2026-03-02', 2, 2, 1),
(1000, '2026-03-03', 3, 3, 3),
(300, '2026-03-04', 4, 4, 4),
(150, '2026-03-05', 5, 5, 5),
(250, '2026-03-10', 1, 1, 2);

UPDATE expense
SET amount = 300
WHERE expense_id = 1;

DELETE FROM expense
WHERE expense_id = 2;

SELECT u.name, e.amount
FROM expense e
JOIN user u ON e.user_user_id = u.user_id;

SELECT c.name, SUM(e.amount) AS total
FROM expense e
JOIN category c ON e.category_category_id = c.category_id
GROUP BY c.name;

SELECT * FROM expense ORDER BY amount DESC;

SELECT * FROM expense WHERE amount > 300;

SELECT u.name, c.name AS category_name, pm.method_name, e.amount
FROM expense e
JOIN user u ON e.user_user_id = u.user_id
JOIN category c ON e.category_category_id = c.category_id
LEFT JOIN payment_method pm ON e.payment_method_payment_id = pm.payment_id;

SELECT name
FROM user
WHERE user_id IN (
    SELECT user_user_id
    FROM expense
    WHERE amount > 500
);

SELECT u.name, b.limit_amount, SUM(e.amount) AS spent
FROM budget b
JOIN user u ON b.user_user_id = u.user_id
JOIN expense e ON e.user_user_id = u.user_id
GROUP BY u.name, b.limit_amount
HAVING spent > b.limit_amount;
