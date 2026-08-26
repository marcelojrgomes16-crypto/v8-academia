'use client'

import * as React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Dumbbell, Heart, Clock, Flame, ChevronRight, 
  ChevronLeft, Play, RotateCcw, Star, Zap
} from 'lucide-react'

interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  rest: string
  image: string
  muscle: string
  tips?: string
}

interface WorkoutDay {
  id: string
  day: string
  dayShort: string
  title: string
  focus: string
  color: string
  icon: React.ReactNode
  duration: string
  calories: string
  exercises: Exercise[]
}

const W = 'https://wger.de/media/exercise-images'
const workoutData: WorkoutDay[] = [
  {
    id: 'segunda',
    day: 'Segunda-feira',
    dayShort: 'SEG',
    title: 'Treino A - Gluteos e Posterior',
    focus: 'Foco: Gluteos, Isquiotibiais e Lombar',
    color: 'from-pink-600 to-rose-600',
    icon: <Flame className="h-5 w-5" />,
    duration: '45-50 min',
    calories: '300-350 kcal',
    exercises: [
      {
        id: 'a1',
        name: 'Agachamento Sumo',
        sets: 4,
        reps: '12-15',
        rest: '60s',
        image: `${W}/191/Front-squat-1-857x1024.png`,
        muscle: 'Gluteos, Adutores',
        tips: 'Mantenha as costas retas e joelhos alinhados com os pes'
      },
      {
        id: 'a2',
        name: 'Hip Thrust',
        sets: 4,
        reps: '12-15',
        rest: '60s',
        image: `${W}/161/Dead-lifts-2.png`,
        muscle: 'Gluteos',
        tips: 'Empurre os quadris para cima e contraia os gluteos no topo'
      },
      {
        id: 'a3',
        name: 'Stiff',
        sets: 4,
        reps: '10-12',
        rest: '60s',
        image: `${W}/161/Dead-lifts-1.png`,
        muscle: 'Posterior, Lombar',
        tips: 'Mantenha leve flexao nos joelhos e desca devagar'
      },
      {
        id: 'a4',
        name: 'Abducao de Quadril',
        sets: 3,
        reps: '15-20',
        rest: '45s',
        image: `${W}/148/lateral-dumbbell-raises-large-1.png`,
        muscle: 'Gluteo Medio',
        tips: 'Controle o movimento e nao Use impulso'
      },
      {
        id: 'a5',
        name: 'Elevacao Palanca',
        sets: 3,
        reps: '12-15',
        rest: '45s',
        image: `${W}/128/Hyperextensions-1.png`,
        muscle: 'Gluteos, Abdomen',
        tips: 'Contraia o abdome no topo do movimento'
      },
      {
        id: 'a6',
        name: 'Cable Pull Through',
        sets: 3,
        reps: '15',
        rest: '45s',
        image: `${W}/109/Barbell-rear-delt-row-1.png`,
        muscle: 'Posterior, Gluteos',
        tips: 'Mantenha os bracos esticados e mova os quadris'
      }
    ]
  },
  {
    id: 'terca',
    day: 'Terca-feira',
    dayShort: 'TER',
    title: 'Treino B - Superiores e Core',
    focus: 'Foco: Peito, Ombros, Triceps e Abdomen',
    color: 'from-purple-600 to-violet-600',
    icon: <Dumbbell className="h-5 w-5" />,
    duration: '40-45 min',
    calories: '250-300 kcal',
    exercises: [
      {
        id: 'b1',
        name: 'Supino com Halteres',
        sets: 4,
        reps: '12-15',
        rest: '60s',
        image: `${W}/97/Dumbbell-bench-press-1.png`,
        muscle: 'Peito, Triceps',
        tips: 'Desca os halteres devagar e empurre com controle'
      },
      {
        id: 'b2',
        name: 'Desenvolvimento com Halteres',
        sets: 4,
        reps: '12-15',
        rest: '60s',
        image: `${W}/123/dumbbell-shoulder-press-large-1.png`,
        muscle: 'Ombros, Trapezio',
        tips: 'Nao travar os cotovelos no topo'
      },
      {
        id: 'b3',
        name: 'Crucifixo na Maquina',
        sets: 3,
        reps: '12-15',
        rest: '45s',
        image: `${W}/98/Butterfly-machine-1.png`,
        muscle: 'Peito',
        tips: 'Mantenha leve flexao nos cotovelos'
      },
      {
        id: 'b4',
        name: 'Triceps Pulley',
        sets: 3,
        reps: '12-15',
        rest: '45s',
        image: `${W}/83/Bench-dips-1.png`,
        muscle: 'Triceps',
        tips: 'Mantenha os cotovelos fixos ao lado do corpo'
      },
      {
        id: 'b5',
        name: 'Prancha Abdominal',
        sets: 3,
        reps: '30-45s',
        rest: '45s',
        image: `${W}/91/Crunches-1.png`,
        muscle: 'Core, Abdomen',
        tips: 'Mantenha o corpo reto como uma tabua'
      },
      {
        id: 'b6',
        name: 'Russian Twist',
        sets: 3,
        reps: '20 (10 cada lado)',
        rest: '45s',
        image: `${W}/176/Cross-body-crunch-1.png`,
        muscle: 'Obliquos, Abdomen',
        tips: 'Gire o tronco completamente'
      }
    ]
  },
  {
    id: 'quarta',
    day: 'Quarta-feira',
    dayShort: 'QUA',
    title: 'Treino C - Cardio e Abdome',
    focus: 'Foco: Queima de gordura e Core',
    color: 'from-orange-500 to-amber-500',
    icon: <Heart className="h-5 w-5" />,
    duration: '40-50 min',
    calories: '350-450 kcal',
    exercises: [
      {
        id: 'c1',
        name: 'Burpees',
        sets: 4,
        reps: '10-12',
        rest: '45s',
        image: `${W}/113/Walking-lunges-1.png`,
        muscle: 'Corpo todo',
        tips: 'Pise para frente ao inves de pular se estiver iniciando'
      },
      {
        id: 'c2',
        name: 'Mountain Climber',
        sets: 4,
        reps: '20 (10 cada lado)',
        rest: '45s',
        image: `${W}/93/Decline-crunch-1.png`,
        muscle: 'Core, Cardio',
        tips: 'Mantenha o quadril baixo e o ritmo alto'
      },
      {
        id: 'c3',
        name: 'Jumping Jack',
        sets: 4,
        reps: '30s',
        rest: '30s',
        image: `${W}/91/Crunches-2.png`,
        muscle: 'Cardio, Pernas',
        tips: 'Mantenha o ritmo constante'
      },
      {
        id: 'c4',
        name: 'Bicicleta no Ar',
        sets: 3,
        reps: '20 (10 cada lado)',
        rest: '45s',
        image: `${W}/176/Cross-body-crunch-2.png`,
        muscle: 'Abdomen, Obliquos',
        tips: 'Encoste o cotovelo no joelho oposto'
      },
      {
        id: 'c5',
        name: 'Elevacao de Pernas',
        sets: 3,
        reps: '15',
        rest: '45s',
        image: `${W}/125/Leg-raises-1.png`,
        muscle: 'Abdomen Inferior',
        tips: 'Controle a descida para ativar mais o abdome'
      },
      {
        id: 'c6',
        name: 'High Knees',
        sets: 4,
        reps: '30s',
        rest: '30s',
        image: `${W}/113/Walking-lunges-2.png`,
        muscle: 'Cardio, Pernas',
        tips: 'Leve os joelhos ao peito rapidamente'
      }
    ]
  },
  {
    id: 'quinta',
    day: 'Quinta-feira',
    dayShort: 'QUI',
    title: 'Treino D - Gluteos e Pernas',
    focus: 'Foco: Quadriceps, Gluteos e Panturrilhas',
    color: 'from-red-500 to-pink-600',
    icon: <Zap className="h-5 w-5" />,
    duration: '45-50 min',
    calories: '300-350 kcal',
    exercises: [
      {
        id: 'd1',
        name: 'Agachamento Livre',
        sets: 4,
        reps: '12-15',
        rest: '60s',
        image: `${W}/191/Front-squat-2-857x1024.png`,
        muscle: 'Quadriceps, Gluteos',
        tips: 'Desca ate paralelo e mantenha o peito aberto'
      },
      {
        id: 'd2',
        name: 'Leg Press 45',
        sets: 4,
        reps: '12-15',
        rest: '60s',
        image: `${W}/130/Narrow-stance-hack-squats-1-1024x721.png`,
        muscle: 'Quadriceps, Gluteos',
        tips: 'Nao trave os joelhos no topo'
      },
      {
        id: 'd3',
        name: 'Bulgarian Split Squat',
        sets: 3,
        reps: '12 cada perna',
        rest: '60s',
        image: `${W}/113/Walking-lunges-3.png`,
        muscle: 'Quadriceps, Gluteos',
        tips: 'Mantenha o tronco ereto e desca devagar'
      },
      {
        id: 'd4',
        name: 'Cadeira Flexora',
        sets: 3,
        reps: '12-15',
        rest: '45s',
        image: `${W}/154/lying-leg-curl-machine-large-1.png`,
        muscle: 'Posterior, Isquiotibiais',
        tips: 'Controle o movimento nas duas fases'
      },
      {
        id: 'd5',
        name: 'Abducao na Maquina',
        sets: 3,
        reps: '15-20',
        rest: '45s',
        image: `${W}/148/lateral-dumbbell-raises-large-2.png`,
        muscle: 'Gluteo Medio',
        tips: 'Foque na contracao no topo'
      },
      {
        id: 'd6',
        name: 'Elevacao de Panturrilha',
        sets: 4,
        reps: '15-20',
        rest: '45s',
        image: `${W}/119/seated-barbell-shoulder-press-large-1.png`,
        muscle: 'Panturrilhas',
        tips: 'Suba totalmente e desca devagar'
      }
    ]
  },
  {
    id: 'sexta',
    day: 'Sexta-feira',
    dayShort: 'SEX',
    title: 'Treino E - Costas e Biceps',
    focus: 'Foco: Costas, Trapezio e Biceps',
    color: 'from-blue-600 to-cyan-600',
    icon: <Dumbbell className="h-5 w-5" />,
    duration: '40-45 min',
    calories: '250-300 kcal',
    exercises: [
      {
        id: 'e1',
        name: 'Puxada Frontal',
        sets: 4,
        reps: '12-15',
        rest: '60s',
        image: `${W}/143/Cable-seated-rows-1.png`,
        muscle: 'Costas, Biceps',
        tips: 'Puxe ate o peito e contraia as escapulas'
      },
      {
        id: 'e2',
        name: 'Remada Curvada',
        sets: 4,
        reps: '10-12',
        rest: '60s',
        image: `${W}/106/T-bar-row-1.png`,
        muscle: 'Costas, Trapezio',
        tips: 'Mantenha as costas retas e puxe com os cotovelos'
      },
      {
        id: 'e3',
        name: 'Remada Unilateral',
        sets: 3,
        reps: '12 cada lado',
        rest: '45s',
        image: `${W}/143/Cable-seated-rows-2.png`,
        muscle: 'Costas, Core',
        tips: 'Nao gire o tronco, mantenha estavel'
      },
      {
        id: 'e4',
        name: 'Face Pull',
        sets: 3,
        reps: '15',
        rest: '45s',
        image: `${W}/109/Barbell-rear-delt-row-2.png`,
        muscle: 'Posterior Ombro, Trapezio',
        tips: 'Puxe ate a altura dos olhos e contraia'
      },
      {
        id: 'e5',
        name: 'Rosca Direta com Halteres',
        sets: 3,
        reps: '12-15',
        rest: '45s',
        image: `${W}/81/Biceps-curl-1.png`,
        muscle: 'Biceps',
        tips: 'Nao balance o corpo, mantenha os cotovelos fixos'
      },
      {
        id: 'e6',
        name: 'Rosca Martelo',
        sets: 3,
        reps: '12-15',
        rest: '45s',
        image: `${W}/86/Bicep-hammer-curl-1.png`,
        muscle: 'Biceps, Antebraco',
        tips: 'Mantenha os punhos neutros'
      }
    ]
  },
  {
    id: 'sabado',
    day: 'Sabado',
    dayShort: 'SAB',
    title: 'Treino F - Cardio HIIT e Full Body',
    focus: 'Foco: Circuito completo e queima de calorias',
    color: 'from-emerald-500 to-teal-500',
    icon: <Heart className="h-5 w-5" />,
    duration: '35-40 min',
    calories: '400-500 kcal',
    exercises: [
      {
        id: 'f1',
        name: 'Squat Jump',
        sets: 4,
        reps: '12',
        rest: '30s',
        image: `${W}/191/Front-squat-1-857x1024.png`,
        muscle: 'Pernas, Cardio',
        tips: 'Aterrisse suavemente e pule o mais alto possivel'
      },
      {
        id: 'f2',
        name: 'Flexao de Bracos',
        sets: 3,
        reps: '10-12',
        rest: '45s',
        image: `${W}/192/Bench-press-1.png`,
        muscle: 'Peito, Triceps, Core',
        tips: 'Use os joelhos no chao se precisar de apoio'
      },
      {
        id: 'f3',
        name: 'Lunges com Salto',
        sets: 4,
        reps: '10 cada perna',
        rest: '45s',
        image: `${W}/113/Walking-lunges-4.png`,
        muscle: 'Pernas, Gluteos',
        tips: 'Troque as pernas no ar com controle'
      },
      {
        id: 'f4',
        name: 'Plank com Rotacao',
        sets: 3,
        reps: '10 cada lado',
        rest: '45s',
        image: `${W}/128/Hyperextensions-2.png`,
        muscle: 'Core, Obliquos',
        tips: 'Gire o tronco e leve o braco ao teto'
      },
      {
        id: 'f5',
        name: 'Thruster com Halteres',
        sets: 4,
        reps: '12',
        rest: '45s',
        image: `${W}/53/Shoulder-press-machine-1.png`,
        muscle: 'Corpo todo',
        tips: 'Use a forca das pernas para empurrar os halteres'
      },
      {
        id: 'f6',
        name: 'Battle Ropes',
        sets: 4,
        reps: '30s',
        rest: '30s',
        image: `${W}/110/Reverse-grip-bent-over-rows-1.png`,
        muscle: 'Bracos, Core, Cardio',
        tips: 'Alterne os bracos rapidamente e mantenha o core firme'
      }
    ]
  }
]

