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

    const exercicios = await prisma.exercicio.findMany({
      include: { _count: { select: { treinos: true, series: true } } },
      orderBy: { nome: 'asc' },
    })

    return NextResponse.json(exercicios)
  } catch (error) {
    console.error('GET /api/admin/exercicios error:', error)
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
    const { nome, descricao, grupoMuscular, equipamento, videoUrl, imagemUrl } = body

    if (!nome || !grupoMuscular) {
      return NextResponse.json({ message: 'Nome e grupo muscular sao obrigatorios' }, { status: 400 })
    }

    const exercicio = await prisma.exercicio.create({
      data: {
        nome,
        descricao: descricao || null,
        grupoMuscular,
        equipamento: equipamento || null,
        videoUrl: videoUrl || null,
        imagemUrl: imagemUrl || null,
      },
    })

    return NextResponse.json(exercicio, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/exercicios error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
