'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Eye, EyeOff, User, Lock } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const loginSchema = z.object({
  email: z.string().min(1, 'E-mail ou CPF é obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginFormInner() {
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Erro ao fazer login')
      }

      window.location.href = '/dashboard'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.25) saturate(1.2)',
        }}
      />

      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(185,28,28,0.25) 0%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,0.95) 100%)',
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-32 z-[2]"
        style={{
          background: 'linear-gradient(180deg, rgba(185,28,28,0.15) 0%, transparent 100%)',
        }}
      />

      <div className="absolute top-8 left-[15%] w-[120px] h-[3px] bg-red-600/80 rotate-[20deg] blur-[1px] z-[2]" />
      <div className="absolute top-12 left-[18%] w-[80px] h-[2px] bg-red-500/60 rotate-[25deg] blur-[1px] z-[2]" />
      <div className="absolute top-8 right-[15%] w-[120px] h-[3px] bg-red-600/80 -rotate-[20deg] blur-[1px] z-[2]" />
      <div className="absolute top-12 right-[18%] w-[80px] h-[2px] bg-red-500/60 -rotate-[25deg] blur-[1px] z-[2]" />

      <div className="relative z-10 w-full max-w-[420px] px-6">
        <div className="text-center mb-8">
          <div className="mb-3 flex items-center justify-center gap-0">
            <svg viewBox="0 0 300 140" className="w-[280px]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="vGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#b91c1c" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <text x="10" y="105" fontFamily="'Arial Black', 'Impact', sans-serif" fontSize="120" fontWeight="900" fill="url(#vGrad)" fontStyle="italic" filter="url(#glow)">V</text>
              <text x="120" y="105" fontFamily="'Arial Black', 'Impact', sans-serif" fontSize="120" fontWeight="900" fill="white" filter="url(#glow)">8</text>
              <text x="40" y="135" fontFamily="'Arial', 'Helvetica', sans-serif" fontSize="28" fontWeight="700" fill="white" letterSpacing="14">ACADEMIA</text>
            </svg>
          </div>
          <p className="text-gray-400 text-sm tracking-[0.35em] uppercase font-medium">
            Força <span className="text-red-500 mx-1">•</span> Foco <span className="text-red-500 mx-1">•</span> Resultados
          </p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            background: 'linear-gradient(180deg, rgba(20,10,10,0.85) 0%, rgba(10,5,5,0.92) 100%)',
            border: '1px solid rgba(127,29,29,0.3)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 60px rgba(185,28,28,0.06)',
          }}
        >
          {registered && (
            <div className="mb-4 p-3 rounded-lg bg-green-900/30 border border-green-800/50 text-green-400 text-sm text-center">
              Conta criada com sucesso! Faça login.
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-800/50 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  {...register('email')}
                  type="text"
                  placeholder="Usuário"
                  className="w-full h-13 pl-12 pr-4 rounded-xl bg-black/50 border border-gray-800/80 text-white placeholder-gray-500 focus:outline-none focus:border-red-700/60 focus:ring-1 focus:ring-red-700/30 transition-all text-sm"
                  style={{ height: '52px' }}
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Senha"
                  className="w-full h-13 pl-12 pr-12 rounded-xl bg-black/50 border border-gray-800/80 text-white placeholder-gray-500 focus:outline-none focus:border-red-700/60 focus:ring-1 focus:ring-red-700/30 transition-all text-sm"
                  style={{ height: '52px' }}
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end pt-1">
              <Link href="/recuperar-senha" className="text-gray-400 hover:text-white text-sm transition-colors">
                Esqueci minha senha
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl font-bold text-white text-base tracking-wider uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-red-900/40 active:scale-[0.98]"
              style={{
                height: '52px',
                background: 'linear-gradient(180deg, #dc2626 0%, #b91c1c 100%)',
                boxShadow: '0 4px 24px rgba(185,28,28,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Carregando...
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6 tracking-wide">
          © 2024 V8 ACADEMIA
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
      </div>
    }>
      <LoginFormInner />
    </Suspense>
  )
}
