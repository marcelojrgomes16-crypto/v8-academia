import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ExerciseCard } from './exercise-card'

export const dynamic = 'force-dynamic'

export default async function TreinoDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const treino = await prisma.treino.findFirst({
    where: { id: params.id, alunoId: session.user.id },
    include: {
      exercicios: {
        include: { exercicio: true },
        orderBy: { ordem: 'asc' },
      },
      professor: {
        select: { nome: true },
      },
    },
  })

  if (!treino) redirect('/dashboard/treinos')

  const totalSeries = treino.exercicios.reduce((acc, e) => acc + e.series, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/dashboard/treinos">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
              Voltar
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{treino.nome}</h1>
            <p className="text-gray-400 text-xs sm:text-sm">
              {treino.exercicios.length} exercicios &bull; {totalSeries} series
              {treino.professor?.nome && ` \u2022 Prof. ${treino.professor.nome}`}
            </p>
          </div>
        </div>

        {treino.descricao && (
          <p className="text-gray-400 text-sm">{treino.descricao}</p>
        )}

        <div className="space-y-4">
          {treino.exercicios.map((ex, idx) => (
            <ExerciseCard key={ex.id} ex={ex} idx={idx} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
