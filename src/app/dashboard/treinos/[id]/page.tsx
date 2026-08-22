import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
            <p className="text-gray-400 text-sm mt-1">
              {treino.exercicios.length} exercicios &bull; Professor: {treino.professor?.nome || 'Nao atribuido'}
            </p>
          </div>
        </div>

        {treino.descricao && (
          <Card className="bg-[#141414] border-red-900/20">
            <CardContent className="p-4">
              <p className="text-gray-300">{treino.descricao}</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {treino.exercicios.map((ex, idx) => (
            <Card key={ex.id} className="bg-[#141414] border-red-900/20 overflow-hidden hover:border-red-900/40 transition-colors">
              <div className="flex flex-col md:flex-row">
                {ex.exercicio.imagemUrl && (
                  <div className="md:w-64 h-48 md:h-auto relative bg-gray-900">
                    <img
                      src={ex.exercicio.imagemUrl}
                      alt={ex.exercicio.nome}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-red-600 text-white text-xs font-bold">
                        {idx + 1}
                      </Badge>
                    </div>
                    {ex.exercicio.videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                        <a
                          href={ex.exercicio.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-14 w-14 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors"
                        >
                          <Play className="h-6 w-6 text-white ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <CardContent className="flex-1 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-white">{ex.exercicio.nome}</h3>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {ex.exercicio.grupoMuscular}
                      </Badge>
                    </div>
                    {!ex.exercicio.imagemUrl && ex.exercicio.videoUrl && (
                      <a
                        href={ex.exercicio.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-10 w-10 rounded-full bg-red-600/20 flex items-center justify-center hover:bg-red-600/30 transition-colors"
                      >
                        <Play className="h-5 w-5 text-red-400 ml-0.5" />
                      </a>
                    )}
                  </div>

                  {ex.exercicio.descricao && (
                    <p className="text-sm text-gray-400 mb-4">{ex.exercicio.descricao}</p>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                        <Repeat className="h-3 w-3" />
                        Series
                      </div>
                      <p className="text-lg font-bold text-white">{ex.series}x</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                        <Dumbbell className="h-3 w-3" />
                        Repeticoes
                      </div>
                      <p className="text-lg font-bold text-white">{ex.repeticoes}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                        <CheckCircle className="h-3 w-3" />
                        Carga
                      </div>
                      <p className="text-lg font-bold text-white">{ex.carga || 'Livre'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                        <Clock className="h-3 w-3" />
                        Descanso
                      </div>
                      <p className="text-lg font-bold text-white">{ex.descanso ? `${ex.descanso}s` : '60s'}</p>
                    </div>
                  </div>

                  {ex.exercicio.equipamento && (
                    <p className="text-xs text-gray-500 mt-3">
                      Equipamento: <span className="text-gray-400">{ex.exercicio.equipamento}</span>
                    </p>
                  )}
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
