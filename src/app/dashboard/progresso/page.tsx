import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Calendar, Target, Zap } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProgressoPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const userId = session.user.id

  const [totalTreinos, totalCheckins, treinosConcluidos, avaliacaoRecente] = await Promise.all([
    prisma.treino.count({ where: { alunoId: userId } }),
    prisma.checkin.count({ where: { alunoId: userId } }),
    prisma.treino.count({ where: { alunoId: userId, status: 'CONCLUIDO' } }),
    prisma.avaliacaoFisica.findFirst({
      where: { alunoId: userId },
      orderBy: { data: 'desc' },
    }),
  ])

  const treinos = await prisma.treino.findMany({
    where: { alunoId: userId },
    include: { exercicios: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const checkins = await prisma.checkin.findMany({
    where: { alunoId: userId },
    orderBy: { dataHora: 'desc' },
    take: 10,
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Meu Progresso</h1>
          <p className="text-gray-400 text-sm mt-1">Acompanhe sua evolucao na academia</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-[#141414] border-red-900/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Treinos Totais</p>
                  <p className="text-3xl font-bold text-white mt-1">{totalTreinos}</p>
                </div>
                <Target className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#141414] border-red-900/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Treinos Concluidos</p>
                  <p className="text-3xl font-bold text-green-400 mt-1">{treinosConcluidos}</p>
                </div>
                <Zap className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#141414] border-red-900/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Check-ins</p>
                  <p className="text-3xl font-bold text-blue-400 mt-1">{totalCheckins}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#141414] border-red-900/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">IMC Atual</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {avaliacaoRecente ? (avaliacaoRecente.imc as number).toFixed(1) : '—'}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-[#141414] border-red-900/20">
            <CardHeader>
              <CardTitle className="text-base">Ultimos Treinos</CardTitle>
            </CardHeader>
            <CardContent>
              {treinos.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum treino registrado</p>
              ) : (
                <div className="space-y-3">
                  {treinos.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                      <div>
                        <p className="font-medium text-white">{t.nome}</p>
                        <p className="text-xs text-gray-500">{t.exercicios.length} exercicios</p>
                      </div>
                      <Badge variant={t.status === 'CONCLUIDO' ? 'success' : t.status === 'ATIVO' ? 'info' : 'warning'}>
                        {t.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-red-900/20">
            <CardHeader>
              <CardTitle className="text-base">Ultimos Check-ins</CardTitle>
            </CardHeader>
            <CardContent>
              {checkins.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum check-in registrado</p>
              ) : (
                <div className="space-y-3">
                  {checkins.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-400" />
                        <div>
                          <p className="font-medium text-white">{formatDate(c.dataHora)}</p>
                          <p className="text-xs text-gray-500">
                            {c.dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">{c.tipo}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
