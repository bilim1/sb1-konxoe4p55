import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, PieChart, HelpCircle, ChevronDown, ChevronUp, Shield, DollarSign, Home, Users, Leaf } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Advantage {
  icon: string;
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const EconomicBenefits: React.FC = () => {
  const [calculator, setCalculator] = useState({
    housePrice: '',
    monthlyRent: '',
    occupancyRate: '',
    expenses: ''
  });

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const [benefitsContent, setBenefitsContent] = useState({
    title: 'Экономические выгоды',
    subtitle: 'Инвестиции в недвижимость посёлка «Билим» — это надёжный способ получения стабильного дохода с высокой доходностью',
    advantages_title: 'Преимущества инвестиций в Билим',
    advantages: [
      {
        icon: 'TrendingUp',
        title: 'Высокая доходность',
        description: '12-15% годовых против 8% по банковским депозитам'
      },
      {
        icon: 'PieChart',
        title: 'Диверсификация',
        description: 'Недвижимость как защита от инфляции и валютных рисков'
      },
      {
        icon: 'HelpCircle',
        title: 'Полная поддержка',
        description: 'Помощь в управлении арендой и обслуживании недвижимости'
      }
    ] as Advantage[],
    faq_title: 'Часто задаваемые вопросы',
    faq: [
      {
        question: 'Какая средняя доходность от аренды домов в посёлке?',
        answer: 'Средняя доходность составляет 12-15% годовых при правильном управлении арендой. Это значительно выше банковских депозитов и многих других инвестиционных инструментов.'
      },
      {
        question: 'Сколько времени занимает окупаемость инвестиций?',
        answer: 'При средней загруженности 70% окупаемость составляет 7-8 лет. Это отличный показатель для инвестиций в недвижимость, особенно учитывая рост стоимости объектов.'
      },
      {
        question: 'Какие дополнительные расходы нужно учитывать?',
        answer: 'Основные расходы включают: коммунальные платежи (3-5% от дохода), уборка и обслуживание (5-7%), налоги (13% с дохода), реклама и продвижение (2-3%).'
      },
      {
        question: 'Помогаете ли вы с управлением арендой?',
        answer: 'Да, мы предлагаем полный спектр услуг по управлению недвижимостью: поиск арендаторов, заключение договоров, уборка, техническое обслуживание и финансовая отчетность.'
      },
      {
        question: 'Можно ли получить кредит на покупку дома?',
        answer: 'Да, мы сотрудничаем с несколькими банками, которые предоставляют льготные условия кредитования для наших объектов. Первоначальный взнос от 20%.'
      }
    ] as FAQ[]
  });

  useEffect(() => {
    loadBenefitsContent();
    // Устанавливаем значения по умолчанию
    setCalculator({
      housePrice: '3000000',
      monthlyRent: '20000',
      occupancyRate: '70',
      expenses: '15'
    });
  }, []);

  const loadBenefitsContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'benefits');

      if (error) throw error;

      const contentMap: any = {};
      data?.forEach(item => {
        contentMap[item.key] = typeof item.value === 'string' ? item.value : item.value;
      });

      if (Object.keys(contentMap).length > 0) {
        setBenefitsContent(prev => ({
          ...prev,
          ...contentMap
        }));
      }
    } catch (error) {
      console.error('Error loading benefits content:', error);
    }
  };

  const calculateProfitability = () => {
    const housePrice = parseFloat(calculator.housePrice) || 0;
    const monthlyRent = parseFloat(calculator.monthlyRent) || 0;
    const occupancyRate = parseFloat(calculator.occupancyRate) || 0;
    const expenses = parseFloat(calculator.expenses) || 0;

    const annualRent = monthlyRent * 12;
    const adjustedRent = annualRent * (occupancyRate / 100);
    const expensesAmount = adjustedRent * (expenses / 100);
    const netIncome = adjustedRent - expensesAmount;
    const roi = housePrice > 0 ? (netIncome / housePrice) * 100 : 0;
    const paybackPeriod = netIncome > 0 ? housePrice / netIncome : 0;

    return {
      annualRent: adjustedRent,
      expenses: expensesAmount,
      netIncome,
      roi,
      paybackPeriod
    };
  };

  const results = calculateProfitability();
  const bankDeposit = (parseFloat(calculator.housePrice) || 0) * 0.08; // 8% банковский депозит

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      TrendingUp,
      PieChart,
      HelpCircle,
      Shield,
      DollarSign,
      Home,
      Users,
      Leaf
    };
    
    const IconComponent = icons[iconName] || TrendingUp;
    return <IconComponent className="w-12 h-12 text-emerald-600 mx-auto mb-4" />;
  };

  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{benefitsContent.title}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {benefitsContent.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Calculator */}
          <div className="bg-emerald-50 rounded-xl p-8">
            <div className="flex items-center mb-6">
              <Calculator className="w-6 h-6 text-emerald-600 mr-2" />
              <h3 className="text-2xl font-semibold text-gray-900">Калькулятор доходности</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Стоимость дома (₽)
                </label>
                <input
                  type="text"
                  value={calculator.housePrice}
                  onChange={(e) => setCalculator({
                    ...calculator,
                    housePrice: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Введите стоимость"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Месячная аренда (₽)
                </label>
                <input
                  type="text"
                  value={calculator.monthlyRent}
                  onChange={(e) => setCalculator({
                    ...calculator,
                    monthlyRent: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Введите сумму аренды"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Загруженность в году (%)
                </label>
                <input
                  type="text"
                  value={calculator.occupancyRate}
                  onChange={(e) => setCalculator({
                    ...calculator,
                    occupancyRate: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Введите процент загруженности"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Расходы от дохода (%)
                </label>
                <input
                  type="text"
                  value={calculator.expenses}
                  onChange={(e) => setCalculator({
                    ...calculator,
                    expenses: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Введите процент расходов"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-emerald-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Результаты расчёта</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Годовой доход:</span>
                  <span className="font-semibold">{results.annualRent.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Расходы:</span>
                  <span className="font-semibold text-red-600">-{results.expenses.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-900 font-semibold">Чистая прибыль:</span>
                  <span className="font-bold text-emerald-600">{results.netIncome.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-900 font-semibold">Доходность:</span>
                  <span className="font-bold text-emerald-600">{results.roi.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-900 font-semibold">Окупаемость:</span>
                  <span className="font-bold">{results.paybackPeriod.toFixed(1)} лет</span>
                </div>
              </div>
            </div>

            {/* Comparison with bank deposit */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Сравнение с банковским вкладом</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Доход от вклада (8% годовых):</span>
                  <span>{bankDeposit.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Доход от аренды:</span>
                  <span className="text-emerald-600 font-semibold">{results.netIncome.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Превышение:</span>
                  <span className="font-bold text-emerald-600">
                    +{(results.netIncome - bankDeposit).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advantages with animations */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            {benefitsContent.advantages_title}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefitsContent.advantages.map((advantage, index) => (
              <div 
                key={index} 
                className="text-center p-6 bg-emerald-50 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="transform transition-transform duration-300 group-hover:scale-110">
                  {getIcon(advantage.icon)}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{advantage.title}</h4>
                <p className="text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            {benefitsContent.faq_title}
          </h3>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {benefitsContent.faq.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg">
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default EconomicBenefits;