import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Nao autorizado' }, { status: 401 })
    }

    const { cobrancaId } = await request.json()

    const cobranca = await prisma.cobranca.findUnique({
      where: { id: cobrancaId },
    })

    if (!cobranca) {
      return NextResponse.json({ message: 'Cobranca nao encontrada' }, { status: 404 })
    }

    if (cobranca.alunoId !== session.user.id) {
      return NextResponse.json({ message: 'Nao autorizado' }, { status: 403 })
    }

    const pixCode = `00020126360014BR.GOV.BCB.PIX0136v8academia-pix@email.com5204000053039865540${cobranca.valor.toFixed(2).replace('.', '')}5802BR5925V8 ACADEMIA LTDA6009SAO PAULO62070503***6304ABCD`

    return NextResponse.json({
      message: 'Pix gerado com sucesso',
      pixCode,
      valor: cobranca.valor,
    })
  } catch (error) {
    console.error('POST /api/pagamentos/gerar error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
