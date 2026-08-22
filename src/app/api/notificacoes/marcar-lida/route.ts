import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const marcarLidaSchema = z.object({
  ids: z.array(z.string()).min(1, 'Pelo menos uma notificação deve ser informada'),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { ids } = marcarLidaSchema.parse(body)

    const result = await prisma.notificacao.updateMany({
      where: {
        id: { in: ids },
        usuarioId: session.user.id,
      },
      data: { lida: true },
    })

    return NextResponse.json({
      message: `${result.count} notificação(ões) marcada(s) como lida(s)`,
      count: result.count,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error('POST /api/notificacoes/marcar-lida error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
