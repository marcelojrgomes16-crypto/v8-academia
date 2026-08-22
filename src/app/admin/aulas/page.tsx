import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getPrisma } from '@/lib/prisma';
const prisma = getPrisma()
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

const diasSemana = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado']

export default async function AulasPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const aulas = await prisma.aula.findMany({
    include: {
      professor: {
        select: {
          nome: true,
          email: true,
        },
      },
      agendamentos: {
        select: { id: true, status: true },
      },
    },
    orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
  })

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Aulas</h1>
        <p className="text-gray-400 text-sm mt-1">
          Todas as aulas agendadas na academia
        </p>
      </div>

      {aulas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-gray-500 mb-4" />
            <p className="text-gray-400 text-center">Nenhuma aula encontrada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aulas.map((aula) => {
            const agendados = aula.agendamentos.filter(a => a.status === 'AGENDADO' || a.status === 'CONFIRMADO').length
            return (
              <Card key={aula.id} className="hover:border-red-500 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{aula.nome}</h3>
                      <p className="text-sm text-red-400">
                        {diasSemana[aula.diaSemana]} {aula.horaInicio} - {aula.horaFim}
                      </p>
                    </div>
                    <Badge variant={aula.ativa ? 'success' : 'destructive'}>
                      {aula.ativa ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>

                  {aula.descricao && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{aula.descricao}</p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gym-border">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback name={aula.professor.nome} className="text-[10px]" />
                      </Avatar>
                      <span className="text-sm text-gray-400">{aula.professor.nome}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {agendados}/{aula.maxAlunos} vagas
                    </span>
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
