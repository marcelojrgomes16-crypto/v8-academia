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
    const exercicio = await prisma.exercicio.findUnique({
      where: { id },
      include: { series: true, _count: { select: { treinos: true } } },
    })

    if (!exercicio) {
      return NextResponse.json({ message: 'Exercicio nao encontrado' }, { status: 404 })
    }

    return NextResponse.json(exercicio)
  } catch (error) {
    console.error('GET /api/admin/exercicios/[id] error:', error)
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

    const existing = await prisma.exercicio.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ message: 'Exercicio nao encontrado' }, { status: 404 })
    }

    const exercicio = await prisma.exercicio.update({
      where: { id },
      data: {
        ...(body.nome !== undefined && { nome: body.nome }),
        ...(body.descricao !== undefined && { descricao: body.descricao || null }),
        ...(body.grupoMuscular !== undefined && { grupoMuscular: body.grupoMuscular }),
        ...(body.equipamento !== undefined && { equipamento: body.equipamento || null }),
        ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl || null }),
        ...(body.imagemUrl !== undefined && { imagemUrl: body.imagemUrl || null }),
      },
    })

    return NextResponse.json(exercicio)
  } catch (error) {
    console.error('PUT /api/admin/exercicios/[id] error:', error)
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
    const existing = await prisma.exercicio.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ message: 'Exercicio nao encontrado' }, { status: 404 })
    }

    await prisma.exercicio.delete({ where: { id } })
    return NextResponse.json({ message: 'Exercicio removido com sucesso' })
  } catch (error) {
    console.error('DELETE /api/admin/exercicios/[id] error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