export default function FemininoTreinosPage() {
  const [selectedDay, setSelectedDay] = React.useState<string>('segunda')
  const [expandedExercise, setExpandedExercise] = React.useState<string | null>(null)
  const [completedExercises, setCompletedExercises] = React.useState<Set<string>>(new Set())
  const [workoutActive, setWorkoutActive] = React.useState(false)

  React.useEffect(() => {
    const saved = localStorage.getItem('v8-treino-progress')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setCompletedExercises(new Set(data.completed || []))
        if (data.activeDay) setSelectedDay(data.activeDay)
        if (data.active) setWorkoutActive(true)
      } catch {}
    }
  }, [])

  React.useEffect(() => {
    localStorage.setItem('v8-treino-progress', JSON.stringify({
      completed: Array.from(completedExercises),
      activeDay: selectedDay,
      active: workoutActive,
    }))
  }, [completedExercises, selectedDay, workoutActive])

  const currentDay = workoutData.find(d => d.id === selectedDay)
  const currentDayIndex = workoutData.findIndex(d => d.id === selectedDay)

  const toggleExercise = (exerciseId: string) => {
    setCompletedExercises(prev => {
      const newSet = new Set(prev)
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId)
      } else {
        newSet.add(exerciseId)
      }
      return newSet
    })
  }

  const nextDay = () => {
    if (currentDayIndex < workoutData.length - 1) {
      setSelectedDay(workoutData[currentDayIndex + 1].id)
      setExpandedExercise(null)
    }
  }

  const prevDay = () => {
    if (currentDayIndex > 0) {
      setSelectedDay(workoutData[currentDayIndex - 1].id)
      setExpandedExercise(null)
    }
  }

  const completedCount = currentDay?.exercises.filter(e => completedExercises.has(e.id)).length || 0
  const totalCount = currentDay?.exercises.length || 0
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
  const allDaysCompleted = workoutData.every(day => {
    const dayCompleted = day.exercises.filter(e => completedExercises.has(e.id)).length
    return dayCompleted === day.exercises.length
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Treinos</h1>
            <p className="text-gray-400 text-sm mt-1">Plano semanal completo com cardio</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-gray-400">
                {completedExercises.size} exercicios concluidos
              </span>
            </div>
            <Button
              variant={workoutActive ? 'destructive' : 'default'}
              size="sm"
              onClick={() => setWorkoutActive(!workoutActive)}
              className={`font-bold ${workoutActive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
              }`}
            >
              {workoutActive ? 'Parar Treino' : 'Iniciar Treino'}
            </Button>
          </div>
        </div>

        {/* Day Selector - Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {workoutData.map((day) => (
            <Button
              key={day.id}
              variant={selectedDay === day.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedDay(day.id)
                setExpandedExercise(null)
              }}
              className={`min-w-[60px] flex-shrink-0 ${
                selectedDay === day.id 
                  ? 'bg-gradient-to-r ' + day.color + ' text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {day.dayShort}
            </Button>
          ))}
        </div>

        {/* Current Day Card */}
        {currentDay && (
          <Card className="overflow-hidden border-0">
            <div className={`bg-gradient-to-r ${currentDay.color} p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                    {currentDay.icon}
                    <span>{currentDay.day}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{currentDay.title}</h2>
                  <p className="text-white/70 text-sm mt-1">{currentDay.focus}</p>
                </div>
                <div className="text-right text-white">
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4" />
                    {currentDay.duration}
                  </div>
                  <div className="flex items-center gap-1 text-sm mt-1">
                    <Flame className="h-4 w-4" />
                    {currentDay.calories}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Progresso</span>
                  <span>{completedCount}/{totalCount}</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between p-4 bg-[#1a1a2e]">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevDay}
                disabled={currentDayIndex === 0}
                className="text-gray-400 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              <span className="text-sm text-gray-500">
                {currentDayIndex + 1} de {workoutData.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextDay}
                disabled={currentDayIndex === workoutData.length - 1}
                className="text-gray-400 hover:text-white"
              >
                Proximo
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </Card>
        )}

        {/* Exercise List */}
        <div className="space-y-3">
          {currentDay?.exercises.map((exercise, index) => {
            const isExpanded = expandedExercise === exercise.id
            const isCompleted = completedExercises.has(exercise.id)

            return (
              <Card 
                key={exercise.id}
                className={`overflow-hidden transition-all duration-300 ${
                  isCompleted ? 'border-green-500/50 bg-green-500/5' : 'border-white/10'
                }`}
              >
                <div className="flex items-stretch">
                  {/* Exercise Number */}
                  <div className={`w-12 flex-shrink-0 flex items-center justify-center font-bold text-lg ${
                    isCompleted ? 'text-green-500' : 'text-gray-600'
                  }`}>
                    {isCompleted ? '✓' : index + 1}
                  </div>

                  {/* Exercise Image */}
                  <div className="w-24 h-24 flex-shrink-0 relative overflow-hidden bg-black/20">
                    <img
                      src={exercise.image}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23222" width="100" height="100"/><text fill="%23666" font-size="12" x="50" y="50" text-anchor="middle" dy=".3em">GIF</text></svg>'
                      }}
                    />
                  </div>

                  {/* Exercise Info */}
                  <div className="flex-1 p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white text-sm">{exercise.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{exercise.muscle}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-white"
                        onClick={() => setExpandedExercise(isExpanded ? null : exercise.id)}
                      >
                        <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </Button>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 mt-2">
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Series</div>
                        <div className="text-sm font-medium text-white">{exercise.sets}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Reps</div>
                        <div className="text-sm font-medium text-white">{exercise.reps}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Descanso</div>
                        <div className="text-sm font-medium text-white">{exercise.rest}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    {/* Exercise GIF Demo */}
                    <div className="relative rounded-lg overflow-hidden bg-black/30 aspect-video">
                      <img
                        src={exercise.image}
                        alt={`${exercise.name} demonstracao`}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-black/70 text-white text-xs">
                          Demonstracao
                        </Badge>
                      </div>
                    </div>

                    {/* Tips */}
                    {exercise.tips && (
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-gray-400">
                          <span className="text-yellow-500 font-medium">Dica: </span>
                          {exercise.tips}
                        </p>
                      </div>
                    )}

                    {/* Complete Button */}
                    <Button
                      variant={isCompleted ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => toggleExercise(exercise.id)}
                      className={`w-full ${
                        isCompleted 
                          ? 'border-green-500 text-green-500 hover:bg-green-500/10'
                          : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Desfazer
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Concluir Exercicio
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* Weekly Summary */}
        <Card className="border-white/10">
          <CardContent className="p-4">
            <h3 className="font-semibold text-white mb-3">Resumo Semanal</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-pink-500">6</div>
                <div className="text-xs text-gray-500">Treinos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-500">36</div>
                <div className="text-xs text-gray-500">Exercicios</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">~2000</div>
                <div className="text-xs text-gray-500">kcal/semana</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
