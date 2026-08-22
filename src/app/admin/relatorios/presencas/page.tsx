import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma';
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function RelatorioPresencasPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const totalCheckins = await prisma.checkin.count()

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const amanha = new Date(hoje)
  amanha.setDate(amanha.getDate() + 1)

  const checkinsHoje = await prisma.checkin.count({
    where: {
      dataHora: { gte: hoje, lt: amanha },
    },
  })

  const semanaAtras = new Date(hoje)
  semanaAtras.setDate(semanaAtras.getDate() - 7)

  const checkinsSemana = await prisma.checkin.count({
    where: {
      dataHora: { gte: semanaAtras },
    },
  })

  const porAluno = await prisma.checkin.groupBy({
    by: ['alunoId'],
    _count: { id: true },
    where: {
      dataHora: { gte: semanaAtras },
    },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  })

  const alunoIds = porAluno.map((c) => c.alunoId)
  const alunos = await prisma.usuario.findMany({
    where: { id: { in: alunoIds } },
    select: { id: true, nome: true, email: true },
  })
  const alunoMap = new Map(alunos.map((a) => [a.id, a]))

  const recentes = await prisma.checkin.findMany({
    take: 20,
    include: {
      aluno: { select: { id: true, nome: true, email: true } },
    },
    orderBy: { dataHora: 'desc' },
  })

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Relatorio de Presencas</h1>
        <p className="text-gray-400 text-sm mt-1">Acompanhe a frequencia dos alunos</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Total de Check-ins</p>
            <p className="text-2xl font-bold">{totalCheckins}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Hoje</p>
            <p className="text-2xl font-bold text-green-400">{checkinsHoje}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Ultimos 7 dias</p>
            <p className="text-2xl font-bold text-blue-400">{checkinsSemana}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Media diaria (7d)</p>
            <p className="text-2xl font-bold text-yellow-400">
              {Math.round(checkinsSemana / 7)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Alunos (ultimos 7 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            {porAluno.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Nenhum check-in registrado</p>
            ) : (
              <div className="space-y-3">
                {porAluno.map((item, idx) => {
                  const aluno = alunoMap.get(item.alunoId)
                  return (
                    <div key={item.alunoId} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-red-900/10">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-500 w-6">{idx + 1}</span>
                        <div>
                          <p className="font-medium">{aluno?.nome || 'Desconhecido'}</p>
                          <p className="text-sm text-gray-400">{aluno?.email}</p>
                        </div>
                      </div>
                      <Badge variant="default">{item._count.id} check-ins</Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Check-ins Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentes.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Nenhum check-in registrado</p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {recentes.map((checkin) => (
                  <div key={checkin.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-red-900/10">
                    <div>
                      <p className="font-medium">{checkin.aluno.nome}</p>
                      <p className="text-sm text-gray-400">{checkin.aluno.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={checkin.tipo === 'ENTRADA' ? 'success' : 'info'}>
                        {checkin.tipo}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{formatDateTime(checkin.dataHora)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
