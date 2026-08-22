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

    console.log('Seeding database...')
    const h = new Date()

    await prisma.notificacao.deleteMany()
    await prisma.checkin.deleteMany()
    await prisma.cobranca.deleteMany()
    await prisma.receita.deleteMany()
    await prisma.despesa.deleteMany()
    await prisma.pagamento.deleteMany()
    await prisma.avaliacaoFisica.deleteMany()
    await prisma.agendamento.deleteMany()
    await prisma.aula.deleteMany()
    await prisma.serie.deleteMany()
    await prisma.exercicioTreino.deleteMany()
    await prisma.treino.deleteMany()
    await prisma.exercicio.deleteMany()
    await prisma.admin.deleteMany()
    await prisma.professor.deleteMany()
    await prisma.funcionario.deleteMany()
    await prisma.aluno.deleteMany()
    await prisma.plano.deleteMany()
    await prisma.usuario.deleteMany()
    await prisma.configuracao.deleteMany()

    const pw = await bcrypt.hash('123456', 12)

    const [pl1, pl2, pl3] = await Promise.all([
      prisma.plano.create({ data: { nome: 'Basico', descricao: 'Musculacao e esteira', preco: 89.90, duracaoDias: 30, features: ['Musculacao', 'Esteira'], ativo: true } }),
      prisma.plano.create({ data: { nome: 'Premium', descricao: 'Acesso completo', preco: 149.90, duracaoDias: 30, features: ['Musculacao', 'Esteira', 'Personal', 'Aulas'], ativo: true } }),
      prisma.plano.create({ data: { nome: 'VIP', descricao: 'Todos beneficios', preco: 249.90, duracaoDias: 30, features: ['Musculacao', 'Esteira', 'Personal', 'Aulas', 'Nutri'], ativo: true } }),
    ])

    const admin = await prisma.usuario.create({ data: { email: 'admin@v8academia.com', cpf: '00000000000', nome: 'Administrador', senhaHash: pw, role: 'ADMIN', status: 'ATIVO', telefone: '11999999999', admin: { create: { permissoes: ['ALL'] } } } })

    const p1u = await prisma.usuario.create({ data: { email: 'carlos@v8academia.com', cpf: '11111111111', nome: 'Carlos Silva', senhaHash: pw, role: 'PROFESSOR', status: 'ATIVO', dataNascimento: new Date('1985-03-10'), professor: { create: { cref: 'CREF-12345', especialidades: ['Musculacao', 'CrossFit'], bio: 'Personal trainer experiente.' } } } })
    const p2u = await prisma.usuario.create({ data: { email: 'ana@v8academia.com', cpf: '22222222222', nome: 'Ana Souza', senhaHash: pw, role: 'PROFESSOR', status: 'ATIVO', dataNascimento: new Date('1990-07-22'), professor: { create: { cref: 'CREF-67890', especialidades: ['Pilates', 'Yoga'], bio: 'Instrutora certificada.' } } } })
    const p1 = await prisma.professor.findUnique({ where: { usuarioId: p1u.id } })
    const p2 = await prisma.professor.findUnique({ where: { usuarioId: p2u.id } })

    const exs = await Promise.all([
      prisma.exercicio.create({ data: { nome: 'Supino Reto', grupoMuscular: 'Peito', equipamento: 'Barra' } }),
      prisma.exercicio.create({ data: { nome: 'Agachamento', grupoMuscular: 'Pernas', equipamento: 'Barra' } }),
      prisma.exercicio.create({ data: { nome: 'Puxada Frontal', grupoMuscular: 'Costas', equipamento: 'Polia' } }),
      prisma.exercicio.create({ data: { nome: 'Desenvolvimento', grupoMuscular: 'Ombros', equipamento: 'Halteres' } }),
      prisma.exercicio.create({ data: { nome: 'Rosca Direta', grupoMuscular: 'Biceps', equipamento: 'Barra' } }),
      prisma.exercicio.create({ data: { nome: 'Triceps Pulley', grupoMuscular: 'Triceps', equipamento: 'Polia' } }),
      prisma.exercicio.create({ data: { nome: 'Leg Press', grupoMuscular: 'Pernas', equipamento: 'Maquina' } }),
      prisma.exercicio.create({ data: { nome: 'Abdominal', grupoMuscular: 'Abdomen', equipamento: 'Nenhum' } }),
    ])

    const nomes = ['Lucas Pereira','Juliana Fernandes','Rafael Costa','Thiago Martinho','Camila Rodrigues','Fernanda Almeida','Bruno Carvalho','Patricia Lima','Gabriel Santos','Amanda Ferreira','Ricardo Oliveira','Leticia Martins','Marcos Ribeiro','Isabela Costa','Felipe Araujo','Vanessa Souza','Daniel Nascimento','Bianca Gomes','Andre Barbosa','Natalia Dias','Rodrigo Mendes','Priscila Moreira','Luciano Vieira','Tatiane Cardoso','Eduardo Campos','Renata Pinto','Alexandre Monteiro','Carla Freitas','Thales Rodrigues','Juliana Marques','Sergio Lopes','Adriana Silva','Fabio Duarte','Mariana Correia','Leandro Batista','Debora Nogueira','Gustavo Teixeira','Vanessa Moura','Henrique Cunha','Larissa Azevedo']

    const userIds: string[] = []
    for (let i = 0; i < nomes.length; i++) {
      const u = await prisma.usuario.create({ data: {
        email: `aluno${i+1}@email.com`, cpf: `${30000000000+i}`, nome: nomes[i], senhaHash: pw, role: 'ALUNO', status: i < 38 ? 'ATIVO' : 'INATIVO',
        telefone: `119${(90000000+i).toString()}`, dataNascimento: new Date(1985+(i%15), (i*3)%12, (i*7)%28+1),
        aluno: { create: { matricula: `V8${(i+1).toString().padStart(5,'0')}`, planoId: [pl1,pl2,pl3][i%3].id, dataMatricula: new Date(2024, i%12, (i*2)%28+1), dataVencimento: new Date(h.getMonth()+(i%3===0?-1:0)>11?h.getFullYear()+1:h.getFullYear(), (h.getMonth()+(i%3===0?-1:0)+12)%12, Math.min(28, 5+(i%24))), objetivo: ['Ganhar massa','Perder peso','Manter forma','Reabilitacao'][i%4], professorId: i%2===0?p1?.id:p2?.id } },
      }})
      userIds.push(u.id)
    }

    for (let i = 0; i < 10; i++) {
      await prisma.treino.create({ data: { nome: `Treino ${String.fromCharCode(65+i%4)}`, alunoId: userIds[i], professorId: i%2===0?p1u.id:p2u.id, status: 'ATIVO', dataInicio: new Date(2024, i%6, 1), diasSemana: [1,3,5], exercicios: { create: [
        { exercicioId: exs[i%8].id, series: 4, repeticoes: '12', carga: `${20+i*5}kg`, descanso: 60, ordem: 1 },
        { exercicioId: exs[(i+1)%8].id, series: 3, repeticoes: '15', carga: `${15+i*3}kg`, descanso: 60, ordem: 2 },
      ] } } })
    }

    const aulas = await Promise.all([
      prisma.aula.create({ data: { nome: 'Spinning', descricao: 'Ciclismo indoor', professorId: p1u.id, diaSemana: 1, horaInicio: '07:00', horaFim: '08:00', maxAlunos: 20, ativa: true } }),
      prisma.aula.create({ data: { nome: 'Pilates', descricao: 'Aula de Pilates', professorId: p2u.id, diaSemana: 3, horaInicio: '09:00', horaFim: '10:00', maxAlunos: 15, ativa: true } }),
      prisma.aula.create({ data: { nome: 'CrossFit', descricao: 'CrossFit funcional', professorId: p1u.id, diaSemana: 5, horaInicio: '18:00', horaFim: '19:00', maxAlunos: 12, ativa: true } }),
    ])

    for (let i = 0; i < 20; i++) {
      await prisma.checkin.create({ data: { alunoId: userIds[i%userIds.length], dataHora: new Date(h.getTime() - i*3600000*(2+i%5)), tipo: 'ENTRADA' } })
    }

    for (let i = 0; i < 30; i++) {
      await prisma.pagamento.create({ data: { alunoId: userIds[i%userIds.length], planoId: [pl1,pl2,pl3][i%3].id, valor: [89.90,149.90,249.90][i%3], status: i<22?'PAGO':'PENDENTE', metodo: ['PIX','Cartao','Dinheiro'][i%3], dataPagamento: i<22?new Date(h.getFullYear(),h.getMonth(),Math.max(1,h.getDate()-i)):undefined, dataVencimento: new Date(h.getFullYear(),h.getMonth(),Math.min(28,3+i)) } })
    }

    for (let i = 0; i < 15; i++) {
      await prisma.cobranca.create({ data: { alunoId: userIds[i%userIds.length], valor: [89.90,149.90][i%2], descricao: `Mensalidade ${(h.getMonth()+1).toString().padStart(2,'0')}/${h.getFullYear()}`, dataVencimento: new Date(h.getFullYear(),h.getMonth(),Math.min(28,10+i)), status: i<8?'PAGO':'PENDENTE', dataPagamento: i<8?new Date(h.getFullYear(),h.getMonth(),5+i):undefined } })
    }

    for (let i = 0; i < 10; i++) {
      await prisma.receita.create({ data: { descricao: `Pagamento ${nomes[i]}`, valor: [89.90,149.90,249.90][i%3], categoria: ['Mensalidade','Personal','Avaliacao'][i%3], data: new Date(h.getFullYear(),h.getMonth(),1+i) } })
      await prisma.despesa.create({ data: { descricao: ['Aluguel','Energia','Equipamentos','Manutencao','Limpeza'][i%5], valor: [3500,800,2200,450,600][i%5], categoria: ['Fixa','Variavel','Capital'][i%3], data: new Date(h.getFullYear(),h.getMonth(),1+i), fornecedor: ['Academia Corp','Eletro','SportTech','ManutPro','CleanMax'][i%5] } })
    }

    await prisma.notificacao.create({ data: { usuarioId: userIds[0], titulo: 'Novo treino', mensagem: 'Seu professor enviou um novo treino!', tipo: 'TREINO', lida: false } })
    await prisma.notificacao.create({ data: { usuarioId: userIds[0], titulo: 'Pagamento vencendo', mensagem: 'Sua mensalidade vence em 5 dias.', tipo: 'PAGAMENTO', lida: false } })

    return NextResponse.json({ message: 'Seed completo!', admin: 'admin@v8academia.com / 123456' })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ message: 'Erro ao semear banco', error: String(error) }, { status: 500 })
  }
}
