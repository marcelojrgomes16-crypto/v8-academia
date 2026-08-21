import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
    }

    const professores = await prisma.professor.findMany({
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
        _count: { select: { alunos: true } },
      },
      orderBy: { usuario: { createdAt: 'desc' } },
    })

    return NextResponse.json(professores)
  } catch (error) {
    console.error('GET /api/professores error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
