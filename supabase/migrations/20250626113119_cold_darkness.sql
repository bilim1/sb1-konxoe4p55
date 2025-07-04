/*
  # Создание администратора и настройка RLS политик

  1. Создание администратора в auth.users
  2. Обновление RLS политик для работы с аутентификацией
  3. Добавление данных администратора в admin_users
*/

-- Создаем администратора в auth.users (если его еще нет)
DO $$
BEGIN
  -- Проверяем, существует ли пользователь
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'administratorbilim@mail.ru'
  ) THEN
    -- Создаем пользователя
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'administratorbilim@mail.ru',
      crypt('73q-7un-Vie-xbL', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;

-- Обновляем RLS политики для всех таблиц
-- Политики для admin_users
DROP POLICY IF EXISTS "Admin full access to admin_users" ON admin_users;
CREATE POLICY "Admin full access to admin_users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Политики для site_content
DROP POLICY IF EXISTS "Admin full access to site_content" ON site_content;
CREATE POLICY "Admin full access to site_content"
  ON site_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Добавляем политику для анонимного чтения контента
CREATE POLICY "Public read access to site_content"
  ON site_content
  FOR SELECT
  TO anon
  USING (true);

-- Политики для houses
DROP POLICY IF EXISTS "Admin full access to houses" ON houses;
CREATE POLICY "Admin full access to houses"
  ON houses
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Политики для blog_posts
DROP POLICY IF EXISTS "Admin full access to blog_posts" ON blog_posts;
CREATE POLICY "Admin full access to blog_posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Политики для reviews
DROP POLICY IF EXISTS "Admin full access to reviews" ON reviews;
CREATE POLICY "Admin full access to reviews"
  ON reviews
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Политики для site_settings
DROP POLICY IF EXISTS "Admin full access to site_settings" ON site_settings;
CREATE POLICY "Admin full access to site_settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Добавляем администратора в таблицу admin_users
INSERT INTO admin_users (email, password_hash, name)
VALUES ('administratorbilim@mail.ru', 'hashed_password', 'Администратор')
ON CONFLICT (email) DO NOTHING;

-- Добавляем начальный контент сайта (исправленный JSON)
INSERT INTO site_content (section, key, value) VALUES
('hero', 'slides', '[
  {
    "image": "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    "title": "Билим — ваш доходный дом у леса"
  },
  {
    "image": "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    "title": "Экологичное жильё в гармонии с природой"
  },
  {
    "image": "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    "title": "Инвестиции в будущее"
  }
]'::jsonb),
('hero', 'subtitle', '"Современные экологичные дома в живописном месте всего в 60 км от Екатеринбурга. Идеальное место для отдыха и стабильного дохода от аренды."'::jsonb),
('about', 'title', '"О проекте Билим"'::jsonb),
('about', 'description', '"Посёлок «Билим» — это уникальный проект экологичного загородного жилья, сочетающий комфорт современной жизни с гармонией природной среды."'::jsonb)
ON CONFLICT (section, key) DO NOTHING;

-- Добавляем примеры домов
INSERT INTO houses (name, area, rooms, rent_price, buy_price, images, description, materials, features) VALUES
('Лесной дом "Березка"', 45, 2, 15000, 2800000, 
 ARRAY['https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800'],
 'Уютный двухкомнатный дом из экологически чистых материалов с прекрасным видом на лес.',
 ARRAY['Клееный брус', 'Натуральный камень', 'Экологичные утеплители'],
 ARRAY['Панорамные окна', 'Терраса', 'Камин', 'Отопление']),
('Семейный коттедж "Дубрава"', 85, 3, 25000, 4200000,
 ARRAY['https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800'],
 'Просторный трёхкомнатный коттедж для комфортного семейного отдыха.',
 ARRAY['Оцилиндрованное бревно', 'Природный камень', 'Кедр'],
 ARRAY['Мансарда', 'Большая терраса', 'Барбекю зона', 'Парковка'])
ON CONFLICT DO NOTHING;

-- Добавляем примеры статей блога
INSERT INTO blog_posts (title, excerpt, content, image) VALUES
('Открытие нового сезона в посёлке Билим', 
 'С приходом весны наш посёлок оживает. Рассказываем о новых возможностях для отдыха и инвестиций в 2024 году.',
 'С приходом весны посёлок "Билим" встречает новый сезон с множеством интересных событий и возможностей...',
 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800'),
('Экологические инициативы посёлка',
 'Наш подход к устойчивому развитию: от солнечных панелей до программы переработки отходов.',
 'Забота об окружающей среде — одна из основных ценностей посёлка "Билим"...',
 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800')
ON CONFLICT DO NOTHING;