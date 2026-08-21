import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
    }

    const planos = await prisma.plano.findMany({
      include: { _count: { select: { alunos: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(planos)
  } catch (error) {
    console.error('GET /api/admin/planos error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
    }

    const body = await request.json()
    const { nome, descricao, preco, duracaoDias, features, ativo } = body

    if (!nome || preco === undefined || !duracaoDias) {
      return NextResponse.json({ message: 'Nome, preço e duração são obrigatórios' }, { status: 400 })
    }

    const plano = await prisma.plano.create({
      data: {
        nome,
        descricao: descricao || null,
        preco: Number(preco),
        duracaoDias: Number(duracaoDias),
        features: features || [],
        ativo: ativo !== undefined ? ativo : true,
      },
    })

    return NextResponse.json(plano, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/planos error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
