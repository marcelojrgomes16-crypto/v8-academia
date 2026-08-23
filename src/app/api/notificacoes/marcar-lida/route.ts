import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Nao autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const action = body.action || 'mark'

    if (action === 'count') {
      const count = await prisma.notificacao.count({
        where: { usuarioId: session.user.id, lida: false },
      })
      return NextResponse.json({ count })
    }

    if (action === 'list') {
      const limit = typeof body.limit === 'number' ? body.limit : 10
      const notificacoes = await prisma.notificacao.findMany({
        where: { usuarioId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          titulo: true,
          mensagem: true,
          tipo: true,
          lida: true,
          createdAt: true,
        },
      })
      return NextResponse.json({ notificacoes })
    }

    const ids = Array.isArray(body.ids) ? body.ids : []

    const where = ids.length > 0
      ? { id: { in: ids }, usuarioId: session.user.id }
      : { usuarioId: session.user.id, lida: false }

    const result = await prisma.notificacao.updateMany({
      where,
      data: { lida: true },
    })

    return NextResponse.json({
      message: `${result.count} notificacao(oes) marcada(s) como lida(s)`,
      count: result.count,
    })
  } catch (error) {
    console.error('POST /api/notificacoes/marcar-lida error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
