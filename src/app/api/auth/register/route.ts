import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const registerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
  telefone: z.string().optional(),
  dataNascimento: z.string().datetime().optional().nullable(),
  genero: z.string().optional().nullable(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, email, cpf, telefone, dataNascimento, genero, password } = registerSchema.parse(body)

    const existingUser = await prisma.usuario.findFirst({
      where: {
        OR: [{ email }, { cpf }],
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'E-mail ou CPF já cadastrado' },
        { status: 409 }
      )
    }

    const senhaHash = await bcrypt.hash(password, 12)

    const matricula = `V8${Date.now().toString().slice(-6)}`

    const user = await prisma.usuario.create({
      data: {
        nome,
        email,
        cpf,
        telefone: telefone ? telefone.replace(/\D/g, '') : null,
        dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
        genero: genero || null,
        senhaHash,
        role: 'ALUNO',
        status: 'ATIVO',
        aluno: {
          create: {
            matricula,
            dataMatricula: new Date(),
          },
        },
      },
      include: {
        aluno: true,
      },
    })

    return NextResponse.json({
      message: 'Conta criada com sucesso! Aguarde aprovação da administração.',
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        matricula: user.aluno?.matricula,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Register error:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}