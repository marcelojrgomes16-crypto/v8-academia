'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Clock, Repeat, Dumbbell, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

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

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

export function ExerciseCard({ ex, idx }: { ex: ExercicioData; idx: number }) {
  const [showVideo, setShowVideo] = React.useState(false)
  const youtubeId = ex.exercicio.videoUrl ? extractYoutubeId(ex.exercicio.videoUrl) : null

  return (
    <Card className="overflow-hidden bg-[#141414] border-red-900/20">
      {ex.exercicio.imagemUrl && (
        <div className="relative">
          <img
            src={ex.exercicio.imagemUrl}
            alt={ex.exercicio.nome}
            className="w-full h-40 sm:h-56 md:h-64 object-cover"
          />
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

        {youtubeId && (
          <div>
            <button
              onClick={() => setShowVideo(!showVideo)}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-red-600/10 border border-red-600/20 text-red-400 hover:bg-red-600/20 transition-colors text-sm font-medium"
            >
              <Play className="h-4 w-4" />
              {showVideo ? 'Fechar video' : 'Ver como fazer'}
              {showVideo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showVideo && (
              <div className="mt-3 aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                  title={`Video: ${ex.exercicio.nome}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
