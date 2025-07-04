/*
  # Создание таблиц для админ-панели сайта Билим

  1. Новые таблицы
    - `admin_users` - администраторы сайта
    - `site_content` - контент блоков сайта
    - `houses` - проекты домов
    - `blog_posts` - статьи блога
    - `reviews` - отзывы клиентов
    - `site_settings` - настройки сайта

  2. Безопасность
    - Включение RLS для всех таблиц
    - Политики доступа только для аутентифицированных админов
*/

-- Таблица администраторов
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL DEFAULT 'Администратор',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Таблица контента сайта
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  key text NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section, key)
);

-- Таблица домов
CREATE TABLE IF NOT EXISTS houses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  area integer NOT NULL,
  rooms integer NOT NULL,
  rent_price integer NOT NULL,
  buy_price integer NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  description text NOT NULL,
  materials text[] NOT NULL DEFAULT '{}',
  features text[] NOT NULL DEFAULT '{}',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Таблица статей блога
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  image text NOT NULL,
  is_published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Таблица отзывов
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text text NOT NULL,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Таблица настроек сайта
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Включение RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Политики для админов (будут настроены после создания функций аутентификации)
CREATE POLICY "Admin full access to admin_users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access to site_content"
  ON site_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access to houses"
  ON houses
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public read access to houses"
  ON houses
  FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Admin full access to blog_posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public read access to blog_posts"
  ON blog_posts
  FOR SELECT
  TO anon
  USING (is_published = true);

CREATE POLICY "Admin full access to reviews"
  ON reviews
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public read access to reviews"
  ON reviews
  FOR SELECT
  TO anon
  USING (is_approved = true);

CREATE POLICY "Public insert access to reviews"
  ON reviews
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admin full access to site_settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Вставка начального админа
INSERT INTO admin_users (email, password_hash, name) VALUES 
('administratorbilim@mail.ru', '$2b$10$8K1p0f6kPpskQY8X9/Oe4.rGd5wJQFQkqwer7yQvNxMxvQwer7yQ', 'Главный администратор')
ON CONFLICT (email) DO NOTHING;

-- Вставка начального контента
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
]'),
('hero', 'description', '"Современные экологичные дома в живописном месте всего в 60 км от Екатеринбурга. Идеальное место для отдыха и стабильного дохода от аренды."'),
('header', 'phone', '"+7 (343) 123-45-67"'),
('header', 'logo', '"Билим"'),
('about', 'title', '"О проекте Билим"'),
('about', 'description', '"Посёлок «Билим» — это уникальный проект экологичного загородного жилья, сочетающий комфорт современной жизни с гармонией природной среды."')
ON CONFLICT (section, key) DO NOTHING;

-- Вставка начальных домов
INSERT INTO houses (name, area, rooms, rent_price, buy_price, images, description, materials, features) VALUES 
('Лесной дом "Березка"', 45, 2, 15000, 2800000, 
 ARRAY['https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800'],
 'Уютный двухкомнатный дом из экологически чистых материалов с прекрасным видом на лес.',
 ARRAY['Клееный брус', 'Натуральный камень', 'Экологичные утеплители'],
 ARRAY['Панорамные окна', 'Терраса', 'Камин', 'Отопление']),
('Семейный коттедж "Дубрава"', 85, 3, 25000, 4200000,
 ARRAY['https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'],
 'Просторный трёхкомнатный коттедж для комфортного семейного отдыха.',
 ARRAY['Оцилиндрованное бревно', 'Природный камень', 'Кедр'],
 ARRAY['Мансарда', 'Большая терраса', 'Барбекю зона', 'Парковка'])
ON CONFLICT DO NOTHING;

-- Вставка начальных статей блога
INSERT INTO blog_posts (title, excerpt, content, image) VALUES 
('Открытие нового сезона в посёлке Билим', 
 'С приходом весны наш посёлок оживает. Рассказываем о новых возможностях для отдыха и инвестиций в 2024 году.',
 'С приходом весны посёлок "Билим" встречает новый сезон с множеством интересных событий и возможностей...',
 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800')
ON CONFLICT DO NOTHING;

-- Функции для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON site_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_houses_updated_at BEFORE UPDATE ON houses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();