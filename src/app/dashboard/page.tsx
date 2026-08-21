import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatDate, getInitials } from '@/lib/utils'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import { Dumbbell, Calendar, TrendingUp, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const userId = session.user.id
  const hoje = new Date()

  const [treinos, agendamentos, avaliacoes, checkins] = await Promise.all([
    prisma.treino.findMany({
      where: { alunoId: userId, status: 'ATIVO' },
      include: { exercicios: { include: { exercicio: true } } },
      orderBy: { updatedAt: 'desc' },
      take: 3,
    }),
    prisma.agendamento.findMany({
      where: {
        alunoId: userId,
        status: { in: ['AGENDADO', 'CONFIRMADO'] },
        dataHora: { gte: hoje },
      },
      include: { aula: true },
      orderBy: { dataHora: 'asc' },
      take: 5,
    }),
    prisma.avaliacaoFisica.findFirst({
      where: { alunoId: userId },
      orderBy: { data: 'desc' },
    }),
    prisma.checkin.findMany({
      where: { alunoId: userId },
      orderBy: { dataHora: 'desc' },
      take: 1,
    }),
  ])

  const totalTreinos = await prisma.treino.count({
    where: { alunoId: userId, status: 'ATIVO' },
  })
  const totalAgendamentos = await prisma.agendamento.count({
    where: {
      alunoId: userId,
      status: { in: ['AGENDADO', 'CONFIRMADO'] },
      dataHora: { gte: hoje },
    },
  })

  const treinosHoje = treinos.filter((t) => {
    const dias = (t.diasSemana || []) as number[]
    const hojeDia = hoje.getDay()
    return dias.includes(hojeDia === 0 ? 7 : hojeDia)
  })

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Bem-vindo, {session.user.name?.split(' ')[0]}!
            </h1>
            <p className="text-gray-400">Acompanhe seus treinos e agendamentos</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/treinos">
              <Button>
                <Dumbbell className="mr-2 h-4 w-4" />
                Meus Treinos
              </Button>
            </Link>
            <Link href="/dashboard/agendamentos">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Agendar Aula
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Treinos Ativos
              </CardTitle>
              <Dumbbell className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTreinos}</div>
              <p className="text-xs text-gray-500">Treinos em andamento</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Agendamentos
              </CardTitle>
              <Calendar className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAgendamentos}</div>
              <p className="text-xs text-gray-500">Próximas aulas agendadas</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                IMC Atual
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {avaliacoes
                  ? (avaliacoes.imc as number).toFixed(1)
                  : '—'}
              </div>
              <p className="text-xs text-gray-500">
                {avaliacoes
                  ? `Última: ${formatDate(avaliacoes.data)}`
                  : 'Nenhuma avaliação'}
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Último Check-in
              </CardTitle>
              <Clock className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {checkins[0]
                  ? formatDate(checkins[0].dataHora)
                  : '—'}
              </div>
              <p className="text-xs text-gray-500">
                {checkins[0] ? 'Academia' : 'Nenhum registro'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-red-400" />
                Treinos de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              {treinosHoje.length === 0 ? (
                <div className="text-center py-8">
                  <Dumbbell className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Nenhum treino para hoje</p>
                  <Link
                    href="/dashboard/treinos"
                    className="text-red-400 hover:underline text-sm mt-2 inline-block"
                  >
                    Ver todos os treinos →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {treinosHoje.map((treino) => (
                    <Link
                      key={treino.id}
                      href={`/dashboard/treinos/${treino.id}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-gym-dark border border-gym-border hover:border-red-500/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{treino.nome}</p>
                        <p className="text-sm text-gray-400">
                          {treino.exercicios.length} exercícios
                        </p>
                      </div>
                      <Badge variant="success">Iniciar</Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-red-400" />
                Próximos Agendamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {agendamentos.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Nenhum agendamento futuro</p>
                  <Link
                    href="/dashboard/agendamentos"
                    className="text-red-400 hover:underline text-sm mt-2 inline-block"
                  >
                    Agendar aula →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {agendamentos.map((agendamento) => (
                    <div
                      key={agendamento.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gym-dark border border-gym-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/20">
                          <Calendar className="h-5 w-5 text-red-400" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {agendamento.aula?.nome || 'Aula Personalizada'}
                          </p>
                          <p className="text-sm text-gray-400">
                            {formatDate(agendamento.dataHora)} às{' '}
                            {agendamento.dataHora.toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          agendamento.status === 'CONFIRMADO'
                            ? 'success'
                            : 'outline'
                        }
                      >
                        {agendamento.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {avaliacoes && (
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-red-400" />
                Progresso Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 rounded-lg bg-gym-dark border border-gym-border">
                  <div className="text-3xl font-bold text-red-400">
                    {(avaliacoes.peso as number).toFixed(1)}kg
                  </div>
                  <div className="text-sm text-gray-400">Peso</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-gym-dark border border-gym-border">
                  <div className="text-3xl font-bold text-red-400">
                    {(avaliacoes.imc as number).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-400">IMC</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-gym-dark border border-gym-border">
                  <div className="text-3xl font-bold text-red-400">
                    {avaliacoes.percentualGordura
                      ? `${(avaliacoes.percentualGordura as number).toFixed(1)}%`
                      : '—'}
                  </div>
                  <div className="text-sm text-gray-400">% Gordura</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-gym-dark border border-gym-border">
                  <div className="text-3xl font-bold text-red-400">
                    {avaliacoes.massaMuscular
                      ? `${(avaliacoes.massaMuscular as number).toFixed(1)}kg`
                      : '—'}
                  </div>
                  <div className="text-sm text-gray-400">Massa Magra</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
