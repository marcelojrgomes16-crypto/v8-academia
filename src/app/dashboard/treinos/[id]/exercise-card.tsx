'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Repeat, Dumbbell, CheckCircle, ChevronDown, ChevronUp, Image } from 'lucide-react'

interface ExercicioData {
  id: string
  nome: string
  series: number
  repeticoes: string
  carga: string | null
  descanso: number | null
  exercicio: {
    nome: string
    grupoMuscular: string
    imagemUrl: string | null
    videoUrl: string | null
  }
}

export function ExerciseCard({ ex, idx }: { ex: ExercicioData; idx: number }) {
  const [showDetails, setShowDetails] = React.useState(false)
  const hasGif = ex.exercicio.imagemUrl && ex.exercicio.imagemUrl.includes('.gif')

  return (
    <Card className="overflow-hidden bg-[#141414] border-red-900/20">
      {ex.exercicio.imagemUrl && (
        <div className="relative">
          {hasGif ? (
            <img
              src={ex.exercicio.imagemUrl}
              alt={ex.exercicio.nome}
              className="w-full h-48 sm:h-64 md:h-72 object-contain bg-black"
              loading="lazy"
            />
          ) : (
            <img
              src={ex.exercicio.imagemUrl}
              alt={ex.exercicio.nome}
              className="w-full h-40 sm:h-56 md:h-64 object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute top-3 left-3">
            <Badge className="bg-red-600 text-white font-bold">{idx + 1}</Badge>
          </div>
          <div className="absolute bottom-3 left-3">
            <h3 className="font-bold text-lg sm:text-xl text-white">{ex.exercicio.nome}</h3>
            <Badge variant="outline" className="mt-1 text-xs border-white/20 text-white">
              {ex.exercicio.grupoMuscular}
            </Badge>
          </div>
        </div>
      )}

      <CardContent className="p-4 space-y-3">
        {!ex.exercicio.imagemUrl && (
          <div>
            <h3 className="font-bold text-lg text-white">{ex.exercicio.nome}</h3>
            <Badge variant="outline" className="mt-1 text-xs">{ex.exercicio.grupoMuscular}</Badge>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-lg bg-white/5">
            <Repeat className="h-4 w-4 text-gray-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{ex.series}x</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Series</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5">
            <Dumbbell className="h-4 w-4 text-gray-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{ex.repeticoes}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Reps</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5">
            <CheckCircle className="h-4 w-4 text-gray-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-red-400">{ex.carga || 'Livre'}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Carga</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5">
            <Clock className="h-4 w-4 text-gray-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{ex.descanso ? `${ex.descanso}s` : '60s'}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Descanso</p>
          </div>
        </div>

        {hasGif && (
          <div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors text-sm font-medium"
            >
              <Image className="h-4 w-4" />
              {showDetails ? 'Fechar demonstracao' : 'Ver demonstracao'}
              {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showDetails && (
              <div className="mt-3 rounded-lg overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={ex.exercicio.imagemUrl!}
                  alt={`Demonstracao: ${ex.exercicio.nome}`}
                  className="w-full max-h-80 object-contain"
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
