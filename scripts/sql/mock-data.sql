-- Insert mock accounts
INSERT INTO accounts (id, name, type, planned_expenses, account_number) VALUES 
(1, 'Cash', 'cash', false, null),
(2, 'Main Checking', 'checking', false, '****1234'),
(3, 'Recurring payments', 'checking', true, '****4421'),
(4, 'Savings Account', 'savings', false, '****5678'),
(5, 'Emergency Fund', 'savings', false, '****9012');

-- Insert mock transactions for September 2025
INSERT INTO transactions (name, amount, date, type, category, account_id, counter_party, planned_expense_id) VALUES 
-- Cash transactions
('Coffee', '-4.50', '2025-09-04', 'expense', 'Food', 1, null, null),
('Tip', '-5.00', '2025-09-10', 'expense', 'Other', 1, null, null),

-- Main Checking Account
('Salary', '3500.00', '2025-09-01', 'income', 'Salary', 2, null, null),
('Freelance Work', '800.00', '2025-09-15', 'income', 'Freelance', 2, null, null),
('Groceries', '-85.50', '2025-09-02', 'expense', 'Food', 2, null, null),
('Gas Station', '-65.00', '2025-09-03', 'expense', 'Transport', 2, null, null),
('Groceries', '-92.30', '2025-09-08', 'expense', 'Food', 2, null, null),
('Restaurant', '-28.75', '2025-09-10', 'expense', 'Food', 2, null, null),
('Gas Station', '-58.20', '2025-09-14', 'expense', 'Transport', 2, null, null),
('Groceries', '-78.40', '2025-09-16', 'expense', 'Food', 2, null, null),
('Streaming', '-12.99', '2025-09-18', 'expense', 'Entertainment', 2, null, null),
('Gym', '-25.00', '2025-09-20', 'expense', 'Health', 2, null, null),
('Stock Purchase', '-500.00', '2025-09-25', 'investment', 'Investment', 2, null, null),
('Bitcoin', '-300.00', '2025-09-29', 'investment', 'Investment', 2, null, null),

-- Recurring Payments Account
('Rent', '-1200.00', '2025-09-01', 'planned_expense', 'Housing', 3, null, 1),
('Phone Bill', '-35.00', '2025-09-12', 'planned_expense', 'Utilities', 3, null, 3),
('Electricity Bill', '-120.00', '2025-09-05', 'planned_expense', 'Utilities', 3, null, 2),
('Spotify', '-10.00', '2025-09-05', 'planned_expense', 'Entertainment', 3, null, 4),

-- Transfers
('Transfer to Savings', '-300.00', '2025-09-30', 'transfer', null, 2, '****5678', null),
('Transfer from Checking', '300.00', '2025-09-30', 'transfer', null, 4, '****1234', null),
('Emergency Fund Deposit', '-100.00', '2025-09-15', 'transfer', null, 2, '****9012', null),
('Emergency Fund Deposit', '100.00', '2025-09-15', 'transfer', null, 5, '****1234', null);

-- Insert planned expenses
INSERT INTO planned_expenses (id, name, amount, "from", "to", category, period) VALUES
(1, 'Rent', '1200.00', '2025-01-01', null, 'Housing', 'month'),
(2, 'Electricity Bill', '120.00', '2025-01-01', null, 'Utilities', 'month'),
(3, 'Phone Bill', '35.00', '2025-01-01', null, 'Utilities', 'month'),
(4, 'Spotify', '10.00', '2025-01-01', null, 'Entertainment', 'month');

-- Insert account balances
INSERT INTO account_balances (account_id, date, balance) VALUES
-- Starting balances (2025-09-01)
(1, '2025-09-01', '50.00'),     -- Cash starting balance
(2, '2025-09-01', '2500.00'),   -- Main Checking starting balance
(3, '2025-09-01', '1500.00'),   -- Recurring payments starting balance
(4, '2025-09-01', '5000.00'),   -- Savings starting balance
(5, '2025-09-01', '2000.00'),   -- Emergency Fund starting balance

-- Ending balances (2025-10-01)
(1, '2025-10-01', '40.50'),     -- Cash: 50 - 9.50 = 40.50
(2, '2025-10-01', '2241.81'),   -- Main Checking: 2500 + 4300 - 1558.19 = 2241.81
(3, '2025-10-01', '135.00'),    -- Recurring: 1500 - 1365 = 135.00
(4, '2025-10-01', '5300.00'),   -- Savings: 5000 + 300 = 5300.00
(5, '2025-10-01', '2100.00');   -- Emergency: 2000 + 100 = 2100.00