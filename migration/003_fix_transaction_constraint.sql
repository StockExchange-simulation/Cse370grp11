ALTER TABLE transactions DROP CONSTRAINT fk_seller_holding;

ALTER TABLE transactions
ADD CONSTRAINT fk_seller_holding
    FOREIGN KEY (seller_holding_id)
    REFERENCES holdings(holding_id)
    ON DELETE SET NULL;

ALTER TABLE orders
ADD COLUMN execution_type VARCHAR(10) NOT NULL DEFAULT 'limit'
CHECK (execution_type IN ('market', 'limit'));