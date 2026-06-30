import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MoonStar, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

export function Auth({ isNightMode = false }: { isNightMode?: boolean }) {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: authError } = isLogin
        ? await signIn(email, password)
        : await signUp(email, password);

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Email ou senha incorretos.');
        } else if (authError.message.includes('already registered')) {
          setError('Este email já está registado.');
        } else {
          setError(authError.message);
        }
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${isNightMode ? 'bg-gray-900 text-white' : 'bg-cream text-gray-800'}`}>
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-coral-400 to-coral-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <MoonStar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Sono sem Choro</h1>
          <p className={`mt-2 text-center ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {isLogin ? 'Bem-vinda de volta!' : 'Cria a tua conta para começar'}
          </p>
        </div>

        <div className={`p-6 sm:p-8 rounded-3xl shadow-xl ${isNightMode ? 'bg-gray-800' : 'bg-white'}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 mb-4 rounded-xl bg-red-100 text-red-700 flex items-start gap-2 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-1">
              <label className={`text-sm font-medium ${isNightMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${isNightMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 py-3 rounded-xl border ${
                    isNightMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-coral-400 focus:border-coral-400'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-coral-400 focus:border-coral-400'
                  } transition-colors`}
                  placeholder="exemplo@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={`text-sm font-medium ${isNightMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${isNightMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 py-3 rounded-xl border ${
                    isNightMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-coral-400 focus:border-coral-400'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-coral-400 focus:border-coral-400'
                  } transition-colors`}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 mt-6 bg-coral-400 hover:bg-coral-500 text-white rounded-xl text-lg font-bold shadow-md hover:shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : isLogin ? (
                'Entrar'
              ) : (
                'Criar Conta'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className={`text-sm font-medium ${
                isNightMode ? 'text-coral-400 hover:text-coral-300' : 'text-coral-500 hover:text-coral-600'
              }`}
            >
              {isLogin
                ? 'Não tens conta? Cria uma aqui'
                : 'Já tens conta? Entra aqui'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
