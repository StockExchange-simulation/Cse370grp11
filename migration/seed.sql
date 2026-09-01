-- ============================================================
-- STOCK EXCHANGE SIMULATION - SEED DATA
-- Users 1 and 2 already exist.
-- ============================================================


-- ============================================================
-- 1. CLEAR EXISTING SEED DATA
-- ============================================================

TRUNCATE TABLE
    transactions,
    orders,
    wishlists,
    holdings,
    dividends,
    price_history,
    stock,
    company
RESTART IDENTITY CASCADE;


-- ============================================================
-- 2. COMPANIES
-- ============================================================

INSERT INTO company
    (company_name, industry, company_description)
VALUES
    (
        'Apple Inc.',
        'Technology',
        'Technology company specializing in consumer electronics, software and digital services.'
    ),
    (
        'Microsoft Corporation',
        'Technology',
        'Technology company providing software, cloud computing and enterprise services.'
    ),
    (
        'Amazon.com Inc.',
        'E-Commerce',
        'Global e-commerce and cloud computing company.'
    ),
    (
        'Alphabet Inc.',
        'Technology',
        'Technology company operating Google and various digital services.'
    ),
    (
        'Tesla Inc.',
        'Automotive',
        'Electric vehicle and clean energy company.'
    ),
    (
        'NVIDIA Corporation',
        'Semiconductors',
        'Semiconductor company specializing in GPUs and accelerated computing.'
    ),
    (
        'Coca-Cola Company',
        'Beverages',
        'Global beverage company producing soft drinks and other beverages.'
    ),
    (
        'JPMorgan Chase & Co.',
        'Financial Services',
        'Global financial services and banking company.'
    ),
    (
        'Meta Platforms Inc.',
        'Technology',
        'Technology company operating social media and digital communication platforms.'
    ),
    (
        'Walmart Inc.',
        'Retail',
        'Global retail corporation operating stores and e-commerce platforms.'
    );


-- ============================================================
-- 3. STOCKS
-- ============================================================

INSERT INTO stock
    (symbol, current_price, total_shares, company_id)
VALUES
    ('AAPL', 227.45, 1000000000, 1),
    ('MSFT', 505.20, 800000000, 2),
    ('AMZN', 231.75, 900000000, 3),
    ('GOOGL', 284.30, 700000000, 4),
    ('TSLA', 348.60, 600000000, 5),
    ('NVDA', 178.90, 1000000000, 6),
    ('KO', 71.25, 1200000000, 7),
    ('JPM', 302.40, 500000000, 8),
    ('META', 761.50, 550000000, 9),
    ('WMT', 102.85, 1000000000, 10);


-- ============================================================
-- 4. PRICE HISTORY
-- ============================================================

INSERT INTO price_history
    (stock_id, price, recorded_at)
VALUES

-- AAPL
(1, 218.20, '2026-08-25 10:00:00'),
(1, 221.40, '2026-08-26 10:00:00'),
(1, 224.10, '2026-08-27 10:00:00'),
(1, 226.30, '2026-08-28 10:00:00'),
(1, 227.45, '2026-08-29 10:00:00'),

-- MSFT
(2, 492.10, '2026-08-25 10:00:00'),
(2, 497.50, '2026-08-26 10:00:00'),
(2, 501.30, '2026-08-27 10:00:00'),
(2, 503.80, '2026-08-28 10:00:00'),
(2, 505.20, '2026-08-29 10:00:00'),

-- AMZN
(3, 224.50, '2026-08-25 10:00:00'),
(3, 226.20, '2026-08-26 10:00:00'),
(3, 229.10, '2026-08-27 10:00:00'),
(3, 230.60, '2026-08-28 10:00:00'),
(3, 231.75, '2026-08-29 10:00:00'),

-- GOOGL
(4, 275.80, '2026-08-25 10:00:00'),
(4, 278.40, '2026-08-26 10:00:00'),
(4, 280.90, '2026-08-27 10:00:00'),
(4, 282.70, '2026-08-28 10:00:00'),
(4, 284.30, '2026-08-29 10:00:00'),

