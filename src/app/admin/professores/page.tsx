import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma';
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export const dynamic = 'force-dynamic'

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'info'> = {
  ATIVO: 'success',
  INATIVO: 'warning',
  BLOQUEADO: 'destructive',
  PENDENTE: 'info',
}

const statusLabel: Record<string, string> = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
  BLOQUEADO: 'Bloqueado',
  PENDENTE: 'Pendente',
}

export default async function ProfessoresPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const professores = await prisma.professor.findMany({
    include: {
      usuario: {
        select: {
          id: true,
          nome: true,
          email: true,
          status: true,
          telefone: true,
          avatarUrl: true,
        },
      },
      alunos: {
        select: { id: true },
      },
    },
    orderBy: { usuario: { nome: 'asc' } },
  })

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Professores</h1>
        <p className="text-gray-400 text-sm mt-1">
          Gerencie todos os professores da academia
        </p>
      </div>

      {professores.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-400 text-center">Nenhum professor encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {professores.map((professor) => {
            const especialidades = professor.especialidades as string[]
            return (
              <Card key={professor.id} className="hover:border-primary-500 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback name={professor.usuario.nome} className="text-lg" />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{professor.usuario.nome}</h3>
                        <Badge variant={statusVariant[professor.usuario.status]} className="shrink-0">
                          {statusLabel[professor.usuario.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{professor.usuario.email}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">CREF:</span>
                        <span className="text-xs font-mono text-red-400">{professor.cref}</span>
                      </div>
                      {especialidades.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {especialidades.map((esp) => (
                            <Badge key={esp} variant="secondary" className="text-[10px]">
                              {esp}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="mt-3 pt-3 border-t border-gym-border flex items-center justify-between text-xs text-gray-500">
                        <span>{professor.alunos.length} aluno{professor.alunos.length !== 1 ? 's' : ''}</span>
                        {professor.usuario.telefone && <span>{professor.usuario.telefone}</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
