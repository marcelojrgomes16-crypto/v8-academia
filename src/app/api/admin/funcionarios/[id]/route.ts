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
    const funcionario = await prisma.funcionario.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true, nome: true, email: true, telefone: true,
            status: true, avatarUrl: true, dataNascimento: true,
          },
        },
      },
    })

    if (!funcionario) {
      return NextResponse.json({ message: 'Funcionário não encontrado' }, { status: 404 })
    }

    return NextResponse.json(funcionario)
  } catch (error) {
    console.error('GET /api/admin/funcionarios/[id] error:', error)
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

    const existing = await prisma.funcionario.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ message: 'Funcionário não encontrado' }, { status: 404 })
    }

    const funcionario = await prisma.funcionario.update({
      where: { id },
      data: {
        ...(body.cargo !== undefined && { cargo: body.cargo }),
        ...(body.salario !== undefined && { salario: body.salario ? Number(body.salario) : null }),
        ...(body.dataAdmissao !== undefined && { dataAdmissao: new Date(body.dataAdmissao) }),
        ...(body.observacoes !== undefined && { observacoes: body.observacoes || null }),
      },
      include: {
        usuario: {
          select: { id: true, nome: true, email: true, telefone: true, status: true },
        },
      },
    })

    return NextResponse.json(funcionario)
  } catch (error) {
    console.error('PUT /api/admin/funcionarios/[id] error:', error)
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
    const existing = await prisma.funcionario.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ message: 'Funcionário não encontrado' }, { status: 404 })
    }

    await prisma.funcionario.delete({ where: { id } })
    return NextResponse.json({ message: 'Funcionário removido com sucesso' })
  } catch (error) {
    console.error('DELETE /api/admin/funcionarios/[id] error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
