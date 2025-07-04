/*
  # Обновление таблицы bookings для поддержки покупки

  1. Изменения
    - Добавление поля booking_type для различения аренды и покупки
    - Изменение полей check_in и check_out на nullable для покупки
    - Обновление ограничений

  2. Безопасность
    - Сохранение существующих RLS политик
*/

-- Добавляем поле для типа заявки
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'booking_type'
  ) THEN
    ALTER TABLE bookings ADD COLUMN booking_type text DEFAULT 'rent' CHECK (booking_type IN ('rent', 'buy'));
  END IF;
END $$;

-- Изменяем ограничения для дат (делаем их nullable)
ALTER TABLE bookings ALTER COLUMN check_in DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN check_out DROP NOT NULL;

-- Добавляем ограничение: для аренды даты обязательны, для покупки - нет
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'bookings_dates_check'
  ) THEN
    ALTER TABLE bookings ADD CONSTRAINT bookings_dates_check 
    CHECK (
      (booking_type = 'rent' AND check_in IS NOT NULL AND check_out IS NOT NULL) OR
      (booking_type = 'buy' AND check_in IS NULL AND check_out IS NULL)
    );
  END IF;
END $$;