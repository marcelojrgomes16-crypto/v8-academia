'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session'

export async function updateAlunoStatus(alunoId: string, status: 'ATIVO' | 'INATIVO' | 'BLOQUEADO') {
  const session = await getSession()
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Não autorizado')
  }

  await prisma.usuario.update({
    where: { id: alunoId },
    data: { status },
  })

  revalidatePath('/admin/alunos')
  revalidatePath(`/admin/alunos/${alunoId}`)
}

export async function updateTreinoStatus(treinoId: string, status: 'ATIVO' | 'PAUSADO' | 'CANCELADO' | 'CONCLUIDO') {
  const session = await getSession()
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Não autorizado')
  }

  await prisma.treino.update({
    where: { id: treinoId },
    data: { status },
  })

  revalidatePath('/admin/treinos')
}
