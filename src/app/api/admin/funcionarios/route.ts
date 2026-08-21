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

    const funcionarios = await prisma.funcionario.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            status: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { dataAdmissao: 'desc' },
    })

    return NextResponse.json(funcionarios)
  } catch (error) {
    console.error('GET /api/admin/funcionarios error:', error)
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
    const { usuarioId, cargo, salario, dataAdmissao, observacoes } = body

    if (!usuarioId || !cargo) {
      return NextResponse.json({ message: 'Usuário e cargo são obrigatórios' }, { status: 400 })
    }

    const existing = await prisma.funcionario.findUnique({ where: { usuarioId } })
    if (existing) {
      return NextResponse.json({ message: 'Este usuário já é funcionário' }, { status: 409 })
    }

    const funcionario = await prisma.funcionario.create({
      data: {
        usuarioId,
        cargo,
        salario: salario ? Number(salario) : null,
        dataAdmissao: dataAdmissao ? new Date(dataAdmissao) : new Date(),
        observacoes: observacoes || null,
      },
      include: {
        usuario: {
          select: { id: true, nome: true, email: true, telefone: true, status: true },
        },
      },
    })

    return NextResponse.json(funcionario, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/funcionarios error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
