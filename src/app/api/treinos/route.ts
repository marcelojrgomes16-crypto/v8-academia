import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    const where = session.user.role === 'ADMIN'
      ? {}
      : session.user.role === 'PROFESSOR'
        ? { professorId: session.user.id }
        : { alunoId: session.user.id }

    const treinos = await prisma.treino.findMany({
      where,
      include: {
        aluno: { select: { id: true, nome: true, email: true } },
        professor: { select: { id: true, nome: true, email: true } },
        exercicios: {
          include: {
            exercicio: { select: { id: true, nome: true, grupoMuscular: true } },
          },
          orderBy: { ordem: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(treinos)
  } catch (error) {
    console.error('GET /api/treinos error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
