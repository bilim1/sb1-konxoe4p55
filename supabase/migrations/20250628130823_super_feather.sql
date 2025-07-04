/*
  # Создание таблицы заявок на бронирование

  1. Новая таблица
    - `bookings` - заявки на бронирование

  2. Безопасность
    - Включение RLS
    - Политики доступа для админов и анонимных пользователей
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  house text NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  message text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Включение RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Политики доступа
CREATE POLICY "Admin full access to bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public insert access to bookings"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Триггер для обновления updated_at
CREATE TRIGGER update_bookings_updated_at 
  BEFORE UPDATE ON bookings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();