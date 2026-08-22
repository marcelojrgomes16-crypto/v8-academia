import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Nao autorizado' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    const serie = await prisma.serie.findUnique({
      where: { id },
      include: {
        exercicio: {
          select: { id: true, nome: true, grupoMuscular: true, equipamento: true },
        },
      },
    })

    if (!serie) {
      return NextResponse.json({ message: 'Serie nao encontrada' }, { status: 404 })
    }

    return NextResponse.json(serie)
  } catch (error) {
    console.error('GET /api/admin/series/[id] error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Nao autorizado' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()

    const existing = await prisma.serie.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ message: 'Serie nao encontrada' }, { status: 404 })
    }

    const serie = await prisma.serie.update({
      where: { id },
      data: {
        ...(body.nome !== undefined && { nome: body.nome }),
        ...(body.descricao !== undefined && { descricao: body.descricao || null }),
        ...(body.exercicioId !== undefined && { exercicioId: body.exercicioId }),
        ...(body.series !== undefined && { series: Number(body.series) }),
        ...(body.repeticoes !== undefined && { repeticoes: body.repeticoes }),
        ...(body.carga !== undefined && { carga: body.carga || null }),
        ...(body.descanso !== undefined && { descanso: body.descanso ? Number(body.descanso) : null }),
        ...(body.ordem !== undefined && { ordem: Number(body.ordem) }),
        ...(body.observacoes !== undefined && { observacoes: body.observacoes || null }),
      },
      include: {
        exercicio: {
          select: { id: true, nome: true, grupoMuscular: true },
        },
      },
    })

    return NextResponse.json(serie)
  } catch (error) {
    console.error('PUT /api/admin/series/[id] error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Nao autorizado' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    const existing = await prisma.serie.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ message: 'Serie nao encontrada' }, { status: 404 })
    }

    await prisma.serie.delete({ where: { id } })
    return NextResponse.json({ message: 'Serie removida com sucesso' })
  } catch (error) {
    console.error('DELETE /api/admin/series/[id] error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
