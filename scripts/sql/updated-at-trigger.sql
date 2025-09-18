CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updated_at" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_trigger
BEFORE INSERT OR UPDATE ON "transactions"
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_trigger
BEFORE INSERT OR UPDATE ON "planned_expenses"
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_trigger
BEFORE INSERT OR UPDATE ON "account_balances"
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
