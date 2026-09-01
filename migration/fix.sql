-- Fix orders_quantity_check to allow quantity = 0.
--
-- Why: `quantity` on the orders table tracks the REMAINING unfilled
-- amount as the matching engine fills an order. When an order fills
-- completely, remaining quantity is legitimately 0 (status becomes
-- 'completed'). The original CHECK (quantity > 0) only makes sense
-- at order-creation time -- which the API already enforces separately
-- (place_order rejects data.quantity <= 0 before ever inserting).
-- Once an order exists and is being worked, 0 is a valid end state.

ALTER TABLE orders
DROP CONSTRAINT orders_quantity_check;

ALTER TABLE orders
ADD CONSTRAINT orders_quantity_check
CHECK (quantity >= 0);