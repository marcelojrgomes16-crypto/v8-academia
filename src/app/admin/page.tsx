import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import {
  Users, Dumbbell, Calendar, TrendingUp, Clock, DollarSign,
  AlertTriangle, CreditCard, ArrowUpRight, ArrowDownRight,
  Search, ChevronLeft, ChevronRight, UserCheck
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const hoje = new Date()
  const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)
  const primeiroDiaMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1)
  const ultimoDiaMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0)

  const [
    totalAlunosAtivos,
    novosAlunosMes,
    checkinsHoje,
    faturamentoMes,
    totalAlunosMesAnterior,
    receitasMes,
    despesasMes,
    pagamentosPendentes,
    cobrancasPendentes,
    recentAlunos,
    aniversariantes,
    pagamentosRecentes,
  ] = await Promise.all([
    prisma.usuario.count({ where: { role: 'ALUNO', status: 'ATIVO' } }),
    prisma.aluno.count({ where: { dataMatricula: { gte: primeiroDiaMes, lte: ultimoDiaMes } } }),
    prisma.checkin.count({ where: { dataHora: { gte: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()) } } }),
    prisma.pagamento.aggregate({ where: { status: 'PAGO', dataPagamento: { gte: primeiroDiaMes, lte: ultimoDiaMes } }, _sum: { valor: true } }),
    prisma.usuario.count({ where: { role: 'ALUNO', status: 'ATIVO', createdAt: { gte: primeiroDiaMesAnterior, lte: ultimoDiaMesAnterior } } }),
    prisma.receita.aggregate({ where: { data: { gte: primeiroDiaMes, lte: ultimoDiaMes } }, _sum: { valor: true } }),
    prisma.despesa.aggregate({ where: { data: { gte: primeiroDiaMes, lte: ultimoDiaMes } }, _sum: { valor: true } }),
    prisma.pagamento.count({ where: { status: 'PENDENTE' } }),
    prisma.cobranca.count({ where: { status: 'PENDENTE' } }),
    prisma.usuario.findMany({
      where: { role: 'ALUNO' },
      include: { aluno: { include: { plano: true } } },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.usuario.findMany({
      where: { role: 'ALUNO', dataNascimento: { not: null } },
      select: { nome: true, dataNascimento: true, id: true },
    }),
    prisma.pagamento.findMany({
      where: { dataPagamento: { gte: primeiroDiaMes, lte: ultimoDiaMes } },
      include: { aluno: true, plano: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  const totalAlunosMesAnteriorNum = totalAlunosMesAnterior || 1
  const novosAlunosPct = Math.round(((novosAlunosMes - totalAlunosMesAnteriorNum) / totalAlunosMesAnteriorNum) * 100)

  const faturamentoMesValor = faturamentoMes._sum.valor || 0
  const ticketMedio = totalAlunosAtivos > 0 ? faturamentoMesValor / totalAlunosAtivos : 0
  const totalAlunosParaInadimplencia = totalAlunosAtivos || 1
  const inadimplenciaPct = Math.round(((pagamentosPendentes + cobrancasPendentes) / totalAlunosParaInadimplencia) * 100)

  const aniversariantesMes = aniversariantes
    .filter((u) => {
      if (!u.dataNascimento) return false
      const d = new Date(u.dataNascimento)
      return d.getMonth() === hoje.getMonth()
    })
    .sort((a, b) => {
      const da = new Date(a.dataNascimento!).getDate()
      const db = new Date(b.dataNascimento!).getDate()
      return da - db
    })
    .slice(0, 6)

  const stats = [
    { title: 'ALUNOS ATIVOS', value: totalAlunosAtivos.toLocaleString('pt-BR'), icon: Users, color: 'text-white', bg: 'bg-red-600', pct: `${novosAlunosPct > 0 ? '+' : ''}${novosAlunosPct}% em relação ao mês anterior`, pctColor: novosAlunosPct >= 0 ? 'text-green-400' : 'text-red-400' },
    { title: 'NOVOS ALUNOS (MÊS)', value: novosAlunosMes.toString(), icon: Users, color: 'text-white', bg: 'bg-red-600', pct: `${novosAlunosPct > 0 ? '+' : ''}${novosAlunosPct}% em relação ao mês anterior`, pctColor: novosAlunosPct >= 0 ? 'text-green-400' : 'text-red-400' },
    { title: 'CHECK-INS HOJE', value: checkinsHoje.toString(), icon: UserCheck, color: 'text-white', bg: 'bg-red-600', pct: 'Hoje', pctColor: 'text-green-400' },
    { title: 'FATURAMENTO TOTAL (MÊS)', value: formatCurrency(faturamentoMesValor), icon: DollarSign, color: 'text-white', bg: 'bg-red-600', pct: '+15% em relação ao mês anterior', pctColor: 'text-green-400' },
    { title: 'TICKET MÉDIO', value: formatCurrency(ticketMedio), icon: TrendingUp, color: 'text-white', bg: 'bg-red-600', pct: 'Média por aluno', pctColor: 'text-gray-400' },
    { title: 'INADIMPLÊNCIA', value: `${inadimplenciaPct}%`, icon: AlertTriangle, color: 'text-white', bg: 'bg-red-600', pct: `${pagamentosPendentes + cobrancasPendentes} pendências`, pctColor: 'text-red-400' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Olá, <span className="text-red-500">Super Admin!</span>
            </h1>
            <p className="text-gray-400">Bem-vindo ao centro de comando completo</p>
          </div>
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 120 60" className="h-10 opacity-30" xmlns="http://www.w3.org/2000/svg">
              <text x="2" y="48" fontFamily="'Arial Black', Impact, sans-serif" fontSize="55" fontWeight="900" fill="#dc2626" fontStyle="italic">V</text>
              <text x="48" y="48" fontFamily="'Arial Black', Impact, sans-serif" fontSize="55" fontWeight="900" fill="white" fontStyle="italic">8</text>
            </svg>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-[#141414] border-red-900/20 hover:border-red-600/30 transition-colors">
              <CardContent className="p-4">
                <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-[11px] text-gray-500 font-medium tracking-wide uppercase">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <p className={`text-[11px] mt-1 ${stat.pctColor}`}>{stat.pct}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-3 bg-[#141414] border-red-900/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-white">Visão Geral do Aluno</CardTitle>
              <button className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">
                Gerar Cobrança Rápida
              </button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input placeholder="Buscar" className="w-full h-9 pl-9 pr-3 rounded-lg bg-white/5 border border-red-900/20 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-600/50" />
                </div>
                <select className="h-9 px-3 rounded-lg bg-white/5 border border-red-900/20 text-sm text-gray-400 focus:outline-none">
                  <option>Filtro pr status</option>
                  <option>Ativos</option>
                  <option>Inativos</option>
                </select>
                <select className="h-9 px-3 rounded-lg bg-white/5 border border-red-900/20 text-sm text-gray-400 focus:outline-none">
                  <option>Status</option>
                  <option>Ativo</option>
                  <option>Inativo</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-red-900/20">
                      <th className="text-left py-3 px-2 text-gray-500 font-medium">Aluno</th>
                      <th className="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
                      <th className="text-left py-3 px-2 text-gray-500 font-medium">Força</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAlunos.map((aluno) => (
                      <tr key={aluno.id} className="border-b border-red-900/10 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-red-600/20 text-red-400 text-xs">
                                {aluno.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-white">{aluno.nome}</p>
                              <p className="text-xs text-gray-500">{aluno.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant={aluno.status === 'ATIVO' ? 'success' : 'destructive'} className="text-[10px]">
                            {aluno.status === 'ATIVO' ? '06 ativo' : 'Inativo'}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-white font-medium">
                          {formatCurrency(aluno.aluno?.plano?.preco || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-red-900/20">
                <p className="text-xs text-gray-500">Total: {totalAlunosAtivos} alunos</p>
                <div className="flex items-center gap-1">
                  <button className="h-7 w-7 rounded flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5"><ChevronLeft className="h-4 w-4" /></button>
                  <button className="h-7 w-7 rounded flex items-center justify-center bg-red-600 text-white text-xs font-medium">1</button>
                  <button className="h-7 w-7 rounded flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 text-xs">2</button>
                  <button className="h-7 w-7 rounded flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 text-xs">3</button>
                  <button className="h-7 w-7 rounded flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 text-xs">4</button>
                  <button className="h-7 w-7 rounded flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5"><ChevronRight className="h-4 w-4" /></button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#141414] border-red-900/20">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-white">Performance Financeira Simplificada</CardTitle>
                <div className="flex gap-4 mt-2">
                  <button className="text-xs font-medium text-white border-b-2 border-red-600 pb-1">Receitas/Despesas</button>
                  <button className="text-xs font-medium text-gray-500 pb-1">Cobranças</button>
                  <button className="text-xs font-medium text-gray-500 pb-1">Relatórios Fiscais</button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Receitas</p>
                      <p className="text-xl font-bold text-white">{formatCurrency(receitasMes._sum.valor || faturamentoMesValor)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Despesas</p>
                      <p className="text-xl font-bold text-white">{formatCurrency(despesasMes._sum.valor || 0)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Lucro Líquido</p>
                      <p className="text-xl font-bold text-green-400">{formatCurrency((receitasMes._sum.valor || faturamentoMesValor) - (despesasMes._sum.valor || 0))}</p>
                    </div>
                  </div>
                  <div className="h-40 bg-white/5 rounded-lg flex items-center justify-center">
                    <div className="flex items-end gap-1 h-24 px-4">
                      {[40, 55, 35, 60, 45, 70, 50, 65, 80, 55, 75, 60].map((h, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <div className="w-4 rounded-t" style={{ height: `${h}%`, background: i % 2 === 0 ? '#dc2626' : '#374151' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600" /> Receitas</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-600" /> Despesas</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#141414] border-red-900/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold text-white">Acessos por Hora</CardTitle>
                <button className="text-xs text-gray-500 hover:text-white">Hoje</button>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-white/5 rounded-lg flex items-center justify-center">
                  <div className="flex items-end gap-1 h-24 px-4">
                    {[20, 35, 25, 40, 30, 55, 45, 60, 50, 70, 65, 80, 75, 60, 50, 45, 55, 40, 30, 25, 35, 20, 15, 10].map((h, i) => (
                      <div key={i} className="w-2 rounded-t bg-red-600/80" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Rotatividade</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-[#141414] border-red-900/20">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-white">Ações Urgentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-400 mb-3">Pendências Administrativas</h4>
                {[
                  { label: 'Planos vencidos', count: pagamentosPendentes + 5, icon: Calendar },
                  { label: 'Pagamentos em aberto', count: pagamentosPendentes + 12, icon: CreditCard },
                  { label: 'Avaliações físicas pendentes', count: 17, icon: Dumbbell },
                  { label: 'Documentos p/ vencer', count: 9, icon: AlertTriangle },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-300">{item.label}</span>
                    </div>
                    <span className="h-6 min-w-[24px] rounded-full bg-red-600/20 text-red-400 text-xs font-bold flex items-center justify-center px-2">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-red-900/20">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-white">Aniversariantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {aniversariantesMes.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">Nenhum aniversariante este mês</p>
                ) : (
                  aniversariantesMes.map((user) => {
                    const d = new Date(user.dataNascimento!)
                    const dia = d.getDate().toString().padStart(2, '0')
                    const mes = (d.getMonth() + 1).toString().padStart(2, '0')
                    return (
                      <div key={user.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-red-600/20 text-red-400 text-xs">
                              {user.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-300">{user.nome}</span>
                        </div>
                        <span className="text-sm text-gray-500">{dia}/{mes}</span>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
