import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get('secret')
    if (secret !== 'v8academia-setup-2024') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const pw = await bcrypt.hash('123456', 12)

    const existing = await prisma.usuario.findFirst({ where: { email: 'admin@v8academia.com' } })
    if (existing) {
      return NextResponse.json({ message: 'Admin ja existe', email: 'admin@v8academia.com' })
    }

    const [pl1, pl2, pl3] = await Promise.all([
      prisma.plano.create({ data: { nome: 'Basico', descricao: 'Musculacao e esteira', preco: 89.90, duracaoDias: 30, features: ['Musculacao', 'Esteira'], ativo: true } }),
      prisma.plano.create({ data: { nome: 'Premium', descricao: 'Acesso completo', preco: 149.90, duracaoDias: 30, features: ['Musculacao', 'Esteira', 'Personal', 'Aulas'], ativo: true } }),
      prisma.plano.create({ data: { nome: 'VIP', descricao: 'Todos beneficios', preco: 249.90, duracaoDias: 30, features: ['Musculacao', 'Esteira', 'Personal', 'Aulas', 'Nutri'], ativo: true } }),
    ])

    await prisma.usuario.create({ data: {
      email: 'admin@v8academia.com', cpf: '00000000000', nome: 'Administrador',
      senhaHash: pw, role: 'ADMIN', status: 'ATIVO', telefone: '11999999999',
      admin: { create: { permissoes: ['ALL'] } }
    }})

    const p1u = await prisma.usuario.create({ data: { email: 'carlos@v8academia.com', cpf: '11111111111', nome: 'Carlos Silva', senhaHash: pw, role: 'PROFESSOR', status: 'ATIVO', professor: { create: { cref: 'CREF-12345', especialidades: ['Musculacao', 'CrossFit'], bio: 'Personal trainer experiente.' } } } })
    const p2u = await prisma.usuario.create({ data: { email: 'ana@v8academia.com', cpf: '22222222222', nome: 'Ana Souza', senhaHash: pw, role: 'PROFESSOR', status: 'ATIVO', professor: { create: { cref: 'CREF-67890', especialidades: ['Pilates', 'Yoga'], bio: 'Instrutora certificada.' } } } })

    await prisma.exercicio.createMany({ data: [
      { nome: 'Supino Reto', grupoMuscular: 'Peito', equipamento: 'Barra' },
      { nome: 'Agachamento', grupoMuscular: 'Pernas', equipamento: 'Barra' },
      { nome: 'Puxada Frontal', grupoMuscular: 'Costas', equipamento: 'Polia' },
      { nome: 'Desenvolvimento', grupoMuscular: 'Ombros', equipamento: 'Halteres' },
      { nome: 'Rosca Direta', grupoMuscular: 'Biceps', equipamento: 'Barra' },
      { nome: 'Triceps Pulley', grupoMuscular: 'Triceps', equipamento: 'Polia' },
      { nome: 'Leg Press', grupoMuscular: 'Pernas', equipamento: 'Maquina' },
      { nome: 'Abdominal', grupoMuscular: 'Abdomen', equipamento: 'Nenhum' },
    ]})

    return NextResponse.json({ message: 'Setup minimo completo!', admin: 'admin@v8academia.com / 123456' })
  } catch (error) {
    return NextResponse.json({ message: 'Erro', error: String(error) }, { status: 500 })
  }
}
