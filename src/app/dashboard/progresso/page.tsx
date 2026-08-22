import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getPrisma } from '@/lib/prisma';
const prisma = getPrisma()
import { formatDate, getIMCClassification } from '@/lib/utils'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export const dynamic = 'force-dynamic'

export default async function ProgressoPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const avaliacoes = await prisma.avaliacaoFisica.findMany({
    where: { alunoId: session.user.id },
    include: {
      professor: { select: { nome: true } },
    },
    orderBy: { data: 'asc' },
  })

  const checkins = await prisma.checkin.findMany({
    where: { alunoId: session.user.id },
    orderBy: { dataHora: 'desc' },
    take: 30,
  })

  const latest = avaliacoes[avaliacoes.length - 1]
  const first = avaliacoes[0]

  const pesoDelta = latest && first ? +(latest.peso - first.peso).toFixed(1) : null
  const imcDelta = latest && first ? +(latest.imc - first.imc).toFixed(1) : null
  const gorduraDelta =
    latest?.percentualGordura != null && first?.percentualGordura != null
      ? +(latest.percentualGordura - first.percentualGordura).toFixed(1)
      : null
  const massaDelta =
    latest?.massaMuscular != null && first?.massaMuscular != null
      ? +(latest.massaMuscular - first.massaMuscular).toFixed(1)
      : null

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Meu Progresso</h1>
        <p className="text-gray-400 text-sm mt-1">
          Acompanhe sua evolução física ao longo do tempo
        </p>
      </div>

      {avaliacoes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <svg
              className="h-12 w-12 text-gray-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
              />
            </svg>
            <p className="text-gray-400 text-center">
              Nenhuma avaliação física registrada ainda.
              <br />
              Agende uma avaliação com seu professor para começar a acompanhar seu progresso.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Peso Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold">{latest.peso.toFixed(1)}</span>
                    <span className="text-gray-400 text-sm ml-1">kg</span>
                  </div>
                  {pesoDelta != null && (
                    <Badge variant={pesoDelta <= 0 ? 'success' : 'destructive'}>
                      {pesoDelta > 0 ? '+' : ''}
                      {pesoDelta} kg
                    </Badge>
                  )}
                </div>
                {first && (
                  <p className="text-xs text-gray-500 mt-1">
                    Início: {first.peso.toFixed(1)} kg ({formatDate(first.data)})
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">IMC</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold">{latest.imc.toFixed(1)}</span>
                    {(() => {
                      const { label, color } = getIMCClassification(latest.imc)
                      return <p className={`text-xs ${color}`}>{label}</p>
                    })()}
                  </div>
                  {imcDelta != null && (
                    <Badge variant={imcDelta <= 0 ? 'success' : 'destructive'}>
                      {imcDelta > 0 ? '+' : ''}
                      {imcDelta}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">% Gordura</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold">
                      {latest.percentualGordura != null ? `${latest.percentualGordura.toFixed(1)}%` : '—'}
                    </span>
                  </div>
                  {gorduraDelta != null && (
                    <Badge variant={gorduraDelta <= 0 ? 'success' : 'destructive'}>
                      {gorduraDelta > 0 ? '+' : ''}
                      {gorduraDelta}%
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Massa Muscular</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold">
                      {latest.massaMuscular != null ? `${latest.massaMuscular.toFixed(1)} kg` : '—'}
                    </span>
                  </div>
                  {massaDelta != null && (
                    <Badge variant={massaDelta >= 0 ? 'success' : 'destructive'}>
                      {massaDelta > 0 ? '+' : ''}
                      {massaDelta} kg
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Evolução ao Longo do Tempo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gym-border">
                      <th className="text-left py-3 px-2 text-gray-400 font-medium">Data</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-medium">Peso (kg)</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-medium">Altura (m)</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-medium">IMC</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-medium">% Gordura</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-medium">Massa Muscular</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-medium">Professor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {avaliacoes.map((av) => (
                      <tr key={av.id} className="border-b border-gym-border/50 hover:bg-gym-card/50">
                        <td className="py-3 px-2 font-medium">{formatDate(av.data)}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <span>{av.peso.toFixed(1)}</span>
                            <BarVisual value={av.peso} min={40} max={150} color="bg-blue-500" />
                          </div>
                        </td>
                        <td className="py-3 px-2">{av.altura.toFixed(2)}</td>
                        <td className="py-3 px-2">
                          <span className={getIMCClassification(av.imc).color}>
                            {av.imc.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          {av.percentualGordura != null ? `${av.percentualGordura.toFixed(1)}%` : '—'}
                        </td>
                        <td className="py-3 px-2">
                          {av.massaMuscular != null ? `${av.massaMuscular.toFixed(1)} kg` : '—'}
                        </td>
                        <td className="py-3 px-2 text-gray-400">{av.professor.nome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {latest?.medidas && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Medidas Corporais (Última Avaliação)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(latest.medidas as Record<string, number>).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between rounded-lg border border-gym-border p-3">
                      <span className="text-gray-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-medium">{typeof value === 'number' ? `${value} cm` : value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          {checkins.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Nenhum check-in registrado ainda.</p>
          ) : (
            <div className="space-y-2">
              {checkins.map((checkin) => (
                <div
                  key={checkin.id}
                  className="flex items-center justify-between rounded-lg border border-gym-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600/20">
                      <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{checkin.tipo === 'ENTRADA' ? 'Check-in' : 'Check-out'}</p>
                      <p className="text-xs text-gray-400">
                        {formatDate(checkin.dataHora, { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <Badge variant={checkin.tipo === 'ENTRADA' ? 'success' : 'secondary'}>
                    {checkin.tipo}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

function BarVisual({ value, min, max, color }: { value: number; min: number; max: number; color: string }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  return (
    <div className="h-1.5 w-16 rounded-full bg-gym-border overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}
