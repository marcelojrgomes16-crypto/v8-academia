import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCurrency } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function RelatorioAlunosPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const totalAlunos = await prisma.aluno.count()
  const alunosAtivos = await prisma.aluno.count({
    where: { usuario: { status: 'ATIVO' } },
  })
  const alunosInativos = await prisma.aluno.count({
    where: { usuario: { status: 'INATIVO' } },
  })

  const porPlano = await prisma.plano.findMany({
    include: { _count: { select: { alunos: true } } },
    orderBy: { nome: 'asc' },
  })

  const recentes = await prisma.aluno.findMany({
    take: 10,
    include: {
      usuario: { select: { nome: true, email: true, status: true, createdAt: true } },
      plano: { select: { nome: true, preco: true } },
    },
    orderBy: { dataMatricula: 'desc' },
  })

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Relatorio de Alunos</h1>
        <p className="text-gray-400 text-sm mt-1">Analise completa dos alunos da academia</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Total de Alunos</p>
            <p className="text-2xl font-bold">{totalAlunos}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Ativos</p>
            <p className="text-2xl font-bold text-green-400">{alunosAtivos}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Inativos</p>
            <p className="text-2xl font-bold text-yellow-400">{alunosInativos}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Taxa de Ativos</p>
            <p className="text-2xl font-bold text-blue-400">
              {totalAlunos > 0 ? Math.round((alunosAtivos / totalAlunos) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Alunos por Plano</CardTitle>
          </CardHeader>
          <CardContent>
            {porPlano.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Nenhum plano encontrado</p>
            ) : (
              <div className="space-y-3">
                {porPlano.map((plano) => (
                  <div key={plano.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-red-900/10">
                    <div>
                      <p className="font-medium">{plano.nome}</p>
                      <p className="text-sm text-gray-400">{formatCurrency(plano.preco)}/mes</p>
                    </div>
                    <Badge variant="secondary">{plano._count.alunos} alunos</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Matriculas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentes.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Nenhuma matricula encontrada</p>
            ) : (
              <div className="space-y-3">
                {recentes.map((aluno) => (
                  <div key={aluno.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-red-900/10">
                    <div>
                      <p className="font-medium">{aluno.usuario.nome}</p>
                      <p className="text-sm text-gray-400">{aluno.usuario.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={aluno.usuario.status === 'ATIVO' ? 'success' : 'warning'}>
                        {aluno.usuario.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(aluno.dataMatricula)}</p>
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
