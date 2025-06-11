-- Create vehicle inspections table
CREATE TABLE IF NOT EXISTS vehicle_inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  interior_items JSONB NOT NULL DEFAULT '[]',
  exterior_items JSONB NOT NULL DEFAULT '[]',
  engine_items JSONB NOT NULL DEFAULT '[]',
  body_items JSONB NOT NULL DEFAULT '[]',
  fuel_level JSONB NOT NULL DEFAULT '{"level": 0}',
  mileage TEXT,
  comments TEXT,
  images TEXT[] DEFAULT '{}',
  client_signature TEXT,
  technician_signature TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update timestamp
CREATE TRIGGER update_vehicle_inspections_updated_at
BEFORE UPDATE ON vehicle_inspections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_vehicle_inspections_vehicle_id ON vehicle_inspections(vehicle_id);
