import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ message: 'Nao autorizado' }, { status: 401 })
    }

    const userId = session.user.id

    await prisma.$transaction(async (tx) => {
      const aluno = await tx.aluno.findFirst({ where: { usuarioId: userId } })

      if (aluno) {
        await tx.checkin.deleteMany({ where: { alunoId: aluno.id } })
        await tx.avaliacaoFisica.deleteMany({ where: { alunoId: aluno.id } })
        await tx.notificacao.deleteMany({ where: { usuarioId: userId } })
        await tx.agendamento.deleteMany({ where: { alunoId: userId } })
        await tx.cobranca.deleteMany({ where: { alunoId: userId } })
        await tx.pagamento.deleteMany({ where: { alunoId: userId } })
        await tx.treino.updateMany({ where: { alunoId: userId }, data: { alunoId: null as any } })
        await tx.aluno.delete({ where: { id: aluno.id } })
      }

      await tx.notificacao.deleteMany({ where: { usuarioId: userId } })
      await tx.usuario.delete({ where: { id: userId } })
    })

    const response = NextResponse.json({ message: 'Conta excluida com sucesso' })
    response.cookies.set('session', '', { maxAge: 0, path: '/' })
    return response
  } catch (error) {
    console.error('POST /api/auth/excluir-conta error:', error)
    return NextResponse.json({ message: 'Erro ao excluir conta' }, { status: 500 })
  }
}
