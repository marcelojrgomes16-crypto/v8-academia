import Link from 'next/link'
import { ArrowRight, Dumbbell, Users, Calendar, TrendingUp, Star, ChevronRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-red-900/20 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 120 60" className="h-9" xmlns="http://www.w3.org/2000/svg">
              <text x="2" y="48" fontFamily="'Arial Black', Impact, sans-serif" fontSize="55" fontWeight="900" fill="#dc2626" fontStyle="italic">V</text>
              <text x="48" y="48" fontFamily="'Arial Black', Impact, sans-serif" fontSize="55" fontWeight="900" fill="white" fontStyle="italic">8</text>
              <text x="8" y="58" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" fill="white" letterSpacing="4">ACADEMIA</text>
            </svg>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Cadastrar
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.2) saturate(1.2)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 40%, rgba(185,28,28,0.2) 0%, rgba(0,0,0,0.85) 70%)',
          }}
        />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-center">
            <svg viewBox="0 0 300 140" className="w-[320px]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="vGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#b91c1c" />
                </linearGradient>
              </defs>
              <text x="10" y="105" fontFamily="'Arial Black', Impact, sans-serif" fontSize="120" fontWeight="900" fill="url(#vGrad)" fontStyle="italic">V</text>
              <text x="120" y="105" fontFamily="'Arial Black', Impact, sans-serif" fontSize="120" fontWeight="900" fill="white">8</text>
              <text x="40" y="135" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="700" fill="white" letterSpacing="14">ACADEMIA</text>
            </svg>
          </div>

          <p className="text-gray-400 text-lg tracking-[0.3em] uppercase font-medium mb-4">
            Força &bull; Foco &bull; Resultados
          </p>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Transforme seu <span className="text-red-500">corpo</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Acesse seus treinos, acompanhe seu progresso e conecte-se com seus professores. Tudo em um so lugar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all hover:shadow-lg hover:shadow-red-900/40 flex items-center gap-2 text-lg"
            >
              Comece Agora <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border border-gray-700 text-gray-300 font-medium rounded-xl hover:bg-white/5 hover:border-gray-600 transition-all text-lg"
            >
              Ja tenho conta
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que a V8?</h2>
            <p className="text-gray-400 max-w-lg mx-auto">Tudo que voce precisa para alcançar seus objetivos em um unico lugar.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Dumbbell, title: 'Treinos Personalizados', desc: 'Planos de treino criados pelos nossos professores, com videos e imagens de referencia para cada exercicio.' },
              { icon: Users, title: 'Acompanhamento', desc: 'Conecte-se diretamente com seu personal trainer e acompanhe sua evolucao semana a semana.' },
              { icon: Calendar, title: 'Agendamento Facil', desc: 'Agende aulas e horarios direto pelo seu celular, sem filas ou burocracia.' },
            ].map((item) => (
              <div key={item.title} className="p-8 rounded-2xl bg-[#141414] border border-red-900/10 hover:border-red-900/30 transition-colors group">
                <div className="h-14 w-14 rounded-xl bg-red-600/10 flex items-center justify-center mb-5 group-hover:bg-red-600/20 transition-colors">
                  <item.icon className="h-7 w-7 text-red-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-red-900/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { num: '500+', label: 'Alunos ativos' },
              { num: '50+', label: 'Professores' },
              { num: '1000+', label: 'Treinos executados' },
              { num: '98%', label: 'Satisfacao' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-black text-red-500 mb-2">{stat.num}</p>
                <p className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-red-900/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para comecar?</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Crie sua conta gratuita e comece a transformar seu corpo hoje mesmo.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all hover:shadow-lg hover:shadow-red-900/40 text-lg"
          >
            Criar Minha Conta <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-red-900/10 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 120 60" className="h-7" xmlns="http://www.w3.org/2000/svg">
              <text x="2" y="48" fontFamily="'Arial Black', Impact, sans-serif" fontSize="55" fontWeight="900" fill="#dc2626" fontStyle="italic">V</text>
              <text x="48" y="48" fontFamily="'Arial Black', Impact, sans-serif" fontSize="55" fontWeight="900" fill="white" fontStyle="italic">8</text>
              <text x="8" y="58" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" fill="white" letterSpacing="4">ACADEMIA</text>
            </svg>
          </div>
          <p className="text-gray-500 text-sm">© 2026 V8 Academia. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
