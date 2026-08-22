import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, Clock, Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AgendamentosListaPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const agendamentos = await prisma.agendamento.findMany({
    where: { alunoId: session.user.id },
    include: { aula: true, professor: { select: { nome: true } } },
    orderBy: { dataHora: 'desc' },
  })

  const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'info'> = {
    AGENDADO: 'info',
    CONFIRMADO: 'success',
    CANCELADO: 'destructive',
    CONCLUIDO: 'success',
    FALTOU: 'destructive',
  }

  const statusLabel: Record<string, string> = {
    AGENDADO: 'Agendado',
    CONFIRMADO: 'Confirmado',
    CANCELADO: 'Cancelado',
    CONCLUIDO: 'Concluido',
    FALTOU: 'Faltou',
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Meus Agendamentos</h1>
            <p className="text-gray-400 text-sm mt-1">Historico de agendamentos</p>
          </div>
          <Link href="/dashboard/agendamentos">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </Link>
        </div>

        {agendamentos.length === 0 ? (
          <Card className="bg-[#141414] border-red-900/20">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Calendar className="h-16 w-16 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">Nenhum agendamento</h3>
              <p className="text-gray-500 text-center max-w-md mb-4">
                Agende sua primeira aula para comecar.
              </p>
              <Link href="/dashboard/agendamentos">
                <Button>Agendar Aula</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {agendamentos.map((ag) => (
              <Card key={ag.id} className="bg-[#141414] border-red-900/20 hover:border-red-900/40 transition-colors">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-red-600/10 flex items-center justify-center shrink-0">
                        <Calendar className="h-6 w-6 text-red-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          {ag.aula?.nome || 'Aula Personalizada'}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(ag.dataHora)} as{' '}
                            {ag.dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {ag.professor && (
                            <span>Prof: {ag.professor.nome}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge variant={statusVariant[ag.status]}>
                      {statusLabel[ag.status]}
                    </Badge>
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
