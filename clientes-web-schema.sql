-- Schema para la tabla clientes_web
-- Base de datos: Supabase PostgreSQL

-- ========================================
-- TABLA: clientes_web
-- ========================================
CREATE TABLE IF NOT EXISTS public.clientes_web (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    email VARCHAR(255),
    estado VARCHAR(50) NOT NULL DEFAULT 'interesado',
    productos_solicitados TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Check constraint para estados válidos
    CONSTRAINT chk_cliente_web_estado CHECK (estado IN ('interesado', 'contactado', 'en_negociacion', 'cerrado', 'perdido'))
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_clientes_web_estado ON public.clientes_web(estado);
CREATE INDEX IF NOT EXISTS idx_clientes_web_nombre ON public.clientes_web(nombre_completo);
CREATE INDEX IF NOT EXISTS idx_clientes_web_telefono ON public.clientes_web(telefono);
CREATE INDEX IF NOT EXISTS idx_clientes_web_email ON public.clientes_web(email);

-- ========================================
-- TRIGGER para updated_at
-- ========================================

-- Trigger para clientes_web
DROP TRIGGER IF EXISTS update_clientes_web_updated_at ON public.clientes_web;
CREATE TRIGGER update_clientes_web_updated_at
    BEFORE UPDATE ON public.clientes_web
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- RLS (Row Level Security) Policy
-- ========================================

-- Habilitar RLS
ALTER TABLE public.clientes_web ENABLE ROW LEVEL SECURITY;

-- Política para clientes_web
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.clientes_web;
CREATE POLICY "Enable all operations for authenticated users" ON public.clientes_web
    FOR ALL USING (auth.role() = 'authenticated');

-- ========================================
-- COMENTARIOS EN LA TABLA
-- ========================================

COMMENT ON TABLE public.clientes_web IS 'Tabla de clientes web que hacen consultas desde el frontend';
COMMENT ON COLUMN public.clientes_web.id IS 'Identificador único del cliente web';
COMMENT ON COLUMN public.clientes_web.nombre_completo IS 'Nombre completo del cliente web';
COMMENT ON COLUMN public.clientes_web.telefono IS 'Número de teléfono de contacto';
COMMENT ON COLUMN public.clientes_web.email IS 'Email de contacto';
COMMENT ON COLUMN public.clientes_web.estado IS 'Estado del cliente: interesado, contactado, en_negociacion, cerrado, perdido';
COMMENT ON COLUMN public.clientes_web.productos_solicitados IS 'Detalle de productos que solicita el cliente';