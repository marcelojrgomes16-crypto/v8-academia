import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
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

    const cobrancas = await prisma.cobranca.findMany({
      include: {
        aluno: {
          select: { id: true, nome: true, email: true },
        },
      },
      orderBy: { dataVencimento: 'desc' },
    })

    return NextResponse.json(cobrancas)
  } catch (error) {
    console.error('GET /api/admin/cobrancas error:', error)
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
    const { alunoId, valor, descricao, dataVencimento, observacoes } = body

    if (!alunoId || valor === undefined || !descricao || !dataVencimento) {
      return NextResponse.json({ message: 'Aluno, valor, descricao e data de vencimento sao obrigatorios' }, { status: 400 })
    }

    const cobranca = await prisma.cobranca.create({
      data: {
        alunoId,
        valor: Number(valor),
        descricao,
        dataVencimento: new Date(dataVencimento),
        observacoes: observacoes || null,
      },
      include: {
        aluno: {
          select: { id: true, nome: true, email: true },
        },
      },
    })

    return NextResponse.json(cobranca, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/cobrancas error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