-- TSLA
(5, 331.20, '2026-08-25 10:00:00'),
(5, 337.80, '2026-08-26 10:00:00'),
(5, 341.50, '2026-08-27 10:00:00'),
(5, 345.20, '2026-08-28 10:00:00'),
(5, 348.60, '2026-08-29 10:00:00'),

-- NVDA
(6, 169.50, '2026-08-25 10:00:00'),
(6, 172.40, '2026-08-26 10:00:00'),
(6, 175.80, '2026-08-27 10:00:00'),
(6, 177.30, '2026-08-28 10:00:00'),
(6, 178.90, '2026-08-29 10:00:00'),

-- KO
(7, 69.80, '2026-08-25 10:00:00'),
(7, 70.10, '2026-08-26 10:00:00'),
(7, 70.60, '2026-08-27 10:00:00'),
(7, 71.00, '2026-08-28 10:00:00'),
(7, 71.25, '2026-08-29 10:00:00'),

-- JPM
(8, 294.20, '2026-08-25 10:00:00'),
(8, 297.50, '2026-08-26 10:00:00'),
(8, 299.80, '2026-08-27 10:00:00'),
(8, 301.20, '2026-08-28 10:00:00'),
(8, 302.40, '2026-08-29 10:00:00'),

-- META
(9, 735.40, '2026-08-25 10:00:00'),
(9, 742.10, '2026-08-26 10:00:00'),
(9, 751.80, '2026-08-27 10:00:00'),
(9, 757.20, '2026-08-28 10:00:00'),
(9, 761.50, '2026-08-29 10:00:00'),

-- WMT
(10, 99.20, '2026-08-25 10:00:00'),
(10, 100.10, '2026-08-26 10:00:00'),
(10, 101.30, '2026-08-27 10:00:00'),
(10, 102.20, '2026-08-28 10:00:00'),
(10, 102.85, '2026-08-29 10:00:00');


-- ============================================================
-- 5. HOLDINGS
-- ============================================================

-- User 1 owns:
-- AAPL 20
-- MSFT 5
-- TSLA 10
-- NVDA 15
-- KO 25

INSERT INTO holdings
    (quantity, user_id, stock_id, avg_price)
VALUES
    (20, 1, 1, 220.00),
    (5,  1, 2, 495.00),
    (10, 1, 5, 340.00),
    (15, 1, 6, 170.00),
    (25, 1, 7, 69.50);


-- User 2 owns:
-- AAPL 30
-- AMZN 20
-- GOOGL 10
-- JPM 15
-- META 5
-- WMT 30

INSERT INTO holdings
    (quantity, user_id, stock_id, avg_price)
VALUES
    (30, 2, 1, 215.00),
    (20, 2, 3, 225.00),
    (10, 2, 4, 275.00),
    (15, 2, 8, 295.00),
    (5,  2, 9, 735.00),
    (30, 2, 10, 98.00);


-- ============================================================
-- 6. WATCHLISTS
-- ============================================================

-- User 1 watchlist

INSERT INTO wishlists (user_id, stock_id)
VALUES
    (1, 3),   -- AMZN
    (1, 4),   -- GOOGL
    (1, 8),   -- JPM
    (1, 9);   -- META


-- User 2 watchlist

INSERT INTO wishlists (user_id, stock_id)
VALUES
    (2, 1),   -- AAPL
    (2, 2),   -- MSFT
    (2, 5),   -- TSLA
    (2, 6);   -- NVDA


-- ============================================================
-- 7. ORDERS
-- ============================================================

-- User 1 BUY orders

INSERT INTO orders
    (user_id, stock_id, order_type, quantity, price, status, holding_id, execution_type)
