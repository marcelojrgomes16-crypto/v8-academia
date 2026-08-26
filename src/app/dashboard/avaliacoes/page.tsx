import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatDate, getIMCClassification } from '@/lib/utils'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Ruler, Weight, Droplets, Dumbbell } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AvaliacoesPage() {
  let session
  try {
    session = await getSession()
  } catch {
    redirect('/entrar')
  }
  if (!session) redirect('/entrar')

  let avaliacoes: any[] = []
  try {
    avaliacoes = await prisma.avaliacaoFisica.findMany({
      where: { alunoId: session.user.id },
      include: { professor: { select: { nome: true } } },
      orderBy: { data: 'desc' },
    })
  } catch (e) {
    console.error('Avaliacoes query error:', e)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Avaliacoes Fisicas</h1>
          <p className="text-gray-400 text-sm mt-1">Acompanhe sua evolucao fisica</p>
        </div>

        {avaliacoes.length === 0 ? (
          <Card className="bg-[#141414] border-red-900/20">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <TrendingUp className="h-16 w-16 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">Nenhuma avaliacao registrada</h3>
              <p className="text-gray-500 text-center max-w-md">
                Agende uma avaliacao com seu professor para acompanhar seu progresso.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {avaliacoes.map((av) => {
              const imc = av.imc as number
              const classificacao = getIMCClassification(imc)

              return (
                <Card key={av.id} className="bg-[#141414] border-red-900/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        Avaliacao - {formatDate(av.data)}
                      </CardTitle>
                      {av.professor && (
                        <span className="text-sm text-gray-400">
                          Prof: {av.professor.nome}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                        <Weight className="h-5 w-5 text-red-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{(av.peso as number).toFixed(1)}</p>
                        <p className="text-xs text-gray-500">kg</p>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                        <Ruler className="h-5 w-5 text-red-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{(av.altura as number).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">m</p>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                        <TrendingUp className="h-5 w-5 text-red-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{imc.toFixed(1)}</p>
                        <p className="text-xs text-gray-500">IMC</p>
                        <Badge variant={classificacao.color === 'text-green-400' ? 'success' : 'warning'} className="text-[10px] mt-1">
                          {classificacao.label}
                        </Badge>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                        <Droplets className="h-5 w-5 text-red-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">
                          {av.percentualGordura ? `${(av.percentualGordura as number).toFixed(1)}` : '—'}
                        </p>
                        <p className="text-xs text-gray-500">% Gordura</p>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                        <Dumbbell className="h-5 w-5 text-red-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">
                          {av.massaMuscular ? `${(av.massaMuscular as number).toFixed(1)}` : '—'}
                        </p>
                        <p className="text-xs text-gray-500">kg Massa</p>
                      </div>
                    </div>

                    {av.medidas && typeof av.medidas === 'object' && (
                      <div className="mt-4 pt-4 border-t border-red-900/20">
                        <p className="text-sm text-gray-400 mb-2">Medidas Corporais:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(av.medidas as Record<string, number>).map(([key, val]) => (
                            <Badge key={key} variant="outline" className="text-xs">
                              {key}: {val}cm
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
