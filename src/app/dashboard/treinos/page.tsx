import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { TreinosList } from './treinos-list'

export const dynamic = 'force-dynamic'

export default async function TreinosPage() {
  let session
  try {
    session = await getSession()
  } catch {
    redirect('/entrar')
  }
  if (!session) redirect('/entrar')

  let usuario: any = null
  let treinos: any[] = []

  try {
    usuario = await prisma.usuario.findUnique({
      where: { id: session.user.id },
      select: { genero: true },
    })

    treinos = await prisma.treino.findMany({
      where: { alunoId: session.user.id },
      include: {
        exercicios: {
          include: { exercicio: true },
          orderBy: { ordem: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  } catch (e) {
    console.error('Treinos query error:', e)
  }

  return <TreinosList treinos={treinos} perfil={usuario?.genero || 'MASCULINO'} />
}
