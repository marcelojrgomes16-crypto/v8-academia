import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { WorkoutExecution } from './workout-execution'

export const dynamic = 'force-dynamic'

export default async function ExecutarTreinoPage({ params }: { params: Promise<{ id: string }> }) {
  let session
  try {
    session = await getSession()
  } catch {
    redirect('/entrar')
  }
  if (!session) redirect('/entrar')

  const { id } = await params

  let treino: any = null
  try {
    treino = await prisma.treino.findFirst({
      where: { id, alunoId: session.user.id },
      include: {
        exercicios: {
          include: { exercicio: true },
          orderBy: { ordem: 'asc' },
        },
      },
    })
  } catch (e) {
    console.error('Executar treino query error:', e)
  }

  if (!treino) redirect('/dashboard/treinos')

  return <WorkoutExecution treino={treino} />
}
