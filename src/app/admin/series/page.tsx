import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getPrisma } from '@/lib/prisma';
const prisma = getPrisma()
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { List } from 'lucide-react'
import { SerieActions } from './serie-actions'

export const dynamic = 'force-dynamic'

export default async function SeriesPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const series = await prisma.serie.findMany({
    include: {
      exercicio: { select: { id: true, nome: true, grupoMuscular: true } },
    },
    orderBy: { ordem: 'asc' },
  })

  const exercicios = await prisma.exercicio.findMany({
    select: { id: true, nome: true, grupoMuscular: true },
    orderBy: { nome: 'asc' },
  })

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Series</h1>
          <p className="text-gray-400 text-sm mt-1">Gerencie as series de exercicios</p>
        </div>
        <SerieActions exercicios={exercicios} />
      </div>

      {series.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <List className="h-12 w-12 text-gray-500 mb-4" />
            <p className="text-gray-400 text-center">Nenhuma serie cadastrada</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-red-900/20">
                  <th className="text-left p-4 text-sm font-medium text-gray-400">#</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Nome</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Exercicio</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-400">Series</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-400">Reps</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Carga</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Descanso</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {series.map((s) => (
                  <tr key={s.id} className="border-b border-red-900/10 hover:bg-white/5">
                    <td className="p-4 text-sm text-gray-400">{s.ordem}</td>
                    <td className="p-4 font-medium">{s.nome}</td>
                    <td className="p-4">
                      <Badge variant="outline">{s.exercicio.nome}</Badge>
                    </td>
                    <td className="p-4 text-sm text-center">{s.series}</td>
                    <td className="p-4 text-sm text-center">{s.repeticoes}</td>
                    <td className="p-4 text-sm text-gray-400">{s.carga || '-'}</td>
                    <td className="p-4 text-sm text-gray-400">{s.descanso ? `${s.descanso}s` : '-'}</td>
                    <td className="p-4 text-right">
                      <SerieActions serie={s} exercicios={exercicios} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </DashboardLayout>
  )
}
