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
    const logs: string[] = []

    const existingAdmin = await prisma.usuario.findFirst({ where: { email: 'admin@v8academia.com' } })
    if (!existingAdmin) {
      const adminUser = await prisma.usuario.create({ data: {
        email: 'admin@v8academia.com', cpf: '00000000000', nome: 'Administrador',
        senhaHash: pw, role: 'ADMIN', status: 'ATIVO', telefone: '11999999999',
        admin: { create: { permissoes: ['ALL'] } }
      }})
      logs.push(`Admin criado id=${adminUser.id}`)
    } else {
      logs.push('Admin ja existia')
    }

    let pl1 = await prisma.plano.findFirst({ where: { nome: 'Basico' } })
    if (!pl1) {
      pl1 = await prisma.plano.create({ data: { nome: 'Basico', descricao: 'Musculacao e esteira', preco: 89.90, duracaoDias: 30, features: ['Musculacao', 'Esteira'], ativo: true } })
      await prisma.plano.create({ data: { nome: 'Premium', descricao: 'Acesso completo', preco: 149.90, duracaoDias: 30, features: ['Musculacao', 'Esteira', 'Personal', 'Aulas'], ativo: true } })
      await prisma.plano.create({ data: { nome: 'VIP', descricao: 'Todos beneficios', preco: 249.90, duracaoDias: 30, features: ['Musculacao', 'Esteira', 'Personal', 'Aulas', 'Nutri'], ativo: true } })
      logs.push('Planos criados')
    } else {
      logs.push('Planos ja existiam')
    }

    let p1u = await prisma.usuario.findFirst({ where: { email: 'carlos@v8academia.com' } })
    if (!p1u) {
      try {
        p1u = await prisma.usuario.create({ data: { email: 'carlos@v8academia.com', cpf: '55555555555', nome: 'Carlos Silva', senhaHash: pw, role: 'PROFESSOR', status: 'ATIVO', genero: 'MASCULINO', professor: { create: { cref: 'CREF-12345', especialidades: ['Musculacao', 'CrossFit'], bio: 'Personal trainer experiente.' } } } })
        logs.push('Professor Carlos criado')
      } catch (e: any) {
        if (e?.code === 'P2002') {
          p1u = await prisma.usuario.findFirst({ where: { email: 'carlos@v8academia.com' } })
          logs.push('Carlos existia com cpf duplicado, encontrado por email')
        } else throw e
      }
    }

    let p2u = await prisma.usuario.findFirst({ where: { email: 'ana@v8academia.com' } })
    if (!p2u) {
      try {
        p2u = await prisma.usuario.create({ data: { email: 'ana@v8academia.com', cpf: '66666666666', nome: 'Ana Souza', senhaHash: pw, role: 'PROFESSOR', status: 'ATIVO', genero: 'FEMININO', professor: { create: { cref: 'CREF-67890', especialidades: ['Pilates', 'Yoga'], bio: 'Instrutora certificada.' } } } })
        logs.push('Professora Ana criada')
      } catch (e: any) {
        if (e?.code === 'P2002') {
          p2u = await prisma.usuario.findFirst({ where: { email: 'ana@v8academia.com' } })
          logs.push('Ana existia com cpf duplicado, encontrado por email')
        } else throw e
      }
    }

    const exCount = await prisma.exercicio.count()
    if (exCount === 0) {
      await prisma.exercicio.createMany({ data: [
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
      logs.push('Exercicios criados')
    } else {
      logs.push(`${exCount} exercicios ja existiam`)
    }

    const exList = await prisma.exercicio.findMany()
    const exByName = (n: string) => exList.find(e => e.nome === n)

    const planoPremium = await prisma.plano.findFirst({ where: { nome: 'Premium' } })
    const prof1 = p1u ? await prisma.professor.findFirst({ where: { usuarioId: p1u.id } }) : null
    const prof2 = p2u ? await prisma.professor.findFirst({ where: { usuarioId: p2u.id } }) : null
    const profRef = prof1 || prof2 || (await prisma.professor.findFirst())
    const profRef2 = prof2 || prof1 || profRef

    const joaoExists = await prisma.usuario.findFirst({ where: { email: 'joao@email.com' } })
    if (!joaoExists && profRef && pl1) {
      try {
        const joao = await prisma.usuario.create({ data: {
          email: 'joao@email.com', cpf: '77777777777', nome: 'Joao Pereira',
          senhaHash: pw, role: 'ALUNO', status: 'ATIVO', genero: 'MASCULINO',
          telefone: '11988888888', dataNascimento: new Date('1995-03-15'),
          aluno: { create: { matricula: 'V8MASC01', dataMatricula: new Date(), dataVencimento: new Date(Date.now() + 30*86400000), planoId: planoPremium?.id || pl1.id, professorId: profRef.id, objetivo: 'Ganhar massa muscular e forca' } }
        }, include: { aluno: true } })

        const t1 = await prisma.treino.create({ data: { nome: 'Treino A - Peito e Triceps', descricao: 'Treino focado em peito e triceps', alunoId: joao.id, professorId: p1u!.id, status: 'ATIVO', dataInicio: new Date(), diasSemana: [1, 3, 5] } })
        const exercises1 = [
          { ex: exByName('Supino Reto'), s: 4, r: '8-12', c: '60kg', d: 90 },
          { ex: exByName('Triceps Pulley'), s: 3, r: '12-15', c: '25kg', d: 60 },
          { ex: exByName('Desenvolvimento'), s: 3, r: '10-12', c: '20kg', d: 60 },
          { ex: exByName('Abdominal Crunch'), s: 3, r: '20', c: 'Corpo', d: 45 },
        ]
        for (let i = 0; i < exercises1.length; i++) {
          const e = exercises1[i]
          if (e.ex) await prisma.exercicioTreino.create({ data: { treinoId: t1.id, exercicioId: e.ex.id, series: e.s, repeticoes: e.r, carga: e.c, descanso: e.d, ordem: i + 1 } })
        }

        const t2 = await prisma.treino.create({ data: { nome: 'Treino B - Pernas', descricao: 'Treino completo de pernas e gluteos', alunoId: joao.id, professorId: p1u!.id, status: 'ATIVO', dataInicio: new Date(), diasSemana: [2, 4] } })
        const ex2 = [
          { ex: exByName('Agachamento'), s: 4, r: '8-10', c: '80kg', d: 120 },
          { ex: exByName('Leg Press'), s: 4, r: '10-12', c: '120kg', d: 90 },
          { ex: exByName('Elevacao Lateral'), s: 3, r: '12-15', c: '10kg', d: 60 },
        ]
        for (let i = 0; i < ex2.length; i++) {
          const e = ex2[i]
          if (e.ex) await prisma.exercicioTreino.create({ data: { treinoId: t2.id, exercicioId: e.ex.id, series: e.s, repeticoes: e.r, carga: e.c, descanso: e.d, ordem: i + 1 } })
        }

        await prisma.cobranca.createMany({ data: [
          { alunoId: joao.id, valor: 149.90, descricao: 'Mensalidade Premium', dataVencimento: new Date(new Date().getFullYear(), new Date().getMonth(), 10), status: 'PAGO', dataPagamento: new Date() },
          { alunoId: joao.id, valor: 149.90, descricao: 'Mensalidade Premium', dataVencimento: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 10), status: 'PENDENTE' },
        ]})
        await prisma.pagamento.create({ data: { alunoId: joao.id, planoId: planoPremium?.id || pl1.id, valor: 149.90, status: 'PAGO', metodo: 'Pix', dataPagamento: new Date(), dataVencimento: new Date() } })
        logs.push('Aluno Joao criado com treinos e boletos')
      } catch (e: any) {
        logs.push(`Erro ao criar Joao: ${e?.message || String(e)}`)
      }
    } else {
      logs.push('Joao ja existia ou professor nao encontrado')
    }

    const mariaExists = await prisma.usuario.findFirst({ where: { email: 'maria@email.com' } })
    if (!mariaExists && profRef2 && pl1) {
      try {
        const maria = await prisma.usuario.create({ data: {
          email: 'maria@email.com', cpf: '88888888888', nome: 'Maria Santos',
          senhaHash: pw, role: 'ALUNO', status: 'ATIVO', genero: 'FEMININO',
          telefone: '11977777777', dataNascimento: new Date('1998-07-22'),
          aluno: { create: { matricula: 'V8FEM01', dataMatricula: new Date(), dataVencimento: new Date(Date.now() + 30*86400000), planoId: planoPremium?.id || pl1.id, professorId: profRef2.id, objetivo: 'Tonificar o corpo e melhorar resistencia' } }
        }, include: { aluno: true } })

        const t3 = await prisma.treino.create({ data: { nome: 'Treino A - Tonificacao', descricao: 'Treino focado em tonificacao e resistencia', alunoId: maria.id, professorId: p2u!.id, status: 'ATIVO', dataInicio: new Date(), diasSemana: [1, 3, 5] } })
        const ex3 = [
          { ex: exByName('Puxada Frontal'), s: 3, r: '12-15', c: '30kg', d: 60 },
          { ex: exByName('Rosca Direta'), s: 3, r: '12-15', c: '10kg', d: 45 },
          { ex: exByName('Abdominal Crunch'), s: 3, r: '20', c: 'Corpo', d: 30 },
          { ex: exByName('Remada Curvada'), s: 3, r: '12-15', c: '25kg', d: 60 },
        ]
        for (let i = 0; i < ex3.length; i++) {
          const e = ex3[i]
          if (e.ex) await prisma.exercicioTreino.create({ data: { treinoId: t3.id, exercicioId: e.ex.id, series: e.s, repeticoes: e.r, carga: e.c, descanso: e.d, ordem: i + 1 } })
        }

        const t4 = await prisma.treino.create({ data: { nome: 'Treino B - Cardio e Core', descricao: 'Treino funcional com foco em cardio e core', alunoId: maria.id, professorId: p2u!.id, status: 'ATIVO', dataInicio: new Date(), diasSemana: [2, 4, 6] } })
        const ex4 = [
          { ex: exByName('Agachamento'), s: 3, r: '15-20', c: '20kg', d: 45 },
          { ex: exByName('Elevacao Lateral'), s: 3, r: '15', c: '5kg', d: 30 },
          { ex: exByName('Abdominal Crunch'), s: 4, r: '25', c: 'Corpo', d: 30 },
        ]
        for (let i = 0; i < ex4.length; i++) {
          const e = ex4[i]
          if (e.ex) await prisma.exercicioTreino.create({ data: { treinoId: t4.id, exercicioId: e.ex.id, series: e.s, repeticoes: e.r, carga: e.c, descanso: e.d, ordem: i + 1 } })
        }

        await prisma.cobranca.createMany({ data: [
          { alunoId: maria.id, valor: 149.90, descricao: 'Mensalidade Premium', dataVencimento: new Date(new Date().getFullYear(), new Date().getMonth(), 10), status: 'PAGO', dataPagamento: new Date() },
          { alunoId: maria.id, valor: 149.90, descricao: 'Mensalidade Premium', dataVencimento: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 10), status: 'PENDENTE' },
        ]})
        await prisma.pagamento.create({ data: { alunoId: maria.id, planoId: planoPremium?.id || pl1.id, valor: 149.90, status: 'PAGO', metodo: 'Cartao', dataPagamento: new Date(), dataVencimento: new Date() } })
        logs.push('Aluna Maria criada com treinos e boletos')
      } catch (e: any) {
        logs.push(`Erro ao criar Maria: ${e?.message || String(e)}`)
      }
    } else {
      logs.push('Maria ja existia ou professor nao encontrado')
    }

    return NextResponse.json({
      message: 'Setup completo!',
      logs,
      contas: {
        admin: 'admin@v8academia.com / 123456',
        aluno_masculino: 'joao@email.com / 123456',
        aluno_feminino: 'maria@email.com / 123456',
      }
    })
  } catch (error: any) {
    return NextResponse.json({ message: 'Erro geral', error: String(error), stack: error?.stack?.substring(0, 500) }, { status: 500 })
  }
}
