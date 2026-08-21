import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

const diasSemanaMap: Record<number, string> = {
  0: 'Dom',
  1: 'Seg',
  2: 'Ter',
  3: 'Qua',
  4: 'Qui',
  5: 'Sex',
  6: 'Sáb',
}

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'info'> = {
  ATIVO: 'success',
  PAUSADO: 'warning',
  CONCLUIDO: 'info',
  CANCELADO: 'destructive',
}

const statusLabel: Record<string, string> = {
  ATIVO: 'Ativo',
  PAUSADO: 'Pausado',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
}

async function updateTreinoStatus(formData: FormData) {
  'use server'

  const session = await getSession()
  if (!session) redirect('/login')

  const treinoId = formData.get('treinoId') as string
  const newStatus = formData.get('newStatus') as string

  if (!treinoId || !newStatus) return

  const treino = await prisma.treino.findUnique({ where: { id: treinoId } })
  if (!treino || treino.alunoId !== session.user.id) return

  await prisma.treino.update({
    where: { id: treinoId },
    data: { status: newStatus as any },
  })

  revalidatePath(`/dashboard/treinos/${treinoId}`)
  revalidatePath('/dashboard/treinos')
}

export default async function TreinoDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  const treino = await prisma.treino.findUnique({
    where: { id: params.id },
    include: {
      professor: {
        select: { nome: true, email: true },
      },
      exercicios: {
        include: {
          exercicio: {
            select: { nome: true, grupoMuscular: true, equipamento: true },
          },
        },
        orderBy: { ordem: 'asc' },
      },
    },
  })

  if (!treino || treino.alunoId !== session.user.id) {
    redirect('/dashboard/treinos')
  }

  const diasSemana = (treino.diasSemana as number[]) ?? []

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link
          href="/dashboard/treinos"
          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 mb-4"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{treino.nome}</h1>
              <Badge variant={statusVariant[treino.status]}>
                {statusLabel[treino.status]}
              </Badge>
            </div>
            {treino.descricao && (
              <p className="text-gray-400 text-sm mt-2">{treino.descricao}</p>
            )}
          </div>
          <div className="flex gap-2">
            {treino.status === 'ATIVO' && (
              <form action={updateTreinoStatus}>
                <input type="hidden" name="treinoId" value={treino.id} />
                <input type="hidden" name="newStatus" value="PAUSADO" />
                <Button type="submit" variant="outline" size="sm">
                  Pausar
                </Button>
              </form>
            )}
            {treino.status === 'PAUSADO' && (
              <form action={updateTreinoStatus}>
                <input type="hidden" name="treinoId" value={treino.id} />
                <input type="hidden" name="newStatus" value="ATIVO" />
                <Button type="submit" size="sm">
                  Retomar
                </Button>
              </form>
            )}
            {(treino.status === 'ATIVO' || treino.status === 'PAUSADO') && (
              <form action={updateTreinoStatus}>
                <input type="hidden" name="treinoId" value={treino.id} />
                <input type="hidden" name="newStatus" value="CONCLUIDO" />
                <Button type="submit" variant="success" size="sm">
                  Concluir
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exercícios</CardTitle>
            </CardHeader>
            <CardContent>
              {treino.exercicios.length === 0 ? (
                <p className="text-gray-400 text-sm">Nenhum exercício cadastrado</p>
              ) : (
                <div className="space-y-3">
                  {treino.exercicios.map((et) => (
                    <div
                      key={et.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-gym-dark/50 border border-gym-border"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white text-sm font-semibold shrink-0">
                        {et.ordem}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{et.exercicio.nome}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {et.exercicio.grupoMuscular}
                          {et.exercicio.equipamento && ` · ${et.exercicio.equipamento}`}
                        </p>
                      </div>
                      <div className="text-right text-sm shrink-0">
                        <p className="text-white font-medium">
                          {et.series}x{et.repeticoes}
                        </p>
                        {et.carga && (
                          <p className="text-xs text-gray-400">{et.carga}</p>
                        )}
                        {et.descanso && (
                          <p className="text-xs text-gray-500">Desc: {et.descanso}s</p>
                        )}
                      </div>
                      {et.observacoes && (
                        <p className="text-xs text-gray-500 italic truncate max-w-[120px]">
                          {et.observacoes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Professor</p>
                <p className="text-sm font-medium">{treino.professor.nome}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Data de Início</p>
                <p className="text-sm font-medium">{formatDate(treino.dataInicio)}</p>
              </div>
              {treino.dataFim && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Data de Término</p>
                  <p className="text-sm font-medium">{formatDate(treino.dataFim)}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400 mb-2">Dias da Semana</p>
                <div className="flex flex-wrap gap-1.5">
                  {diasSemana.map((dia) => (
                    <span
                      key={dia}
                      className="px-2 py-0.5 rounded bg-primary-600/20 text-primary-300 text-xs"
                    >
                      {diasSemanaMap[dia] ?? dia}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Criado em</p>
                <p className="text-sm font-medium">{formatDate(treino.createdAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
