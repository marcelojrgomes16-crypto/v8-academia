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
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    const plano = await prisma.plano.findUnique({
      where: { id },
      include: { _count: { select: { alunos: true, pagamentos: true } } },
    })

    if (!plano) {
      return NextResponse.json({ message: 'Plano não encontrado' }, { status: 404 })
    }

    return NextResponse.json(plano)
  } catch (error) {
    console.error('GET /api/admin/planos/[id] error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()

    const existing = await prisma.plano.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ message: 'Plano não encontrado' }, { status: 404 })
    }

    const plano = await prisma.plano.update({
      where: { id },
      data: {
        ...(body.nome !== undefined && { nome: body.nome }),
        ...(body.descricao !== undefined && { descricao: body.descricao || null }),
        ...(body.preco !== undefined && { preco: Number(body.preco) }),
        ...(body.duracaoDias !== undefined && { duracaoDias: Number(body.duracaoDias) }),
        ...(body.features !== undefined && { features: body.features }),
        ...(body.ativo !== undefined && { ativo: body.ativo }),
      },
    })

    return NextResponse.json(plano)
  } catch (error) {
    console.error('PUT /api/admin/planos/[id] error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    const existing = await prisma.plano.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ message: 'Plano não encontrado' }, { status: 404 })
    }

    await prisma.plano.delete({ where: { id } })
    return NextResponse.json({ message: 'Plano removido com sucesso' })
  } catch (error) {
    console.error('DELETE /api/admin/planos/[id] error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
