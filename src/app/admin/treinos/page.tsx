import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dumbbell } from 'lucide-react'

export const dynamic = 'force-dynamic'

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'info'> = {
  ATIVO: 'success',
  PAUSADO: 'warning',
  CONCLUIDO: 'info',
  CANCELADO: 'destructive',
}

const statusLabel: Record<string, string> = {
  ATIVO: 'Ativo',
  PAUSADO: 'Pausado',
  CONCLUIDO: 'Concluido',
  CANCELADO: 'Cancelado',
}

interface TreinosAdminPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function TreinosAdminPage({ searchParams }: TreinosAdminPageProps) {

  const status = typeof searchParams.status === 'string' ? searchParams.status : ''

  const where: any = {}
  if (status) {
    where.status = status
  }

  const treinos = await prisma.treino.findMany({
    where,
    include: {
      aluno: {
        select: { nome: true },
      },
      professor: {
        select: { nome: true },
      },
      exercicios: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Treinos</h1>
          <p className="text-gray-400 text-sm mt-1">
            Todos os treinos cadastrados na academia
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <Button variant={!status ? 'default' : 'outline'} size="sm" asChild>
          <a href="/admin/treinos">Todos</a>
        </Button>
        <Button variant={status === 'ATIVO' ? 'default' : 'outline'} size="sm" asChild>
          <a href="/admin/treinos?status=ATIVO">Ativos</a>
        </Button>
        <Button variant={status === 'PAUSADO' ? 'default' : 'outline'} size="sm" asChild>
          <a href="/admin/treinos?status=PAUSADO">Pausados</a>
        </Button>
        <Button variant={status === 'CONCLUIDO' ? 'default' : 'outline'} size="sm" asChild>
          <a href="/admin/treinos?status=CONCLUIDO">Concluidos</a>
        </Button>
        <Button variant={status === 'CANCELADO' ? 'default' : 'outline'} size="sm" asChild>
          <a href="/admin/treinos?status=CANCELADO">Cancelados</a>
        </Button>
      </div>

      {treinos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Dumbbell className="h-12 w-12 text-gray-500 mb-4" />
            <p className="text-gray-400 text-center">Nenhum treino encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {treinos.map((treino) => (
            <Card key={treino.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium">{treino.nome}</h3>
                      <Badge variant={statusVariant[treino.status]}>
                        {statusLabel[treino.status]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                      <span>Aluno: {treino.aluno.nome}</span>
                      <span>Prof: {treino.professor.nome}</span>
                      <span>{treino.exercicios.length} exercicios</span>
                      <span>Inicio: {formatDate(treino.dataInicio)}</span>
                      {treino.dataFim && <span>Fim: {formatDate(treino.dataFim)}</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
