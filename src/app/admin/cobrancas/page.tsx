import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma';
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCurrency } from '@/lib/utils'
import { CreditCard } from 'lucide-react'
import { CobrancaActions } from './cobranca-actions'

export const dynamic = 'force-dynamic'

export default async function CobrancasPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const cobrancas = await prisma.cobranca.findMany({
    include: {
      aluno: { select: { id: true, nome: true, email: true } },
    },
    orderBy: { dataVencimento: 'desc' },
  })

  const totalPendente = cobrancas.filter((c) => c.status === 'PENDENTE').reduce((a, c) => a + c.valor, 0)
  const totalPago = cobrancas.filter((c) => c.status === 'PAGO').reduce((a, c) => a + c.valor, 0)

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Cobrancas</h1>
          <p className="text-gray-400 text-sm mt-1">Controle de cobrancas da academia</p>
        </div>
        <CobrancaActions />
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Pendente</p>
            <p className="text-2xl font-bold text-yellow-400">{formatCurrency(totalPendente)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Pago</p>
            <p className="text-2xl font-bold text-green-400">{formatCurrency(totalPago)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Total</p>
            <p className="text-2xl font-bold">{cobrancas.length} cobrancas</p>
          </CardContent>
        </Card>
      </div>

      {cobrancas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-gray-500 mb-4" />
            <p className="text-gray-400 text-center">Nenhuma cobranca registrada</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-red-900/20">
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Aluno</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Descricao</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Valor</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Vencimento</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {cobrancas.map((cob) => (
                  <tr key={cob.id} className="border-b border-red-900/10 hover:bg-white/5">
                    <td className="p-4 text-sm">{cob.aluno.nome}</td>
                    <td className="p-4 text-sm">{cob.descricao}</td>
                    <td className="p-4 text-sm text-right font-medium">{formatCurrency(cob.valor)}</td>
                    <td className="p-4 text-sm text-gray-400">{formatDate(cob.dataVencimento)}</td>
                    <td className="p-4">
                      <Badge variant={
                        cob.status === 'PAGO' ? 'success' :
                        cob.status === 'PENDENTE' ? 'warning' :
                        cob.status === 'ATRASADO' ? 'destructive' : 'info'
                      }>
                        {cob.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <CobrancaActions cobranca={cob} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </DashboardLayout>
  )
}
