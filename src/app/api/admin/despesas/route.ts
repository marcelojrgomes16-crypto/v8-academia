import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
    }

    const despesas = await prisma.despesa.findMany({
      orderBy: { data: 'desc' },
    })

    return NextResponse.json(despesas)
  } catch (error) {
    console.error('GET /api/admin/despesas error:', error)
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
    const { descricao, valor, categoria, data, fornecedor, observacoes } = body

    if (!descricao || valor === undefined || !categoria) {
      return NextResponse.json({ message: 'Descrição, valor e categoria são obrigatórios' }, { status: 400 })
    }

    const despesa = await prisma.despesa.create({
      data: {
        descricao,
        valor: Number(valor),
        categoria,
        data: data ? new Date(data) : new Date(),
        fornecedor: fornecedor || null,
        observacoes: observacoes || null,
      },
    })

    return NextResponse.json(despesa, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/despesas error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
