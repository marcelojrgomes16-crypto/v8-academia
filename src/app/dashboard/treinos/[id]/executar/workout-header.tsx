'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, X, Timer, Flame } from 'lucide-react'
import Link from 'next/link'

interface WorkoutHeaderProps {
  treinoId: string
  treinoName: string
  currentExercise: number
  totalExercises: number
  completedExercises: number
  elapsedTime: number
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function WorkoutHeader({
  treinoId,
  treinoName,
  currentExercise,
  totalExercises,
  completedExercises,
  elapsedTime,
}: WorkoutHeaderProps) {
  const progress = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Link href={`/dashboard/treinos/${treinoId}`}>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <X className="h-4 w-4" />
            Sair
          </Button>
        </Link>

        <div className="flex items-center gap-3 text-sm text-gray-400">
          <div className="flex items-center gap-1.5">
            <Timer className="h-3.5 w-3.5" />
            <span className="tabular-nums">{formatTime(elapsedTime)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-red-400" />
            <span className="tabular-nums">
              {completedExercises}/{totalExercises}
            </span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <h1 className="text-sm font-medium text-white truncate">{treinoName}</h1>
          <span className="text-xs text-gray-500 tabular-nums ml-2">
            Exercicio {currentExercise + 1} de {totalExercises}
          </span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
