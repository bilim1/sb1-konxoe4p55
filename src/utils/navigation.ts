// Утилита для навигации, которая работает независимо от состояния загрузки блоков
export const scrollToSection = (sectionId: string) => {
  // Убираем # если он есть
  const cleanId = sectionId.startsWith('#') ? sectionId.substring(1) : sectionId;
  
  // Сначала пытаемся найти элемент
  let element = document.getElementById(cleanId);
  
  if (element) {
    // Если элемент найден, скроллим к нему
    element.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  
  // Если элемент не найден (возможно, не загружен), принудительно загружаем все секции
  const event = new CustomEvent('forceLoadSection', { detail: { sectionId: cleanId } });
  window.dispatchEvent(event);
  
  // Ждем немного и пытаемся снова
  setTimeout(() => {
    element = document.getElementById(cleanId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Если все еще не найден, скроллим по примерной позиции
      const sections = ['hero', 'projects', 'about', 'booking', 'benefits', 'blog', 'reviews'];
      const sectionIndex = sections.indexOf(cleanId);
      if (sectionIndex !== -1) {
        const approximatePosition = sectionIndex * window.innerHeight;
        window.scrollTo({ top: approximatePosition, behavior: 'smooth' });
      }
    }
  }, 100);
};

// Функция для принудительной загрузки всех секций
export const forceLoadAllSections = () => {
  const event = new CustomEvent('forceLoadAllSections');
  window.dispatchEvent(event);
};