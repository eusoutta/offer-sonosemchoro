import { X, Check, TrendingDown, Shield, Star, Heart, Gift, Zap, Clock, Users } from 'lucide-react';
import { useVibrate } from '../hooks/useVibrate';
import type { WakeupEntry } from '../lib/types';

interface PaywallProps {
  isOpen: boolean;
  onClose: () => void;
  babyName: string;
  currentDay: number;
  wakeups: WakeupEntry[];
}

export function Paywall({ isOpen, onClose, babyName, currentDay, wakeups }: PaywallProps) {
  const { vibrate } = useVibrate();

  if (!isOpen) return null;

  const day1 = wakeups.filter(w => w.day_number === 1).length;
  const latestDay = Math.min(currentDay, 7);
  const latestWakeups = wakeups.filter(w => w.day_number === latestDay).length;
  const improvement = day1 > 0 ? Math.round(((day1 - latestWakeups) / day1) * 100) : 0;

  const weekDays = [1, 2, 3, 4, 5, 6, 7].slice(0, Math.min(currentDay, 7));
  const maxW = Math.max(...weekDays.map(d => wakeups.filter(w => w.day_number === d).length), 1);

  const handleCheckout = () => {
    vibrate(100);
    // Link para checkout externo
    window.open('https://payment-gateway.com/checkout/manutencao?app=sono-sem-choro', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header with close button */}
        <div className="relative bg-gradient-to-br from-coral-400 to-coral-500 p-6 pb-16">
          <button
            onClick={() => { vibrate(30); onClose(); }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="text-center text-white">
            <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
              <Star className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold mb-1">
              Conseguiste, mama!
            </h1>
            <p className="text-white/80">
              {babyName} ja dorme melhor.
            </p>
          </div>
        </div>

        {/* Progress Card */}
        <div className="px-4 -mt-10 mb-4">
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-500 mb-1">O teu progresso</p>
              {improvement > 0 && (
                <div className="flex items-center justify-center gap-2">
                  <TrendingDown className="w-5 h-5 text-green-500" />
                  <p className="text-2xl font-bold text-green-500">
                    {improvement}%
                  </p>
                  <p className="text-gray-600">menos despertares</p>
                </div>
              )}
            </div>

            {/* Mini Chart */}
            <div className="flex items-end justify-between gap-2 h-16">
              {weekDays.map(d => {
                const count = wakeups.filter(w => w.day_number === d).length;
                const heightPct = maxW > 0 ? (count / maxW) * 100 : 0;
                return (
                  <div key={d} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full rounded-t bg-coral-200"
                      style={{ height: `${Math.max(heightPct, 8)}%` }}
                    />
                    <p className="text-xs mt-1 text-gray-400">D{d}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Plano Manutencao
            </h2>
            <p className="text-gray-600 text-sm">
              Agora que {babyName} esta a dormir melhor,
              <br />
              vamos garantir que se mantem assim.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            {[
              { icon: Shield, text: '30 dias de acompanhamento extra', color: 'text-blue-500' },
              { icon: Zap, text: 'Modulos de regressao (se os despertares voltarem)', color: 'text-yellow-500' },
              { icon: Gift, text: 'Plano de viagem adaptado', color: 'text-purple-500' },
              { icon: Clock, text: 'Suporte prioritario por mensagem', color: 'text-green-500' },
              { icon: Users, text: 'Acesso a comunidade de mae', color: 'text-coral-500' },
              { icon: Heart, text: 'Actualizacoes do app para sempre', color: 'text-red-500' },
              { icon: Star, text: 'Conteudo exclusivo sobre regressoes', color: 'text-orange-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <span className="text-sm text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-coral-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700 italic mb-2">
              "Depois de 7 dias {babyName} estava a dormir a noite toda. Mas na semana siguiente, voltamos a tener 3 despertares. O Plano Manutencao ajudou-me a perceber foi regressado e como a voltar ao normal."
            </p>
            <p className="text-xs text-gray-500">— Ana M., Maputo</p>
          </div>

          {/* Price */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-lg text-gray-400 line-through">2.500 MZN</span>
              <span className="bg-coral-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                -40%
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-800">1.500 MZN</p>
            <p className="text-sm text-gray-500">Pagamento unico • Acesso permanente</p>
          </div>

          {/* Guarantee */}
          <div className="flex items-center justify-center gap-2 mb-4 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Compra segura • Suporte incluido</span>
          </div>

          {/* CTA */}
          <button
            onClick={handleCheckout}
            className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-coral-400 to-coral-500 text-white shadow-lg active:scale-[0.98] transition-all"
          >
            Quero continuar
          </button>

          {/* Dismiss */}
          <button
            onClick={() => { vibrate(30); onClose(); }}
            className="w-full py-3 mt-3 text-gray-500 text-sm"
          >
            Por agora nao, obrigada
          </button>

          <p className="text-center text-xs text-gray-400 mt-2">
            Seras redirecionada para pagamento seguro
          </p>
        </div>
      </div>
    </div>
  );
}
