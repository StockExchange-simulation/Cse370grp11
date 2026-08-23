ALTER TABLE holdings
ADD COLUMN avg_price DECIMAL(20, 2) NOT NULL DEFAULT 0;

ALTER TABLE holdings
ADD CONSTRAINT holdings_avg_price_check
CHECK (avg_price >= 0);