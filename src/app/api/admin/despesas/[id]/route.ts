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

    const { id } = await params
    const despesa = await prisma.despesa.findUnique({ where: { id } })

    if (!despesa) {
      return NextResponse.json({ message: 'Despesa não encontrada' }, { status: 404 })
    }

    return NextResponse.json(despesa)
  } catch (error) {
    console.error('GET /api/admin/despesas/[id] error:', error)
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

    const existing = await prisma.despesa.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ message: 'Despesa não encontrada' }, { status: 404 })
    }

    const despesa = await prisma.despesa.update({
      where: { id },
      data: {
        ...(body.descricao !== undefined && { descricao: body.descricao }),
        ...(body.valor !== undefined && { valor: Number(body.valor) }),
        ...(body.categoria !== undefined && { categoria: body.categoria }),
        ...(body.data !== undefined && { data: new Date(body.data) }),
        ...(body.fornecedor !== undefined && { fornecedor: body.fornecedor || null }),
        ...(body.observacoes !== undefined && { observacoes: body.observacoes || null }),
      },
    })

    return NextResponse.json(despesa)
  } catch (error) {
    console.error('PUT /api/admin/despesas/[id] error:', error)
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
    const existing = await prisma.despesa.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ message: 'Despesa não encontrada' }, { status: 404 })
    }

    await prisma.despesa.delete({ where: { id } })
    return NextResponse.json({ message: 'Despesa removida com sucesso' })
  } catch (error) {
    console.error('DELETE /api/admin/despesas/[id] error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
