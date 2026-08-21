import { RegisterForm } from '@/components/forms/register-form'
import { Dumbbell } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gym-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600">
              <Dumbbell className="h-7 w-7 text-white" />
            </div>
            <span className="font-bold text-2xl text-white">V8 Academia</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Criar Conta</h1>
          <p className="text-gray-400 mt-2">Junte-se à V8 Academia</p>
        </div>

        <RegisterForm />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Desenvolvido com{' '}
            <span className="text-red-500">♥</span>{' '}
            para a V8 Academia
          </p>
        </div>
      </div>
    </div>
  )
}
