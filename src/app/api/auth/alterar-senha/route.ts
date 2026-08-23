import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { hash, compare } from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Nao autorizado' }, { status: 401 })
    }

    const { senhaAtual, novaSenha } = await request.json()

    if (!senhaAtual || !novaSenha) {
      return NextResponse.json({ message: 'Preencha todos os campos' }, { status: 400 })
    }

    if (novaSenha.length < 6) {
      return NextResponse.json({ message: 'A nova senha deve ter pelo menos 6 caracteres' }, { status: 400 })
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: session.user.id },
      select: { senha: true },
    })

    if (!usuario) {
      return NextResponse.json({ message: 'Usuario nao encontrado' }, { status: 404 })
    }

    const senhaValida = await compare(senhaAtual, usuario.senha)
    if (!senhaValida) {
      return NextResponse.json({ message: 'Senha atual incorreta' }, { status: 400 })
    }

    const novaSenhaHash = await hash(novaSenha, 10)
    await prisma.usuario.update({
      where: { id: session.user.id },
      data: { senha: novaSenhaHash },
    })

    return NextResponse.json({ message: 'Senha alterada com sucesso' })
  } catch (error) {
    console.error('POST /api/auth/alterar-senha error:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
