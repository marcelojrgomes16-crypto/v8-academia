import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma';
const prisma = getPrisma()
import { getSession } from '@/lib/session'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const confirmarSchema = z.object({
  agendamentoId: z.string().min(1, 'ID do agendamento é obrigatório'),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { agendamentoId } = confirmarSchema.parse(body)

    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
    })

    if (!agendamento) {
      return NextResponse.json(
        { message: 'Agendamento não encontrado' },
        { status: 404 }
      )
    }

    if (agendamento.status !== 'AGENDADO') {
      return NextResponse.json(
        { message: 'Agendamento não pode ser confirmado' },
        { status: 400 }
      )
    }

    const updated = await prisma.agendamento.update({
      where: { id: agendamentoId },
      data: { status: 'CONFIRMADO' },
      include: {
        aluno: { select: { id: true, nome: true, email: true } },
        professor: { select: { id: true, nome: true, email: true } },
        aula: { select: { id: true, nome: true } },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error('POST /api/agendamentos/confirmar error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
