import React, { useState, useEffect } from 'react';
import { supabase, SiteSettings } from '../../lib/supabase';
import { Settings, Save } from 'lucide-react';

const SettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key', { ascending: true });

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async (setting: SiteSettings) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: setting.id,
          key: setting.key,
          value: setting.value,
          description: setting.description,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      await loadSettings();
    } catch (error) {
      console.error('Error saving setting:', error);
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (id: string, field: keyof SiteSettings, value: any) => {
    setSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, [field]: value } : setting
    ));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-emerald-600" />
          <h2 className="text-xl font-semibold text-gray-900">Настройки сайта</h2>
        </div>
        <p className="text-gray-600 mt-2">
          Общие настройки и конфигурация сайта
        </p>
      </div>

      <div className="p-6 space-y-6">
        {settings.map((setting) => (
          <div key={setting.id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{setting.key}</h4>
                {setting.description && (
                  <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                )}
              </div>
              <button
                onClick={() => saveSetting(setting)}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Сохранение...' : 'Сохранить'}</span>
              </button>
            </div>

            <textarea
              value={typeof setting.value === 'string' ? setting.value : JSON.stringify(setting.value, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  updateSetting(setting.id, 'value', parsed);
                } catch (error) {
                  // If it's not valid JSON, treat as string
                  updateSetting(setting.id, 'value', e.target.value);
                }
              }}
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
              placeholder="Значение настройки..."
            />
          </div>
        ))}

        {settings.length === 0 && (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Настройки не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsManager;