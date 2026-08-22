-- 1. company
CREATE TABLE company (
    company_id SERIAL PRIMARY KEY,
    industry VARCHAR(100),
    company_name VARCHAR(100) NOT NULL,
    company_description TEXT
);

--2 .users

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    google_id VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    U_role VARCHAR(20) DEFAULT 'user' CHECK (U_role IN ('user', 'admin')),
    balance DECIMAL(10, 2) DEFAULT 10000,
    CONSTRAINT user_balance_check 
    CHECK (balance >= 0)
);

--3. stock
CREATE TABLE stock (
    stock_id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) UNIQUE NOT NULL,
    current_price DECIMAL(20, 2) NOT NULL,
    total_shares BIGINT NOT NULL,
    company_id BIGINT NOT NULL,

    CONSTRAINT fk_company
        FOREIGN KEY (company_id)
        REFERENCES company(company_id),
    
    CONSTRAINT stock_total_shares_check
        CHECK (total_shares >= 0),

    CONSTRAINT stock_current_price_check
        CHECK (current_price >= 0)
);

--4. holdings
CREATE TABLE holdings (
    holding_id SERIAL PRIMARY KEY,
    quantity BIGINT NOT NULL default 0,
    user_id BIGINT NOT NULL,
    stock_id BIGINT NOT NULL,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_stock
        FOREIGN KEY (stock_id)
        REFERENCES stock(stock_id)
        ON DELETE CASCADE,
    
    CONSTRAINT unique_user_stock
        UNIQUE (user_id, stock_id),

    CONSTRAINT holdings_quantity_check
        CHECK (quantity >= 0)

);

--5. Wishlists
CREATE TABLE wishlists (
    user_id BIGINT NOT NULL,
    stock_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, stock_id),

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_stock
        FOREIGN KEY (stock_id)
        REFERENCES stock(stock_id)
        ON DELETE CASCADE
);

--6.orders
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    stock_id BIGINT NOT NULL,
    order_type VARCHAR(10) NOT NULL CHECK (order_type IN ('buy', 'sell')),
    quantity BIGINT NOT NULL,
    price DECIMAL(20, 2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'partially_completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    holding_id BIGINT,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_stock
        FOREIGN KEY (stock_id)
        REFERENCES stock(stock_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_holding
        FOREIGN KEY (holding_id)
        REFERENCES holdings(holding_id)
        ON DELETE SET NULL,

    CONSTRAINT orders_quantity_check
        CHECK (quantity > 0),

    CONSTRAINT orders_price_check
        CHECK (price >= 0),

    CONSTRAINT orders_holding_check
        CHECK ((holding_id IS NOT NULL AND order_type = 'sell') OR (holding_id IS NULL AND order_type = 'buy'))
);

--7. transactions
CREATE TABLE transactions (
    trx_id SERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    buyer_id BIGINT NOT NULL,
    seller_id BIGINT NOT NULL,
    stock_id BIGINT NOT NULL,
    quantity BIGINT NOT NULL,
    price DECIMAL(20, 2) NOT NULL,
    trx_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    seller_holding_id BIGINT,

    CONSTRAINT fk_order
        FOREIGN KEY (order_id)
        REFERENCES orders(order_id),

    CONSTRAINT fk_buyer
        FOREIGN KEY (buyer_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_seller
        FOREIGN KEY (seller_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_stock
        FOREIGN KEY (stock_id)
        REFERENCES stock(stock_id),
    
    CONSTRAINT fk_seller_holding
        FOREIGN KEY (seller_holding_id)
        REFERENCES holdings(holding_id),

    CONSTRAINT transactions_quantity_check
        CHECK (quantity > 0),

    CONSTRAINT transactions_price_check
        CHECK (price >= 0)
);


--8 DIVIDENDS
CREATE TABLE dividends (
    dividend_id SERIAL PRIMARY KEY,
    stock_id BIGINT NOT NULL,
    dividend_amount_PerShare DECIMAL(20, 2) NOT NULL,
    dividend_date TIMESTAMP NOT NULL,
    announcement_date TIMESTAMP NOT NULL,
    CONSTRAINT fk_stock
        FOREIGN KEY (stock_id)
        REFERENCES stock(stock_id)
        on DELETE CASCADE,
    CONSTRAINT dividends_amount_check
        CHECK (dividend_amount_PerShare >= 0)   

);

--9 price_history
CREATE TABLE price_history (
    history_id SERIAL PRIMARY KEY,
    stock_id BIGINT NOT NULL,
    price DECIMAL(20, 2) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_stock
        FOREIGN KEY (stock_id)
        REFERENCES stock(stock_id)
        on DELETE CASCADE,
    CONSTRAINT price_history_price_check
        CHECK (price >= 0)
);

--indexes

CREATE INDEX idx_stock_symbol ON stock(symbol);
CREATE INDEX idx_holdings_user_id ON holdings(user_id);
CREATE INDEX idx_holdings_stock_id ON holdings(stock_id);
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_stock_id ON orders(stock_id); 
CREATE INDEX idx_orders_holding_id ON orders(holding_id);  
CREATE INDEX idx_transactions_order_id ON transactions(order_id);
CREATE INDEX idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX idx_transactions_stock_id ON transactions(stock_id);
CREATE INDEX idx_price_history_stock_id ON price_history(stock_id);
CREATE INDEX idx_price_history_recorded_at ON price_history(stock_id, recorded_at);
CREATE INDEX idx_dividends_stock_id ON dividends(stock_id);

