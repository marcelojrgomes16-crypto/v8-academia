import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { TreinosList } from './treinos-list'

export const dynamic = 'force-dynamic'

export default async function TreinosPage() {
  const session = await getSession()
  if (!session) redirect('/entrar')

  const usuario = await prisma.usuario.findUnique({
    where: { id: session.user.id },
    select: { genero: true },
  })

  const treinos = await prisma.treino.findMany({
    where: { alunoId: session.user.id },
    include: {
      exercicios: {
        include: { exercicio: true },
        orderBy: { ordem: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return <TreinosList treinos={treinos} perfil={usuario?.genero || 'MASCULINO'} />
}
