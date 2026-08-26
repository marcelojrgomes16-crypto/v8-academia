'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { WorkoutHeader } from './workout-header'
import { ExerciseViewer } from './exercise-viewer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Trophy, Clock, Dumbbell, ArrowRight } from 'lucide-react'
import Link from 'next/link'

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

interface TreinoData {
  id: string
  nome: string
  descricao: string | null
  exercicios: ExercicioData[]
}

interface WorkoutExecutionProps {
  treino: TreinoData
}

export function WorkoutExecution({ treino }: WorkoutExecutionProps) {
  const router = useRouter()
  const [currentExerciseIndex, setCurrentExerciseIndex] = React.useState(0)
  const [completedExercises, setCompletedExercises] = React.useState<Set<number>>(new Set())
  const [exerciseSeries, setExerciseSeries] = React.useState<Record<number, boolean[]>>(() => {
    const initial: Record<number, boolean[]> = {}
    treino.exercicios.forEach((ex, idx) => {
      initial[idx] = new Array(ex.series).fill(false)
    })
    return initial
  })
  const [elapsedTime, setElapsedTime] = React.useState(0)
  const [isFinished, setIsFinished] = React.useState(false)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const currentExercise = treino.exercicios[currentExerciseIndex]
  const currentSeries = exerciseSeries[currentExerciseIndex] || []
  const allSeriesCompleted = currentSeries.every(Boolean)

  const handleToggleSeries = (seriesIndex: number) => {
    setExerciseSeries((prev) => {
      const updated = { ...prev }
      const current = [...(updated[currentExerciseIndex] || [])]
      current[seriesIndex] = !current[seriesIndex]
      updated[currentExerciseIndex] = current
      return updated
    })

    if (!exerciseSeries[currentExerciseIndex]?.[seriesIndex]) {
      const newCompleted = new Set(completedExercises)
      newCompleted.add(currentExerciseIndex)
      setCompletedExercises(newCompleted)
    }
  }

  const handleNext = () => {
    if (currentExerciseIndex < treino.exercicios.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1)
    } else {
      setIsFinished(true)
    }
  }

  const handlePrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1)
    }
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) {
      return `${h}h ${m}min ${s}s`
    }
    return `${m}min ${s}s`
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-[#141414] border-red-900/20">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-green-600/20 flex items-center justify-center mx-auto">
              <Trophy className="h-10 w-10 text-green-500" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Treino Concluido!</h1>
              <p className="text-gray-400">
                Parabens! Voce completou o treino <span className="text-white font-medium">{treino.nome}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5">
                <Clock className="h-5 w-5 text-gray-500 mx-auto mb-2" />
                <p className="text-lg font-bold text-white">{formatTime(elapsedTime)}</p>
                <p className="text-xs text-gray-500">Duracao</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <Dumbbell className="h-5 w-5 text-gray-500 mx-auto mb-2" />
                <p className="text-lg font-bold text-white">{treino.exercicios.length}</p>
                <p className="text-xs text-gray-500">Exercicios</p>
              </div>
            </div>

            <div className="space-y-2">
              <Link href="/dashboard/treinos" className="block">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Voltar aos Treinos
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard" className="block">
                <Button variant="outline" className="w-full">
                  Ir para o Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-lg mx-auto p-4 sm:p-6 space-y-5">
        <WorkoutHeader
          treinoId={treino.id}
          treinoName={treino.nome}
          currentExercise={currentExerciseIndex}
          totalExercises={treino.exercicios.length}
          completedExercises={completedExercises.size}
          elapsedTime={elapsedTime}
        />

        <ExerciseViewer
          exercise={currentExercise}
          exerciseIndex={currentExerciseIndex}
          totalExercises={treino.exercicios.length}
          seriesCompleted={currentSeries}
          onToggleSeries={handleToggleSeries}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isLastExercise={currentExerciseIndex === treino.exercicios.length - 1}
          allSeriesCompleted={allSeriesCompleted}
        />

        <div className="flex gap-2 pt-2">
          {treino.exercicios.map((_, idx) => {
            const isCompleted = completedExercises.has(idx)
            const isCurrent = idx === currentExerciseIndex
            return (
              <button
                key={idx}
                onClick={() => setCurrentExerciseIndex(idx)}
                className={`h-2 flex-1 rounded-full transition-all ${
                  isCurrent
                    ? 'bg-red-500 scale-y-150'
                    : isCompleted
                    ? 'bg-green-500'
                    : 'bg-white/10'
                }`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
