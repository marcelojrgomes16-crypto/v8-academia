import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Dumbbell, Calendar, DollarSign, TrendingUp, CheckCircle } from 'lucide-react'

export default async function RelatoriosPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const [
    totalAlunos,
    alunosAtivos,
    totalProfessores,
    treinosAtivos,
    totalAulas,
    receitaTotal,
    pagamentosPendentes,
    totalCheckins,
  ] = await Promise.all([
    prisma.aluno.count(),
    prisma.usuario.count({ where: { role: 'ALUNO', status: 'ATIVO' } }),
    prisma.professor.count(),
    prisma.treino.count({ where: { status: 'ATIVO' } }),
    prisma.aula.count({ where: { ativa: true } }),
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
    prisma.checkin.count(),
  ])

  const taxaPresenca = totalAlunos > 0 ? ((totalCheckins / (totalAlunos * 30)) * 100).toFixed(1) : '0'

  const stats = [
    {
      title: 'Total de Alunos',
      value: totalAlunos.toString(),
      detail: `${alunosAtivos} ativos`,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      title: 'Professores',
      value: totalProfessores.toString(),
      detail: 'cadastrados',
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
    {
      title: 'Treinos Ativos',
      value: treinosAtivos.toString(),
      detail: 'em andamento',
      icon: Dumbbell,
      color: 'text-orange-400',
      bg: 'bg-orange-400/10',
    },
    {
      title: 'Aulas Ativas',
      value: totalAulas.toString(),
      detail: 'semanais',
      icon: Calendar,
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
    },
    {
      title: 'Receita Total',
      value: formatCurrency(receitaTotal._sum.valor || 0),
      detail: `${receitaTotal._count} pagos`,
      icon: DollarSign,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    {
      title: 'Pagamentos Pendentes',
      value: formatCurrency(pagamentosPendentes._sum.valor || 0),
      detail: `${pagamentosPendentes._count} pendentes`,
      icon: TrendingUp,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
    },
    {
      title: 'Total Check-ins',
      value: totalCheckins.toString(),
      detail: 'este mes',
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
    {
      title: 'Taxa de Presenca',
      value: `${taxaPresenca}%`,
      detail: 'media mensal',
      icon: TrendingUp,
      color: 'text-pink-400',
      bg: 'bg-pink-400/10',
    },
  ]

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Relatorios</h1>
        <p className="text-gray-400 text-sm mt-1">
          Visao geral do desempenho da academia
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.detail}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
