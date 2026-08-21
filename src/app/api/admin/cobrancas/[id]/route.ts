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

    const { id } = await params
    const cobranca = await prisma.cobranca.findUnique({
      where: { id },
      include: {
        aluno: {
          select: { id: true, nome: true, email: true, telefone: true },
        },
      },
    })

    if (!cobranca) {
      return NextResponse.json({ message: 'Cobranca nao encontrada' }, { status: 404 })
    }

    return NextResponse.json(cobranca)
  } catch (error) {
    console.error('GET /api/admin/cobrancas/[id] error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Nao autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const existing = await prisma.cobranca.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ message: 'Cobranca nao encontrada' }, { status: 404 })
    }

    const cobranca = await prisma.cobranca.update({
      where: { id },
      data: {
        ...(body.valor !== undefined && { valor: Number(body.valor) }),
        ...(body.descricao !== undefined && { descricao: body.descricao }),
        ...(body.dataVencimento !== undefined && { dataVencimento: new Date(body.dataVencimento) }),
        ...(body.dataPagamento !== undefined && { dataPagamento: body.dataPagamento ? new Date(body.dataPagamento) : null }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.observacoes !== undefined && { observacoes: body.observacoes || null }),
      },
      include: {
        aluno: {
          select: { id: true, nome: true, email: true },
        },
      },
    })

    return NextResponse.json(cobranca)
  } catch (error) {
    console.error('PUT /api/admin/cobrancas/[id] error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Nao autorizado' }, { status: 401 })
    }

    const { id } = await params
    const existing = await prisma.cobranca.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ message: 'Cobranca nao encontrada' }, { status: 404 })
    }

    await prisma.cobranca.delete({ where: { id } })
    return NextResponse.json({ message: 'Cobranca removida com sucesso' })
  } catch (error) {
    console.error('DELETE /api/admin/cobrancas/[id] error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
