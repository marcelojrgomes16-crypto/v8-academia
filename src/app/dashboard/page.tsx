import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Dumbbell, Calendar, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/entrar')

  const userId = session.user.id
  const hoje = new Date()

  const [treinos, agendamentos] = await Promise.all([
    prisma.treino.findMany({
      where: { alunoId: userId, status: 'ATIVO' },
      include: { exercicios: { include: { exercicio: true } } },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.agendamento.findMany({
      where: {
        alunoId: userId,
        status: { in: ['AGENDADO', 'CONFIRMADO'] },
        dataHora: { gte: hoje },
      },
      include: { aula: true },
      orderBy: { dataHora: 'asc' },
      take: 3,
    }),
  ])

  const treinosHoje = treinos.filter((t) => {
    const dias = (t.diasSemana || []) as number[]
    const hojeDia = hoje.getDay()
    return dias.includes(hojeDia === 0 ? 7 : hojeDia)
  })

  return (
    <DashboardLayout>
      <div className="space-y-5 sm:space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Ola, {session.user.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-400 mt-1">
            {hoje.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        <Card className="bg-gradient-to-br from-red-900/30 to-[#141414] border-red-900/30">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
                <Dumbbell className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white">
                  {treinosHoje.length > 0
                    ? `${treinosHoje.length} treino${treinosHoje.length > 1 ? 's' : ''} para hoje`
                    : 'Nenhum treino para hoje'}
                </h2>
                <p className="text-sm text-gray-400">
                  {treinosHoje.length > 0
                    ? 'Toque para iniciar seu treino'
                    : 'Aproveite para descansar ou agende uma aula'}
                </p>
              </div>
              {treinosHoje.length > 0 && (
                <Link href={`/dashboard/treinos/${treinosHoje[0].id}`}>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    Iniciar <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Dumbbell className="h-4 w-4 text-red-400" />
                Meus Treinos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {treinos.length === 0 ? (
                <p className="text-gray-500 text-sm py-4 text-center">Nenhum treino ativo</p>
              ) : (
                <>
                  {treinos.slice(0, 4).map((treino) => (
                    <Link
                      key={treino.id}
                      href={`/dashboard/treinos/${treino.id}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-gym-dark border border-gym-border hover:border-red-500/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {treino.exercicios[0]?.exercicio.imagemUrl ? (
                          <img
                            src={treino.exercicios[0].exercicio.imagemUrl}
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-red-600/20 flex items-center justify-center">
                            <Dumbbell className="h-5 w-5 text-red-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">{treino.nome}</p>
                          <p className="text-xs text-gray-500">{treino.exercicios.length} exercicios</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-600" />
                    </Link>
                  ))}
                  {treinos.length > 4 && (
                    <Link href="/dashboard/treinos" className="block text-center text-sm text-red-400 hover:text-red-300 pt-2">
                      Ver todos ({treinos.length})
                    </Link>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4 text-red-400" />
                Proximas Aulas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {agendamentos.length === 0 ? (
                <p className="text-gray-500 text-sm py-4 text-center">Nenhuma aula agendada</p>
              ) : (
                agendamentos.map((ag) => (
                  <div
                    key={ag.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gym-dark border border-gym-border"
                  >
                    <div>
                      <p className="font-medium text-sm">{ag.aula?.nome || 'Aula'}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(ag.dataHora)} as{' '}
                        {ag.dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <Badge variant={ag.status === 'CONFIRMADO' ? 'success' : 'outline'} className="text-xs">
                      {ag.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
