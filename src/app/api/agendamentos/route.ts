import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const createAgendamentoSchema = z.object({
  aulaId: z.string().optional(),
  dataHora: z.string().min(1, 'Data e hora são obrigatórios'),
  observacoes: z.string().optional(),
})

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

    const agendamentos = await prisma.agendamento.findMany({
      where,
      include: {
        aluno: { select: { id: true, nome: true, email: true } },
        professor: { select: { id: true, nome: true, email: true } },
        aula: { select: { id: true, nome: true, horaInicio: true, horaFim: true } },
      },
      orderBy: { dataHora: 'asc' },
    })

    return NextResponse.json(agendamentos)
  } catch (error) {
    console.error('GET /api/agendamentos error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const data = createAgendamentoSchema.parse(body)

    const agendamento = await prisma.agendamento.create({
      data: {
        alunoId: session.user.id,
        aulaId: data.aulaId ?? null,
        dataHora: new Date(data.dataHora),
        observacoes: data.observacoes ?? null,
      },
      include: {
        aluno: { select: { id: true, nome: true, email: true } },
        professor: { select: { id: true, nome: true, email: true } },
        aula: { select: { id: true, nome: true } },
      },
    })

    return NextResponse.json(agendamento, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error('POST /api/agendamentos error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