VALUES
    (1, 1, 'buy', 10, 220.00, 'completed', NULL, 'limit'),
    (1, 2, 'buy', 5, 495.00, 'completed', NULL, 'limit'),
    (1, 5, 'buy', 10, 340.00, 'completed', NULL, 'market'),
    (1, 6, 'buy', 15, 170.00, 'completed', NULL, 'limit'),
    (1, 7, 'buy', 25, 69.50, 'completed', NULL, 'limit');


-- User 2 BUY orders

INSERT INTO orders
    (user_id, stock_id, order_type, quantity, price, status, holding_id, execution_type)
VALUES
    (2, 1, 'buy', 15, 215.00, 'completed', NULL, 'limit'),
    (2, 3, 'buy', 20, 225.00, 'completed', NULL, 'limit'),
    (2, 4, 'buy', 10, 275.00, 'completed', NULL, 'market'),
    (2, 8, 'buy', 15, 295.00, 'completed', NULL, 'limit'),
    (2, 10, 'buy', 30, 98.00, 'completed', NULL, 'limit');


-- Some pending orders

INSERT INTO orders
    (user_id, stock_id, order_type, quantity, price, status, holding_id, execution_type)
VALUES
    (1, 3, 'buy', 5, 225.00, 'pending', NULL, 'limit'),
    (2, 6, 'buy', 10, 175.00, 'pending', NULL, 'limit');


-- User 1 SELL order
-- Holding ID 1 = User 1's AAPL holding

INSERT INTO orders
    (user_id, stock_id, order_type, quantity, price, status, holding_id, execution_type)
VALUES
    (1, 1, 'sell', 5, 225.00, 'pending', 1, 'limit');


-- User 2 SELL order
-- Holding ID 6 = User 2's AAPL holding

INSERT INTO orders
    (user_id, stock_id, order_type, quantity, price, status, holding_id, execution_type)
VALUES
    (2, 1, 'sell', 5, 225.00, 'pending', 6, 'limit');


-- ============================================================
-- 8. TRANSACTIONS
-- ============================================================

-- Transactions are trades between User 1 and User 2.
--
-- Buyer = user receiving stock
-- Seller = user giving stock
--
-- order_id references the buyer's completed order.
--
-- seller_holding_id references the seller's holding.


-- User 1 buys AAPL from User 2

INSERT INTO transactions
    (order_id, buyer_id, seller_id, stock_id, quantity, price, trx_date, seller_holding_id)
VALUES
    (1, 1, 2, 1, 10, 220.00, '2026-08-25 11:30:00', 6);


-- User 2 buys AAPL from User 1

INSERT INTO transactions
    (order_id, buyer_id, seller_id, stock_id, quantity, price, trx_date, seller_holding_id)
VALUES
    (6, 2, 1, 1, 15, 215.00, '2026-08-25 14:20:00', 1);


-- User 1 buys MSFT from User 2
-- For simulation purposes, User 2 temporarily owns this stock.
-- We use an existing holding reference.

INSERT INTO transactions
    (order_id, buyer_id, seller_id, stock_id, quantity, price, trx_date, seller_holding_id)
VALUES
    (2, 1, 2, 2, 5, 495.00, '2026-08-26 10:15:00', 6);


-- User 1 buys TSLA from User 2

INSERT INTO transactions
    (order_id, buyer_id, seller_id, stock_id, quantity, price, trx_date, seller_holding_id)
VALUES
    (3, 1, 2, 5, 10, 340.00, '2026-08-26 13:45:00', 6);


-- User 1 buys NVDA from User 2

INSERT INTO transactions
    (order_id, buyer_id, seller_id, stock_id, quantity, price, trx_date, seller_holding_id)
VALUES
    (4, 1, 2, 6, 15, 170.00, '2026-08-27 09:30:00', 6);


-- User 1 buys KO from User 2

INSERT INTO transactions
    (order_id, buyer_id, seller_id, stock_id, quantity, price, trx_date, seller_holding_id)
VALUES
    (5, 1, 2, 7, 25, 69.50, '2026-08-27 15:10:00', 6);


-- User 2 buys AMZN from User 1

