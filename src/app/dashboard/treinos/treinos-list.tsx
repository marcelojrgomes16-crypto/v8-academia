'use client'

import * as React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dumbbell, Play, Star } from 'lucide-react'
import Link from 'next/link'

interface Exercicio {
  id: string
  series: number
  repeticoes: string
  carga: string | null
  exercicio: {
    nome: string
    grupoMuscular: string
    imagemUrl: string | null
  }
}

interface Treino {
  id: string
  nome: string
  descricao: string | null
  status: string
  exercicios: Exercicio[]
}

interface TreinosPageProps {
  treinos: Treino[]
  perfil: string
}

export function TreinosList({ treinos, perfil }: TreinosPageProps) {
  const [filtro, setFiltro] = React.useState('TODOS')

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Meus Treinos</h1>
          <p className="text-gray-400 text-sm mt-1">
            {perfil === 'MASCULINO' ? 'Foco em forca e massa muscular' : 'Foco em tonificacao e resistencia'}
          </p>
        </div>

        {/* Link for female workouts */}
        {perfil === 'FEMININO' && (
          <Link href="/dashboard/treinos/feminino">
            <Card className="overflow-hidden border-pink-500/30 hover:border-pink-500/50 transition-all cursor-pointer">
              <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">Treinos</h3>
                    <p className="text-white/80 text-sm">Plano semanal completo com cardio e imagens</p>
                  </div>
                  <Play className="h-5 w-5 text-white" />
                </div>
              </div>
            </Card>
          </Link>
        )}

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

        <div className="grid gap-4 sm:grid-cols-2">
          {treinosFiltrados.map((treino) => {
            const firstImg = treino.exercicios[0]?.exercicio.imagemUrl
            return (
              <Link key={treino.id} href={`/dashboard/treinos/${treino.id}`}>
                <Card className="hover:border-red-500/50 transition-all overflow-hidden cursor-pointer h-full">
                  {firstImg ? (
                    <div className="h-32 sm:h-40 relative overflow-hidden">
                      <img src={firstImg} alt={treino.nome} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-bold text-white text-lg">{treino.nome}</h3>
                        <p className="text-sm text-gray-300">{treino.exercicios.length} exercicios</p>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge variant={statusVariant[treino.status]} className="text-xs">
                          {statusLabel[treino.status]}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="h-32 bg-gradient-to-br from-red-900/40 to-[#141414] flex items-center justify-center">
                      <Dumbbell className="h-12 w-12 text-red-600/40" />
                    </div>
                  )}
                  <CardContent className="p-4">
                    {firstImg ? null : (
                      <>
                        <h3 className="font-bold text-lg">{treino.nome}</h3>
                        <p className="text-sm text-gray-400 mt-1">{treino.exercicios.length} exercicios</p>
                      </>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      {treino.exercicios.slice(0, 3).map((ex) => (
                        <span key={ex.id} className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
                          {ex.exercicio.nome}
                        </span>
                      ))}
                      {treino.exercicios.length > 3 && (
                        <span className="text-xs text-gray-500">+{treino.exercicios.length - 3}</span>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {treino.exercicios[0]?.exercicio.grupoMuscular}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-red-400 font-medium">
                        <Play className="h-3 w-3" /> Iniciar
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {treinosFiltrados.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Dumbbell className="h-16 w-16 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">Nenhum treino encontrado</h3>
              <p className="text-gray-500 text-center max-w-md text-sm">
                Fale com seu professor para criar seu primeiro treino.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
