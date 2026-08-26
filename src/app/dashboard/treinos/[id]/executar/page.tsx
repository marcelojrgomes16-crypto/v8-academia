import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { WorkoutExecution } from './workout-execution'

export const dynamic = 'force-dynamic'

export default async function ExecutarTreinoPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect('/entrar')

  const { id } = await params
  const treino = await prisma.treino.findFirst({
    where: { id, alunoId: session.user.id },
    include: {
      exercicios: {
        include: { exercicio: true },
        orderBy: { ordem: 'asc' },
      },
    },
  })

  if (!treino) redirect('/dashboard/treinos')

  return <WorkoutExecution treino={treino} />
}
