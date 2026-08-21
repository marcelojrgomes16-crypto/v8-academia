import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Nao autorizado' }, { status: 401 })
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
    }

    const configuracoes = await prisma.configuracao.findMany({
      orderBy: { chave: 'asc' },
    })

    return NextResponse.json(configuracoes)
  } catch (error) {
    console.error('GET /api/admin/configuracoes error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Nao autorizado' }, { status: 401 })
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
    }

    const body = await request.json()
    const { chave, valor, tipo } = body

    if (!chave || !valor) {
      return NextResponse.json({ message: 'Chave e valor sao obrigatorios' }, { status: 400 })
    }

    const existing = await prisma.configuracao.findUnique({ where: { chave } })
    if (existing) {
      return NextResponse.json({ message: 'Configuracao com esta chave ja existe' }, { status: 409 })
    }

    const configuracao = await prisma.configuracao.create({
      data: {
        chave,
        valor,
        tipo: tipo || 'STRING',
      },
    })

    return NextResponse.json(configuracao, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/configuracoes error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
