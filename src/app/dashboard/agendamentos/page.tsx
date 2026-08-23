import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Calendar, Clock, Plus, XCircle, AlertCircle } from 'lucide-react'
import { ConfirmButton } from './confirm-button'

export const dynamic = 'force-dynamic'

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'destructive' | 'warning' | 'info' | 'outline' }> = {
  AGENDADO: { label: 'Agendado', variant: 'info' },
  CONFIRMADO: { label: 'Confirmado', variant: 'success' },
  CANCELADO: { label: 'Cancelado', variant: 'destructive' },
  CONCLUIDO: { label: 'Concluído', variant: 'success' },
  FALTOU: { label: 'Faltou', variant: 'warning' },
}

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

async function getAgendamentos(userId: string) {
  const [proximos, anteriores] = await Promise.all([
    prisma.agendamento.findMany({
      where: {
        alunoId: userId,
        status: { in: ['AGENDADO', 'CONFIRMADO'] },
        dataHora: { gte: new Date() },
      },
      include: { aula: true, professor: { select: { nome: true } } },
      orderBy: { dataHora: 'asc' },
    }),
    prisma.agendamento.findMany({
      where: {
        alunoId: userId,
        status: { in: ['CONCLUIDO', 'CANCELADO', 'FALTOU'] },
      },
      include: { aula: true, professor: { select: { nome: true } } },
      orderBy: { dataHora: 'desc' },
      take: 10,
    }),
  ])

  return { proximos, anteriores }
}

export default async function AgendamentosPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect('/login')
  }

  const { proximos, anteriores } = await getAgendamentos(session.user.id)

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Agendamentos</h1>
            <p className="text-gray-400">Gerencie suas aulas agendadas</p>
          </div>
          <Link href="/dashboard/agendamentos/novo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          </Link>
        </div>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-red-400" />
              Próximos Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {proximos.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Nenhum agendamento futuro</p>
                <Link href="/dashboard/agendamentos/novo" className="text-red-400 hover:underline text-sm mt-2 inline-block">
                  Agendar aula →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {proximos.map((agendamento) => (
                  <div
                    key={agendamento.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gym-dark border border-gym-border hover:border-red-500/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-600/20">
                        <Calendar className="h-6 w-6 text-red-400" />
                      </div>
                      <div>
                        <p className="font-medium">{agendamento.aula?.nome || 'Aula Personalizada'}</p>
                        <p className="text-sm text-gray-400">
                          {formatDate(agendamento.dataHora)} às {agendamento.dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {agendamento.professor && (
                          <p className="text-xs text-gray-500">Prof. {agendamento.professor.nome}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusConfig[agendamento.status]?.variant || 'outline'}>
                        {statusConfig[agendamento.status]?.label || agendamento.status}
                      </Badge>
                      {agendamento.status === 'AGENDADO' && (
                        <ConfirmButton agendamentoId={agendamento.id} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {anteriores.length > 0 && (
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-400" />
                Histórico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {anteriores.map((agendamento) => (
                  <div
                    key={agendamento.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gym-dark border border-gym-border opacity-75"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800">
                        <Calendar className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-300">{agendamento.aula?.nome || 'Aula Personalizada'}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(agendamento.dataHora)} às {agendamento.dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <Badge variant={statusConfig[agendamento.status]?.variant || 'outline'}>
                      {statusConfig[agendamento.status]?.label || agendamento.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
