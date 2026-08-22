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

    const series = await prisma.serie.findMany({
      include: {
        exercicio: {
          select: { id: true, nome: true, grupoMuscular: true },
        },
      },
      orderBy: { ordem: 'asc' },
    })

    return NextResponse.json(series)
  } catch (error) {
    console.error('GET /api/admin/series error:', error)
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
    const { nome, descricao, exercicioId, series, repeticoes, carga, descanso, ordem, observacoes } = body

    if (!nome || !exercicioId || !series || !repeticoes || !ordem) {
      return NextResponse.json({ message: 'Nome, exercicio, series, repeticoes e ordem sao obrigatorios' }, { status: 400 })
    }

    const serie = await prisma.serie.create({
      data: {
        nome,
        descricao: descricao || null,
        exercicioId,
        series: Number(series),
        repeticoes,
        carga: carga || null,
        descanso: descanso ? Number(descanso) : null,
        ordem: Number(ordem),
        observacoes: observacoes || null,
      },
      include: {
        exercicio: {
          select: { id: true, nome: true, grupoMuscular: true },
        },
      },
    })

    return NextResponse.json(serie, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/series error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
