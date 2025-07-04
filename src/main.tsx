import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Проверяем поддержку браузера
const checkBrowserSupport = () => {
  const isSupported = 
    'Promise' in window &&
    'fetch' in window &&
    'Map' in window &&
    'Set' in window;
    
  if (!isSupported) {
    document.body.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        font-family: system-ui, sans-serif;
        background: #f3f4f6;
        margin: 0;
        padding: 20px;
        box-sizing: border-box;
      ">
        <div style="
          text-align: center;
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 500px;
        ">
          <h1 style="color: #1f2937; margin-bottom: 16px;">Браузер не поддерживается</h1>
          <p style="color: #6b7280; margin-bottom: 24px;">
            Пожалуйста, обновите ваш браузер до последней версии для корректной работы сайта.
          </p>
          <button onclick="window.location.reload()" style="
            background: #10b981;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
          ">
            Попробовать снова
          </button>
        </div>
      </div>
    `;
    return false;
  }
  return true;
};

// Обработка ошибок
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Инициализация приложения
if (checkBrowserSupport()) {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  const root = createRoot(rootElement);
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}