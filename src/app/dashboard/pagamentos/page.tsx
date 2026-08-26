import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function PagamentosPage() {
  let session
  try {
    session = await getSession()
  } catch {
    redirect('/entrar')
  }
  if (!session) redirect('/entrar')

  let pagamentos: any[] = []
  try {
    pagamentos = await prisma.pagamento.findMany({
      where: { alunoId: session.user.id },
      include: { plano: { select: { nome: true } } },
      orderBy: { createdAt: 'desc' },
    })
  } catch (e) {
    console.error('Pagamentos query error:', e)
  }

  const totalPago = pagamentos
    .filter(p => p.status === 'PAGO')
    .reduce((acc, p) => acc + p.valor, 0)

  const totalPendente = pagamentos
    .filter(p => p.status === 'PENDENTE' || p.status === 'ATRASADO')
    .reduce((acc, p) => acc + p.valor, 0)

  const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'info'> = {
    PAGO: 'success',
    PENDENTE: 'warning',
    ATRASADO: 'destructive',
    CANCELADO: 'destructive',
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Meus Pagamentos</h1>
          <p className="text-gray-400 text-sm mt-1">Historico completo de pagamentos</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-[#141414] border-red-900/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Pago</p>
                  <p className="text-2xl font-bold text-green-400 mt-1">{formatCurrency(totalPago)}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#141414] border-red-900/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">A Pagar</p>
                  <p className="text-2xl font-bold text-yellow-400 mt-1">{formatCurrency(totalPendente)}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#141414] border-red-900/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total de Pagamentos</p>
                  <p className="text-2xl font-bold text-white mt-1">{pagamentos.length}</p>
                </div>
                <DollarSign className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {pagamentos.length === 0 ? (
          <Card className="bg-[#141414] border-red-900/20">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <DollarSign className="h-16 w-16 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">Nenhum pagamento registrado</h3>
              <p className="text-gray-500 text-center max-w-md">
                Seus pagamentos aparecerao aqui.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-[#141414] border-red-900/20">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-red-900/20">
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Data</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Plano</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Metodo</th>
                    <th className="text-right p-4 text-sm font-medium text-gray-400">Valor</th>
                    <th className="text-center p-4 text-sm font-medium text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pagamentos.map((pag) => (
                    <tr key={pag.id} className="border-b border-red-900/10 hover:bg-white/5">
                      <td className="p-4 text-sm text-gray-300">
                        {formatDate(pag.dataPagamento || pag.createdAt)}
                      </td>
                      <td className="p-4 text-sm text-gray-300">
                        {pag.plano?.nome || '—'}
                      </td>
                      <td className="p-4 text-sm text-gray-400">
                        {pag.metodo || '—'}
                      </td>
                      <td className="p-4 text-sm text-right font-medium text-white">
                        {formatCurrency(pag.valor)}
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant={statusVariant[pag.status]}>
                          {pag.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
