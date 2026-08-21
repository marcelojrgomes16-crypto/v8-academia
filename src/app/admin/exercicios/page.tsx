import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dumbbell } from 'lucide-react'
import { ExercicioActions } from './exercicio-actions'

export const dynamic = 'force-dynamic'

const gruposMusculares = [
  'Peito', 'Costas', 'Ombros', 'Biceps', 'Triceps', 'Antebracos',
  'Abdomen', 'Gluteos', 'Quadriceps', 'Isquiotibiais', 'Panturrilha',
  'Trapizio', 'Forearms', 'Interno/Externo de coxa', 'Lombar',
]

export default async function ExerciciosPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const exercicios = await prisma.exercicio.findMany({
    include: { _count: { select: { treinos: true, series: true } } },
    orderBy: { nome: 'asc' },
  })

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Exercicios</h1>
          <p className="text-gray-400 text-sm mt-1">Gerencie os exercicios da academia</p>
        </div>
        <ExercicioActions gruposMusculares={gruposMusculares} />
      </div>

      {exercicios.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Dumbbell className="h-12 w-12 text-gray-500 mb-4" />
            <p className="text-gray-400 text-center">Nenhum exercicio cadastrado</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-red-900/20">
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Nome</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Grupo Muscular</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Equipamento</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-400">Series</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-400">Treinos</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {exercicios.map((ex) => (
                  <tr key={ex.id} className="border-b border-red-900/10 hover:bg-white/5">
                    <td className="p-4">
                      <div className="font-medium">{ex.nome}</div>
                      {ex.descricao && <div className="text-sm text-gray-400 mt-1 line-clamp-1">{ex.descricao}</div>}
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{ex.grupoMuscular}</Badge>
                    </td>
                    <td className="p-4 text-sm text-gray-400">{ex.equipamento || '-'}</td>
                    <td className="p-4 text-sm text-center">{ex._count.series}</td>
                    <td className="p-4 text-sm text-center">{ex._count.treinos}</td>
                    <td className="p-4 text-right">
                      <ExercicioActions exercicio={ex} gruposMusculares={gruposMusculares} />
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
