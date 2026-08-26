'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { WorkoutTimer } from './workout-timer'
import { SeriesTracker } from './series-tracker'
import {
  Clock,
  Repeat,
  Dumbbell,
  Weight,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Video,
} from 'lucide-react'

interface ExercicioData {
  id: string
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

interface ExerciseViewerProps {
  exercise: ExercicioData
  exerciseIndex: number
  totalExercises: number
  seriesCompleted: boolean[]
  onToggleSeries: (seriesIndex: number) => void
  onNext: () => void
  onPrevious: () => void
  isLastExercise: boolean
  allSeriesCompleted: boolean
}

export function ExerciseViewer({
  exercise,
  exerciseIndex,
  totalExercises,
  seriesCompleted,
  onToggleSeries,
  onNext,
  onPrevious,
  isLastExercise,
  allSeriesCompleted,
}: ExerciseViewerProps) {
  const [showTimer, setShowTimer] = React.useState(false)
  const completedCount = seriesCompleted.filter(Boolean).length
  const restDuration = exercise.descanso || 60
  const hasGif = exercise.exercicio.imagemUrl && exercise.exercicio.imagemUrl.includes('.gif')

  const handleSeriesToggle = (index: number) => {
    onToggleSeries(index)

    if (!seriesCompleted[index]) {
      setShowTimer(true)
    }
  }

  const handleTimerComplete = () => {
    setShowTimer(false)
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {exercise.exercicio.imagemUrl && (
        <div className="relative rounded-2xl overflow-hidden bg-black">
          {hasGif ? (
            <img
              src={exercise.exercicio.imagemUrl}
              alt={exercise.exercicio.nome}
              className="w-full h-56 sm:h-72 md:h-80 object-contain"
            />
          ) : (
            <img
              src={exercise.exercicio.imagemUrl}
              alt={exercise.exercicio.nome}
              className="w-full h-48 sm:h-64 md:h-72 object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute top-3 left-3">
            <Badge className="bg-red-600 text-white font-bold">
              {exerciseIndex + 1}/{totalExercises}
            </Badge>
          </div>
          {exercise.exercicio.videoUrl && (
            <a
              href={exercise.exercicio.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 right-3"
            >
              <Button size="sm" variant="secondary" className="gap-1.5">
                <Video className="h-3.5 w-3.5" />
                Video
              </Button>
            </a>
          )}
          <div className="absolute bottom-3 left-3 right-3">
            <h2 className="font-bold text-xl sm:text-2xl text-white">
              {exercise.exercicio.nome}
            </h2>
            <Badge variant="outline" className="mt-1 text-xs border-white/20 text-white">
              {exercise.exercicio.grupoMuscular}
            </Badge>
          </div>
        </div>
      )}

      <Card className="bg-[#141414] border-red-900/20">
        <CardContent className="p-4 space-y-4">
          {!exercise.exercicio.imagemUrl && (
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-600 text-white font-bold">
                  {exerciseIndex + 1}/{totalExercises}
                </Badge>
              </div>
              <h2 className="font-bold text-xl text-white mt-2">
                {exercise.exercicio.nome}
              </h2>
              <Badge variant="outline" className="mt-1 text-xs">
                {exercise.exercicio.grupoMuscular}
              </Badge>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-white/5">
              <Repeat className="h-4 w-4 text-gray-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{exercise.series}x</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Series</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5">
              <Dumbbell className="h-4 w-4 text-gray-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{exercise.repeticoes}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Reps</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5">
              <Weight className="h-4 w-4 text-gray-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-red-400">{exercise.carga || 'Livre'}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Carga</p>
            </div>
          </div>

          <SeriesTracker
            totalSeries={exercise.series}
            completedSeries={completedCount}
            onToggle={handleSeriesToggle}
            seriesCompleted={seriesCompleted}
          />
        </CardContent>
      </Card>

      {showTimer && (
        <Card className="bg-[#141414] border-red-900/20">
          <CardContent className="p-6">
            <p className="text-center text-sm text-gray-400 mb-4">
              Descanso entre series ({restDuration}s)
            </p>
            <WorkoutTimer
              duration={restDuration}
              onComplete={handleTimerComplete}
              autoStart
            />
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={exerciseIndex === 0}
          className="flex-1"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>

        {allSeriesCompleted && (
          <Button
            onClick={onNext}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {isLastExercise ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                Finalizar
              </>
            ) : (
              <>
                Proximo
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
