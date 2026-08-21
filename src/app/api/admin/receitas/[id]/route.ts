import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

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
    const receita = await prisma.receita.findUnique({ where: { id } })

    if (!receita) {
      return NextResponse.json({ message: 'Receita não encontrada' }, { status: 404 })
    }

    return NextResponse.json(receita)
  } catch (error) {
    console.error('GET /api/admin/receitas/[id] error:', error)
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

    const existing = await prisma.receita.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ message: 'Receita não encontrada' }, { status: 404 })
    }

    const receita = await prisma.receita.update({
      where: { id },
      data: {
        ...(body.descricao !== undefined && { descricao: body.descricao }),
        ...(body.valor !== undefined && { valor: Number(body.valor) }),
        ...(body.categoria !== undefined && { categoria: body.categoria }),
        ...(body.data !== undefined && { data: new Date(body.data) }),
        ...(body.pagamentoId !== undefined && { pagamentoId: body.pagamentoId || null }),
        ...(body.observacoes !== undefined && { observacoes: body.observacoes || null }),
      },
    })

    return NextResponse.json(receita)
  } catch (error) {
    console.error('PUT /api/admin/receitas/[id] error:', error)
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
    const existing = await prisma.receita.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ message: 'Receita não encontrada' }, { status: 404 })
    }

    await prisma.receita.delete({ where: { id } })
    return NextResponse.json({ message: 'Receita removida com sucesso' })
  } catch (error) {
    console.error('DELETE /api/admin/receitas/[id] error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
