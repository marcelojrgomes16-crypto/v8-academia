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
    const configuracao = await prisma.configuracao.findUnique({ where: { id } })

    if (!configuracao) {
      return NextResponse.json({ message: 'Configuracao nao encontrada' }, { status: 404 })
    }

    return NextResponse.json(configuracao)
  } catch (error) {
    console.error('GET /api/admin/configuracoes/[id] error:', error)
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

    const existing = await prisma.configuracao.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ message: 'Configuracao nao encontrada' }, { status: 404 })
    }

    const configuracao = await prisma.configuracao.update({
      where: { id },
      data: {
        ...(body.chave !== undefined && { chave: body.chave }),
        ...(body.valor !== undefined && { valor: body.valor }),
        ...(body.tipo !== undefined && { tipo: body.tipo }),
      },
    })

    return NextResponse.json(configuracao)
  } catch (error) {
    console.error('PUT /api/admin/configuracoes/[id] error:', error)
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
    const existing = await prisma.configuracao.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ message: 'Configuracao nao encontrada' }, { status: 404 })
    }

    await prisma.configuracao.delete({ where: { id } })
    return NextResponse.json({ message: 'Configuracao removida com sucesso' })
  } catch (error) {
    console.error('DELETE /api/admin/configuracoes/[id] error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
