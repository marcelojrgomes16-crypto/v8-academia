import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const signinSchema = z.object({
  email: z.string().min(1, 'E-mail ou CPF é obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = signinSchema.parse(body)

    const user = await prisma.usuario.findFirst({
      where: {
        OR: [
          { email },
          { cpf: email.replace(/\D/g, '') },
        ],
      },
      include: {
        aluno: true,
        professor: true,
        admin: true,
      },
    })

    if (!user || !user.senhaHash) {
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    if (user.status !== 'ATIVO') {
      return NextResponse.json(
        { message: 'Conta não ativada ou bloqueada' },
        { status: 403 }
      )
    }

    const isValid = await bcrypt.compare(password, user.senhaHash)

    if (!isValid) {
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.nome,
      role: user.role,
      matricula: user.aluno?.matricula,
    }

    const response = NextResponse.json({ user: sessionData })

    response.cookies.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Signin error:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
