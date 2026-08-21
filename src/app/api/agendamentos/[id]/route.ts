import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const updateAgendamentoSchema = z.object({
  alunoId: z.string().optional(),
  professorId: z.string().optional(),
  aulaId: z.string().optional(),
  dataHora: z.string().datetime().optional(),
  status: z.enum(['AGENDADO', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO', 'FALTOU']).optional(),
  observacoes: z.string().optional(),
})

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    const agendamento = await prisma.agendamento.findUnique({
      where: { id },
      include: {
        aluno: { select: { id: true, nome: true, email: true, telefone: true } },
        professor: { select: { id: true, nome: true, email: true } },
        aula: { select: { id: true, nome: true, descricao: true, horaInicio: true, horaFim: true } },
      },
    })

    if (!agendamento) {
      return NextResponse.json(
        { message: 'Agendamento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(agendamento)
  } catch (error) {
    console.error('GET /api/agendamentos/[id] error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const data = updateAgendamentoSchema.parse(body)

    const existing = await prisma.agendamento.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { message: 'Agendamento não encontrado' },
        { status: 404 }
      )
    }

    const agendamento = await prisma.agendamento.update({
      where: { id },
      data: {
        ...(data.alunoId && { alunoId: data.alunoId }),
        ...(data.professorId !== undefined && { professorId: data.professorId ?? null }),
        ...(data.aulaId !== undefined && { aulaId: data.aulaId ?? null }),
        ...(data.dataHora && { dataHora: new Date(data.dataHora) }),
        ...(data.status && { status: data.status }),
        ...(data.observacoes !== undefined && { observacoes: data.observacoes ?? null }),
      },
      include: {
        aluno: { select: { id: true, nome: true, email: true } },
        professor: { select: { id: true, nome: true, email: true } },
        aula: { select: { id: true, nome: true } },
      },
    })

    return NextResponse.json(agendamento)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error('PUT /api/agendamentos/[id] error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.agendamento.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { message: 'Agendamento não encontrado' },
        { status: 404 }
      )
    }

    await prisma.agendamento.delete({ where: { id } })

    return NextResponse.json({ message: 'Agendamento removido com sucesso' })
  } catch (error) {
    console.error('DELETE /api/agendamentos/[id] error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
