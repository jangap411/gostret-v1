-- Schema for GoStret App

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'rider', -- 'rider' or 'driver'
    wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rides Table
CREATE TABLE IF NOT EXISTS rides (
    id SERIAL PRIMARY KEY,
    rider_id INTEGER REFERENCES users(id),
    driver_id INTEGER REFERENCES users(id),
    pickup_address TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    pickup_lat DOUBLE PRECISION NOT NULL,
    pickup_lng DOUBLE PRECISION NOT NULL,
    destination_lat DOUBLE PRECISION NOT NULL,
    destination_lng DOUBLE PRECISION NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'
    fare DECIMAL(10, 2) NOT NULL,
    distance VARCHAR(50),
    duration VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    ride_id INTEGER REFERENCES rides(id),
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'top-up', 'payment', 'withdrawal'
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_rides_modtime BEFORE UPDATE ON rides FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
