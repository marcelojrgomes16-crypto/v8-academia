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
      return NextResponse.json({ message: 'Setup ja foi executado. Dados existentes.' })
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

    const p1u = await prisma.usuario.create({ data: { email: 'carlos@v8academia.com', cpf: '11111111111', nome: 'Carlos Silva', senhaHash: pw, role: 'PROFESSOR', status: 'ATIVO', genero: 'MASCULINO', professor: { create: { cref: 'CREF-12345', especialidades: ['Musculacao', 'CrossFit'], bio: 'Personal trainer experiente.' } } } })
    const p2u = await prisma.usuario.create({ data: { email: 'ana@v8academia.com', cpf: '22222222222', nome: 'Ana Souza', senhaHash: pw, role: 'PROFESSOR', status: 'ATIVO', genero: 'FEMININO', professor: { create: { cref: 'CREF-67890', especialidades: ['Pilates', 'Yoga'], bio: 'Instrutora certificada.' } } } })

    const exercicios = await prisma.exercicio.createMany({ data: [
      { nome: 'Supino Reto', grupoMuscular: 'Peito', equipamento: 'Barra', imagemUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
      { nome: 'Agachamento', grupoMuscular: 'Pernas', equipamento: 'Barra', imagemUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=400&q=80' },
      { nome: 'Puxada Frontal', grupoMuscular: 'Costas', equipamento: 'Polia', imagemUrl: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=400&q=80' },
      { nome: 'Desenvolvimento', grupoMuscular: 'Ombros', equipamento: 'Halteres', imagemUrl: 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=400&q=80' },
      { nome: 'Rosca Direta', grupoMuscular: 'Biceps', equipamento: 'Barra', imagemUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80' },
      { nome: 'Triceps Pulley', grupoMuscular: 'Triceps', equipamento: 'Polia', imagemUrl: 'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=400&q=80' },
      { nome: 'Leg Press', grupoMuscular: 'Pernas', equipamento: 'Maquina', imagemUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80' },
      { nome: 'Abdominal Crunch', grupoMuscular: 'Abdomen', equipamento: 'Nenhum', imagemUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
      { nome: 'Elevacao Lateral', grupoMuscular: 'Ombros', equipamento: 'Halteres', imagemUrl: 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=400&q=80' },
      { nome: 'Remada Curvada', grupoMuscular: 'Costas', equipamento: 'Barra', imagemUrl: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=400&q=80' },
    ]})

    const exerciciosList = await prisma.exercicio.findMany()

    const joao = await prisma.usuario.create({ data: {
      email: 'joao@email.com', cpf: '33333333333', nome: 'Joao Pereira',
      senhaHash: pw, role: 'ALUNO', status: 'ATIVO', genero: 'MASCULINO',
      telefone: '11988888888', dataNascimento: new Date('1995-03-15'),
      aluno: {
        create: {
          matricula: 'V8MASC01', dataMatricula: new Date(), dataVencimento: new Date(Date.now() + 30*24*60*60*1000),
          planoId: pl2.id, professorId: p1u.id,
          objetivo: 'Ganhar massa muscular e forca',
          restricoes: 'Nenhuma',
        }
      }
    }, include: { aluno: true } })

    const maria = await prisma.usuario.create({ data: {
      email: 'maria@email.com', cpf: '44444444444', nome: 'Maria Santos',
      senhaHash: pw, role: 'ALUNO', status: 'ATIVO', genero: 'FEMININO',
      telefone: '11977777777', dataNascimento: new Date('1998-07-22'),
      aluno: {
        create: {
          matricula: 'V8FEM01', dataMatricula: new Date(), dataVencimento: new Date(Date.now() + 30*24*60*60*1000),
          planoId: pl2.id, professorId: p2u.id,
          objetivo: 'Tonificar o corpo e melhorar resistencia',
          restricoes: 'Nenhuma',
        }
      }
    }, include: { aluno: true } })

    const exByName = (name: string) => exerciciosList.find(e => e.nome === name)

    const treinoJoao = await prisma.treino.create({ data: {
      nome: 'Treino A - Peito e Triceps', descricao: 'Treino focado em peito e triceps com cargas progressivas',
      alunoId: joao.id, professorId: p1u.id, status: 'ATIVO', dataInicio: new Date(),
      diasSemana: [1, 3, 5],
    }})
    await prisma.exercicioTreino.createMany({ data: [
      { treinoId: treinoJoao.id, exercicioId: exByName('Supino Reto')!.id, series: 4, repeticoes: '8-12', carga: '60kg', descanso: 90, ordem: 1 },
      { treinoId: treinoJoao.id, exercicioId: exByName('Triceps Pulley')!.id, series: 3, repeticoes: '12-15', carga: '25kg', descanso: 60, ordem: 2 },
      { treinoId: treinoJoao.id, exercicioId: exByName('Desenvolvimento')!.id, series: 3, repeticoes: '10-12', carga: '20kg', descanso: 60, ordem: 3 },
      { treinoId: treinoJoao.id, exercicioId: exByName('Abdominal Crunch')!.id, series: 3, repeticoes: '20', carga: 'Corpo', descanso: 45, ordem: 4 },
    ]})

    const treinoJoao2 = await prisma.treino.create({ data: {
      nome: 'Treino B - Pernas', descricao: 'Treino completo de pernas e gluteos',
      alunoId: joao.id, professorId: p1u.id, status: 'ATIVO', dataInicio: new Date(),
      diasSemana: [2, 4],
    }})
    await prisma.exercicioTreino.createMany({ data: [
      { treinoId: treinoJoao2.id, exercicioId: exByName('Agachamento')!.id, series: 4, repeticoes: '8-10', carga: '80kg', descanso: 120, ordem: 1 },
      { treinoId: treinoJoao2.id, exercicioId: exByName('Leg Press')!.id, series: 4, repeticoes: '10-12', carga: '120kg', descanso: 90, ordem: 2 },
      { treinoId: treinoJoao2.id, exercicioId: exByName('Elevacao Lateral')!.id, series: 3, repeticoes: '12-15', carga: '10kg', descanso: 60, ordem: 3 },
    ]})

    const treinoMaria = await prisma.treino.create({ data: {
      nome: 'Treino A - Tonificacao', descricao: 'Treino focado em tonificacao e resistencia muscular',
      alunoId: maria.id, professorId: p2u.id, status: 'ATIVO', dataInicio: new Date(),
      diasSemana: [1, 3, 5],
    }})
    await prisma.exercicioTreino.createMany({ data: [
      { treinoId: treinoMaria.id, exercicioId: exByName('Puxada Frontal')!.id, series: 3, repeticoes: '12-15', carga: '30kg', descanso: 60, ordem: 1 },
      { treinoId: treinoMaria.id, exercicioId: exByName('Rosca Direta')!.id, series: 3, repeticoes: '12-15', carga: '10kg', descanso: 45, ordem: 2 },
      { treinoId: treinoMaria.id, exercicioId: exByName('Abdominal Crunch')!.id, series: 3, repeticoes: '20', carga: 'Corpo', descanso: 30, ordem: 3 },
      { treinoId: treinoMaria.id, exercicioId: exByName('Remada Curvada')!.id, series: 3, repeticoes: '12-15', carga: '25kg', descanso: 60, ordem: 4 },
    ]})

    const treinoMaria2 = await prisma.treino.create({ data: {
      nome: 'Treino B - Cardio e Core', descricao: 'Treino funcional com foco em cardio e core',
      alunoId: maria.id, professorId: p2u.id, status: 'ATIVO', dataInicio: new Date(),
      diasSemana: [2, 4, 6],
    }})
    await prisma.exercicioTreino.createMany({ data: [
      { treinoId: treinoMaria2.id, exercicioId: exByName('Agachamento')!.id, series: 3, repeticoes: '15-20', carga: '20kg', descanso: 45, ordem: 1 },
      { treinoId: treinoMaria2.id, exercicioId: exByName('Elevacao Lateral')!.id, series: 3, repeticoes: '15', carga: '5kg', descanso: 30, ordem: 2 },
      { treinoId: treinoMaria2.id, exercicioId: exByName('Abdominal Crunch')!.id, series: 4, repeticoes: '25', carga: 'Corpo', descanso: 30, ordem: 3 },
    ]})

    const agora = new Date()
    const mesAtual = new Date(agora.getFullYear(), agora.getMonth(), 1)
    await prisma.cobranca.createMany({ data: [
      { alunoId: joao.aluno!.id, valor: 149.90, descricao: 'Mensalidade Premium', dataVencimento: new Date(agora.getFullYear(), agora.getMonth(), 10), status: 'PAGO', dataPagamento: new Date(agora.getFullYear(), agora.getMonth(), 8) },
      { alunoId: joao.aluno!.id, valor: 149.90, descricao: 'Mensalidade Premium', dataVencimento: new Date(agora.getFullYear(), agora.getMonth()+1, 10), status: 'PENDENTE' },
      { alunoId: maria.aluno!.id, valor: 149.90, descricao: 'Mensalidade Premium', dataVencimento: new Date(agora.getFullYear(), agora.getMonth(), 10), status: 'PAGO', dataPagamento: new Date(agora.getFullYear(), agora.getMonth(), 5) },
      { alunoId: maria.aluno!.id, valor: 149.90, descricao: 'Mensalidade Premium', dataVencimento: new Date(agora.getFullYear(), agora.getMonth()+1, 10), status: 'PENDENTE' },
    ]})

    await prisma.pagamento.createMany({ data: [
      { alunoId: joao.aluno!.id, planoId: pl2.id, valor: 149.90, status: 'PAGO', metodo: 'Pix', dataPagamento: mesAtual, dataVencimento: mesAtual },
      { alunoId: maria.aluno!.id, planoId: pl2.id, valor: 149.90, status: 'PAGO', metodo: 'Cartao', dataPagamento: mesAtual, dataVencimento: mesAtual },
    ]})

    return NextResponse.json({
      message: 'Setup completo!',
      contas: {
        admin: 'admin@v8academia.com / 123456',
        aluno_masculino: 'joao@email.com / 123456',
        aluno_feminino: 'maria@email.com / 123456',
        professor: 'carlos@v8academia.com / 123456',
      }
    })
  } catch (error) {
    return NextResponse.json({ message: 'Erro', error: String(error) }, { status: 500 })
  }
}
