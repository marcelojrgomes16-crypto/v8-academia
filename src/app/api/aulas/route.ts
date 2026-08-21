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

    const aulas = await prisma.aula.findMany({
      where: { ativa: true },
      include: {
        professor: { select: { id: true, nome: true, email: true } },
        _count: { select: { agendamentos: true } },
      },
      orderBy: { nome: 'asc' },
    })

    return NextResponse.json(aulas)
  } catch (error) {
    console.error('GET /api/aulas error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
