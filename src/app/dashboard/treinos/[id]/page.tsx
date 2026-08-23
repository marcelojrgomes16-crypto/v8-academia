import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Play, Clock, Repeat, Dumbbell, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function TreinoDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const treino = await prisma.treino.findFirst({
    where: { id: params.id, alunoId: session.user.id },
    include: {
      exercicios: {
        include: { exercicio: true },
        orderBy: { ordem: 'asc' },
      },
      professor: {
        select: { nome: true },
      },
    },
  })

  if (!treino) redirect('/dashboard/treinos')

  const totalSeries = treino.exercicios.reduce((acc, e) => acc + e.series, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/treinos">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{treino.nome}</h1>
            <p className="text-gray-400 text-sm">
              {treino.exercicios.length} exercicios &bull; {totalSeries} series totais
              {treino.professor?.nome && ` \u2022 Prof. ${treino.professor.nome}`}
            </p>
          </div>
        </div>

        {treino.descricao && (
          <p className="text-gray-400 text-sm">{treino.descricao}</p>
        )}

        <div className="space-y-4">
          {treino.exercicios.map((ex, idx) => (
            <Card key={ex.id} className="overflow-hidden bg-[#141414] border-red-900/20">
              {ex.exercicio.imagemUrl && (
                <div className="relative">
                  <img
                    src={ex.exercicio.imagemUrl}
                    alt={ex.exercicio.nome}
                    className="w-full h-56 sm:h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-red-600 text-white font-bold">{idx + 1}</Badge>
                  </div>
                  {ex.exercicio.videoUrl && (
                    <a
                      href={ex.exercicio.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center group"
                    >
                      <div className="h-16 w-16 rounded-full bg-red-600/90 flex items-center justify-center group-hover:bg-red-600 transition-all group-hover:scale-110">
                        <Play className="h-7 w-7 text-white ml-1" />
                      </div>
                      <span className="absolute bottom-4 right-4 text-xs text-white bg-black/60 px-2 py-1 rounded">
                        Ver video
                      </span>
                    </a>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <h3 className="font-bold text-xl text-white">{ex.exercicio.nome}</h3>
                    <Badge variant="outline" className="mt-1 text-xs border-white/20 text-white">
                      {ex.exercicio.grupoMuscular}
                    </Badge>
                  </div>
                </div>
              )}

              <CardContent className="p-4 space-y-4">
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

                {ex.exercicio.videoUrl && !ex.exercicio.imagemUrl && (
                  <a
                    href={ex.exercicio.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 rounded-lg bg-red-600/10 border border-red-600/20 text-red-400 hover:bg-red-600/20 transition-colors text-sm font-medium"
                  >
                    <Play className="h-4 w-4" />
                    Assistir video demonstrativo
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
