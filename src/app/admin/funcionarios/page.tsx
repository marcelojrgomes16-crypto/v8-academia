import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma';
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCurrency } from '@/lib/utils'
import { UserCheck } from 'lucide-react'
import { FuncionarioActions } from './funcionario-actions'

export const dynamic = 'force-dynamic'

export default async function FuncionariosPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const funcionarios = await prisma.funcionario.findMany({
    include: {
      usuario: {
        select: {
          id: true, nome: true, email: true, telefone: true, status: true, avatarUrl: true,
        },
      },
    },
    orderBy: { dataAdmissao: 'desc' },
  })

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Funcionarios</h1>
          <p className="text-gray-400 text-sm mt-1">Gerencie os funcionarios da academia</p>
        </div>
        <FuncionarioActions usuarios={[]} />
      </div>

      {funcionarios.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserCheck className="h-12 w-12 text-gray-500 mb-4" />
            <p className="text-gray-400 text-center">Nenhum funcionario cadastrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {funcionarios.map((func) => (
            <Card key={func.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-red-600/20 flex items-center justify-center text-red-400 font-bold">
                    {func.usuario.nome.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{func.usuario.nome}</h3>
                      <Badge variant={func.usuario.status === 'ATIVO' ? 'success' : 'warning'}>
                        {func.usuario.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                      <span>{func.usuario.email}</span>
                      <span>Cargo: {func.cargo}</span>
                      {func.salario && <span>Salario: {formatCurrency(func.salario)}</span>}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500 hidden sm:block">
                    <p>Admissao: {formatDate(func.dataAdmissao)}</p>
                  </div>
                  <FuncionarioActions funcionario={func} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
