'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff, Mail, Lock, User, Phone, Calendar } from 'lucide-react'

const registerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  cpf: z.string().min(11, 'CPF inválido').max(14, 'CPF inválido'),
  telefone: z.string().min(10, 'Telefone inválido').optional(),
  dataNascimento: z.string().optional(),
  genero: z.string().optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  termos: z.boolean().refine(val => val === true, { message: 'Você deve aceitar os termos' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { termos: false },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: data.nome,
          email: data.email,
          cpf: data.cpf.replace(/\D/g, ''),
          telefone: data.telefone?.replace(/\D/g, ''),
          dataNascimento: data.dataNascimento ? new Date(data.dataNascimento) : null,
          genero: data.genero || null,
          password: data.password,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Erro ao cadastrar')
      }

      router.push('/entrar?registered=true')
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Erro ao cadastrar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Criar Conta</CardTitle>
        <CardDescription>Junte-se à V8 Academia</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
            <Input
              {...register('nome')}
              type="text"
              placeholder="Nome completo"
              className="pl-10"
              error={errors.nome?.message}
              autoComplete="name"
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
            <Input
              {...register('email')}
              type="email"
              placeholder="E-mail"
              className="pl-10"
              error={errors.email?.message}
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
            <Input
              {...register('cpf')}
              type="text"
              placeholder="CPF (apenas números)"
              className="pl-10"
              error={errors.cpf?.message}
              autoComplete="off"
              maxLength={14}
              disabled={isLoading}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '')
                value = value.replace(/(\d{3})(\d)/, '$1.$2')
                value = value.replace(/(\d{3})(\d)/, '$1.$2')
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
                e.target.value = value
                register('cpf').onChange({ target: { value, name: 'cpf' } })
              }}
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
            <Input
              {...register('telefone')}
              type="tel"
              placeholder="Telefone (opcional)"
              className="pl-10"
              error={errors.telefone?.message}
              autoComplete="tel"
              maxLength={15}
              disabled={isLoading}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '')
                if (value.length <= 11) {
                  if (value.length > 6) value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
                  else if (value.length > 2) value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2')
                  else if (value.length > 0) value = value.replace(/(\d{0,2})/, '($1')
                }
                e.target.value = value
                register('telefone').onChange({ target: { value, name: 'telefone' } })
              }}
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
            <Input
              {...register('dataNascimento')}
              type="date"
              placeholder="Data de nascimento (opcional)"
              className="pl-10"
              error={errors.dataNascimento?.message}
              autoComplete="bday"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label className="text-sm text-gray-400 mb-2 block">Genero (opcional)</Label>
            <div className="flex gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border border-gym-border bg-gym-dark cursor-pointer hover:border-red-500/50 transition-colors has-[:checked]:border-red-500 has-[:checked]:bg-red-600/10">
                <input type="radio" {...register('genero')} value="MASCULINO" className="sr-only" />
                <span className="text-sm text-gray-300">Masculino</span>
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border border-gym-border bg-gym-dark cursor-pointer hover:border-red-500/50 transition-colors has-[:checked]:border-red-500 has-[:checked]:bg-red-600/10">
                <input type="radio" {...register('genero')} value="FEMININO" className="sr-only" />
                <span className="text-sm text-gray-300">Feminino</span>
              </label>
            </div>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha (mín. 6 caracteres)"
              className="pl-10 pr-10"
              error={errors.password?.message}
              autoComplete="new-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
            <Input
              {...register('confirmPassword')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirmar senha"
              className="pl-10"
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              {...register('termos')}
              type="checkbox"
              id="termos"
              className="mt-1 h-4 w-4 rounded border-gym-border bg-gym-dark text-primary-600 focus:ring-primary-500"
              disabled={isLoading}
            />
            <label htmlFor="termos" className="text-sm text-gray-300">
              Aceito os <Link href="/termos" className="text-red-400 hover:underline">Termos de Uso</Link> e a{' '}
              <Link href="/privacidade" className="text-red-400 hover:underline">Política de Privacidade</Link>
            </label>
          </div>

          <Button type="submit" className="w-full" size="lg" loading={isLoading}>
            <Loader2 className="h-4 w-4" aria-hidden="true" />
            Criar Conta
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Separator />
        <p className="text-sm text-gray-400 text-center">
          Já tem conta?{' '}
          <Link href="/entrar" className="text-red-400 hover:underline font-medium">
            Entrar
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}