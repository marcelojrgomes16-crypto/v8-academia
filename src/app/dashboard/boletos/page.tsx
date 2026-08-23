import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, CheckCircle, Clock } from 'lucide-react'
import { BoletoActions } from './boleto-actions'

export const dynamic = 'force-dynamic'

export default async function BoletosPage() {
  const session = await getSession()
  if (!session) redirect('/entrar')

  const cobrancas = await prisma.cobranca.findMany({
    where: { alunoId: session.user.id },
    orderBy: { dataVencimento: 'desc' },
  })

  const totalPendente = cobrancas
    .filter(c => c.status === 'PENDENTE' || c.status === 'ATRASADO')
    .reduce((acc, c) => acc + c.valor, 0)

  const totalPago = cobrancas
    .filter(c => c.status === 'PAGO')
    .reduce((acc, c) => acc + c.valor, 0)

  const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'info'> = {
    PAGO: 'success',
    PENDENTE: 'warning',
    ATRASADO: 'destructive',
    CANCELADO: 'destructive',
  }

  const statusLabel: Record<string, string> = {
    PAGO: 'Pago',
    PENDENTE: 'Pendente',
    ATRASADO: 'Atrasado',
    CANCELADO: 'Cancelado',
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Meus Boletos</h1>
          <p className="text-gray-400 text-sm mt-1">Acompanhe suas cobrancas e pagamentos</p>
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          <Card className="bg-[#141414] border-red-900/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Pago</p>
                  <p className="text-2xl font-bold text-green-400 mt-1">{formatCurrency(totalPago)}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-green-600/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-red-900/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pendente</p>
                  <p className="text-2xl font-bold text-yellow-400 mt-1">{formatCurrency(totalPendente)}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-yellow-600/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-red-900/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total de Boletos</p>
                  <p className="text-2xl font-bold text-white mt-1">{cobrancas.length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-red-600/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {cobrancas.length === 0 ? (
          <Card className="bg-[#141414] border-red-900/20">
            <CardContent className="flex flex-col items-center justify-center py-10 sm:py-16">
              <CreditCard className="h-16 w-16 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">Nenhum boleto encontrado</h3>
              <p className="text-gray-500 text-center max-w-md">
                Voce ainda nao possui cobrancas registradas.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {cobrancas.map((cob) => (
              <Card key={cob.id} className="bg-[#141414] border-red-900/20 hover:border-red-900/40 transition-colors">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-white">{cob.descricao}</h3>
                        <Badge variant={statusVariant[cob.status]}>
                          {statusLabel[cob.status]}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                        <span>Vencimento: {formatDate(cob.dataVencimento)}</span>
                        {cob.dataPagamento && (
                          <span>Pago em: {formatDate(cob.dataPagamento)}</span>
                        )}
                        {cob.observacoes && (
                          <span className="text-gray-500">{cob.observacoes}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                      <p className="text-lg sm:text-xl font-bold text-white">{formatCurrency(cob.valor)}</p>
                      <BoletoActions cobrancaId={cob.id} status={cob.status} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
