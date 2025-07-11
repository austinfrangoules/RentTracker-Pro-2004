-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create users table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'viewer')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, property_id)
);

-- Create invitations table
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    invited_by UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

-- Create contractors table
CREATE TABLE IF NOT EXISTS public.contractors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT,
    phone TEXT,
    email TEXT,
    services TEXT[],
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    notes TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create maintenance records table
CREATE TABLE IF NOT EXISTS public.maintenance_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    contractor_id UUID REFERENCES contractors(id),
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    cost DECIMAL(10,2),
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create purchase orders table
CREATE TABLE IF NOT EXISTS public.purchase_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    purchase_date DATE,
    receipt_url TEXT,
    product_url TEXT,
    notes TEXT,
    tags TEXT[],
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
CREATE POLICY "Users can view properties they have access to"
    ON properties FOR SELECT
    USING (
        id IN (
            SELECT property_id 
            FROM user_roles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Only owners can modify properties"
    ON properties FOR ALL
    USING (
        id IN (
            SELECT property_id 
            FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'owner'
        )
    );