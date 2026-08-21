import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
    }

    const alunos = await prisma.aluno.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            status: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
        plano: { select: { id: true, nome: true, preco: true } },
        professor: {
          select: {
            id: true,
            usuario: { select: { id: true, nome: true, email: true } },
          },
        },
      },
      orderBy: { dataMatricula: 'desc' },
    })

    return NextResponse.json(alunos)
  } catch (error) {
    console.error('GET /api/alunos error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