INSERT INTO transactions
    (order_id, buyer_id, seller_id, stock_id, quantity, price, trx_date, seller_holding_id)
VALUES
    (7, 2, 1, 3, 20, 225.00, '2026-08-28 10:00:00', 1);


-- User 2 buys GOOGL from User 1

INSERT INTO transactions
    (order_id, buyer_id, seller_id, stock_id, quantity, price, trx_date, seller_holding_id)
VALUES
    (8, 2, 1, 4, 10, 275.00, '2026-08-28 12:30:00', 1);


-- User 2 buys JPM from User 1

INSERT INTO transactions
    (order_id, buyer_id, seller_id, stock_id, quantity, price, trx_date, seller_holding_id)
VALUES
    (9, 2, 1, 8, 15, 295.00, '2026-08-29 09:45:00', 1);


-- User 2 buys WMT from User 1

INSERT INTO transactions
    (order_id, buyer_id, seller_id, stock_id, quantity, price, trx_date, seller_holding_id)
VALUES
    (10, 2, 1, 10, 30, 98.00, '2026-08-29 14:00:00', 1);


-- ============================================================
-- 9. DIVIDENDS
-- ============================================================

INSERT INTO dividends
    (
        stock_id,
        dividend_amount_PerShare,
        dividend_date,
        announcement_date
    )
VALUES
    (1, 0.26, '2026-09-15 00:00:00', '2026-08-20 00:00:00'),
    (2, 0.83, '2026-09-20 00:00:00', '2026-08-22 00:00:00'),
    (7, 0.49, '2026-09-18 00:00:00', '2026-08-21 00:00:00'),
    (8, 1.35, '2026-09-25 00:00:00', '2026-08-23 00:00:00'),
    (10, 0.24, '2026-09-22 00:00:00', '2026-08-24 00:00:00'),
    (3, 0.30, '2026-09-28 00:00:00', '2026-08-25 00:00:00');


-- ============================================================
-- 10. UPDATE USER BALANCES
-- ============================================================

-- These balances are simulated and reflect some trading activity.
-- Keep them non-negative.

UPDATE users
SET balance = 6500.00
WHERE user_id = 1;

UPDATE users
SET balance = 7200.00
WHERE user_id = 2;


-- ============================================================
-- 11. FIX SERIAL SEQUENCES
-- ============================================================

SELECT setval(
    pg_get_serial_sequence('company', 'company_id'),
    COALESCE((SELECT MAX(company_id) FROM company), 1)
);

SELECT setval(
    pg_get_serial_sequence('stock', 'stock_id'),
    COALESCE((SELECT MAX(stock_id) FROM stock), 1)
);

SELECT setval(
    pg_get_serial_sequence('holdings', 'holding_id'),
    COALESCE((SELECT MAX(holding_id) FROM holdings), 1)
);

SELECT setval(
    pg_get_serial_sequence('orders', 'order_id'),
    COALESCE((SELECT MAX(order_id) FROM orders), 1)
);

SELECT setval(
    pg_get_serial_sequence('transactions', 'trx_id'),
    COALESCE((SELECT MAX(trx_id) FROM transactions), 1)
);

SELECT setval(
    pg_get_serial_sequence('dividends', 'dividend_id'),
    COALESCE((SELECT MAX(dividend_id) FROM dividends), 1)
);

SELECT setval(
    pg_get_serial_sequence('price_history', 'history_id'),
    COALESCE((SELECT MAX(history_id) FROM price_history), 1)
);


-- ============================================================
-- 12. VERIFY DATA
-- ============================================================

SELECT 'companies' AS table_name, COUNT(*) AS records FROM company
UNION ALL
SELECT 'stocks', COUNT(*) FROM stock
UNION ALL
SELECT 'holdings', COUNT(*) FROM holdings
UNION ALL
SELECT 'wishlists', COUNT(*) FROM wishlists
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'dividends', COUNT(*) FROM dividends
UNION ALL
SELECT 'price_history', COUNT(*) FROM price_history;