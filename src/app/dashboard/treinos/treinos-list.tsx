'use client'

import * as React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dumbbell, Play, Clock, Repeat, Flame, Target, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Exercicio {
  id: string
  nome: string
  series: number
  repeticoes: string
  carga: string | null
  descanso: number | null
  exercicio: {
    nome: string
    descricao: string | null
    grupoMuscular: string
    videoUrl: string | null
    imagemUrl: string | null
  }
}

interface Treino {
  id: string
  nome: string
  descricao: string | null
  status: string
  dataInicio: Date
  dataFim: Date | null
  exercicios: Exercicio[]
}

interface TreinosPageProps {
  treinos: Treino[]
  perfil: string
}

export function TreinosList({ treinos, perfil }: TreinosPageProps) {
  const [filtro, setFiltro] = React.useState('TODOS')
  const [expandido, setExpandido] = React.useState<string | null>(null)

  const treinosFiltrados = filtro === 'TODOS' ? treinos : treinos.filter(t => t.status === filtro)

  const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'info'> = {
    ATIVO: 'success',
    PAUSADO: 'warning',
    CONCLUIDO: 'info',
    CANCELADO: 'destructive',
  }

  const statusLabel: Record<string, string> = {
    ATIVO: 'Em andamento',
    PAUSADO: 'Pausado',
    CONCLUIDO: 'Concluido',
    CANCELADO: 'Cancelado',
  }

  const gruposMusculares = [...new Set(treinos.flatMap(t => t.exercicios.map(e => e.exercicio.grupoMuscular)))]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Meus Treinos</h1>
            <p className="text-gray-400 text-sm mt-1">
              {perfil === 'MASCULINO' ? 'Treinos focados em forca e massa muscular' : 'Treinos focados em tonificacao e resistencia'}
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {['TODOS', 'ATIVO', 'PAUSADO', 'CONCLUIDO'].map((f) => (
            <Button
              key={f}
              variant={filtro === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFiltro(f)}
            >
              {f === 'TODOS' ? 'Todos' : statusLabel[f] || f}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {treinosFiltrados.map((treino) => (
            <Card key={treino.id} className="hover:border-red-500/50 transition-all overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-red-600 to-red-800" />
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{treino.nome}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {treino.exercicios.length} exercicios
                    </p>
                  </div>
                  <Badge variant={statusVariant[treino.status]}>
                    {statusLabel[treino.status]}
                  </Badge>
                </div>

                {treino.descricao && (
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{treino.descricao}</p>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Dumbbell className="h-3 w-3" />
                    {treino.exercicios.length} exercicios
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {gruposMusculares.length} grupos
                  </span>
                </div>

                <Link href={`/dashboard/treinos/${treino.id}`}>
                  <Button className="w-full" variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar Treino
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {treinosFiltrados.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Dumbbell className="h-16 w-16 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">Nenhum treino encontrado</h3>
              <p className="text-gray-500 text-center max-w-md">
                Voce ainda nao possui treinos cadastrados. Fale com seu professor para criar seu primeiro treino.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
