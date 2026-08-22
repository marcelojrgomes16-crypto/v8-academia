import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDate } from '@/lib/utils'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

const pagamentoStatusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'info'> = {
  PAGO: 'success',
  PENDENTE: 'warning',
  ATRASADO: 'destructive',
  CANCELADO: 'destructive',
}

export default async function FinanceiroPage() {

  const [pagamentos, receitaTotal, pagamentosPendentes, pagamentosAtrasados] = await Promise.all([
    prisma.pagamento.findMany({
      include: {
        aluno: { select: { nome: true } },
        plano: { select: { nome: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.pagamento.aggregate({
      where: { status: 'PAGO' },
      _sum: { valor: true },
      _count: true,
    }),
    prisma.pagamento.aggregate({
      where: { status: 'PENDENTE' },
      _sum: { valor: true },
      _count: true,
    }),
    prisma.pagamento.aggregate({
      where: { status: 'ATRASADO' },
      _sum: { valor: true },
      _count: true,
    }),
  ])

  const resumoCards = [
    {
      title: 'Receita Total',
      value: formatCurrency(receitaTotal._sum.valor || 0),
      detail: `${receitaTotal._count} pagamentos`,
      icon: DollarSign,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    {
      title: 'A Receber',
      value: formatCurrency(pagamentosPendentes._sum.valor || 0),
      detail: `${pagamentosPendentes._count} pendentes`,
      icon: Clock,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
    },
    {
      title: 'Atrasados',
      value: formatCurrency(pagamentosAtrasados._sum.valor || 0),
      detail: `${pagamentosAtrasados._count} atrasados`,
      icon: TrendingUp,
      color: 'text-red-400',
      bg: 'bg-red-400/10',
    },
    {
      title: 'Total Transacoes',
      value: (receitaTotal._count + pagamentosPendentes._count + pagamentosAtrasados._count).toString(),
      detail: 'todas',
      icon: CheckCircle,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
  ]

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Financeiro</h1>
        <p className="text-gray-400 text-sm mt-1">
          Controle financeiro da academia
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {resumoCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.detail}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.bg}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ultimos Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {pagamentos.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">Nenhum pagamento encontrado</p>
          ) : (
            <div className="space-y-3">
              {pagamentos.map((pagamento) => (
                <div
                  key={pagamento.id}
                  className="flex items-center justify-between py-3 border-b border-gym-border last:border-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{pagamento.aluno.nome}</p>
                      <Badge variant={pagamentoStatusVariant[pagamento.status] || 'info'} className="text-[10px]">
                        {pagamento.status}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>{pagamento.plano.nome}</span>
                      <span>Venc: {formatDate(pagamento.dataVencimento)}</span>
                      {pagamento.dataPagamento && <span>Pago: {formatDate(pagamento.dataPagamento)}</span>}
                      {pagamento.metodo && <span>{pagamento.metodo}</span>}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-green-400">{formatCurrency(pagamento.valor)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
