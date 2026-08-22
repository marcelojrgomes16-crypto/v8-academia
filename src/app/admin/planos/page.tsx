import { prisma } from '@/lib/prisma';
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { ClipboardList, Plus } from 'lucide-react'
import Link from 'next/link'
import { PlanoActions } from './plano-actions'

export const dynamic = 'force-dynamic'

export default async function PlanosPage() {

  const planos = await prisma.plano.findMany({
    include: { _count: { select: { alunos: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Planos</h1>
          <p className="text-gray-400 text-sm mt-1">
            Gerencie os planos da academia
          </p>
        </div>
        <PlanoActions />
      </div>

      {planos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="h-12 w-12 text-gray-500 mb-4" />
            <p className="text-gray-400 text-center">Nenhum plano cadastrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {planos.map((plano) => (
            <Card key={plano.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">{plano.nome}</h3>
                  <Badge variant={plano.ativo ? 'success' : 'warning'}>
                    {plano.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                {plano.descricao && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{plano.descricao}</p>
                )}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Preço</span>
                    <span className="font-medium text-red-400">{formatCurrency(plano.preco)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duração</span>
                    <span>{plano.duracaoDias} dias</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Alunos</span>
                    <span>{plano._count.alunos}</span>
                  </div>
                </div>
                {Array.isArray(plano.features) && plano.features.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-red-900/20">
                    <div className="flex flex-wrap gap-1">
                      {(plano.features as string[]).slice(0, 3).map((f, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                      ))}
                      {(plano.features as string[]).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{(plano.features as string[]).length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                <div className="mt-4 pt-3 border-t border-red-900/20 flex gap-2">
                  <PlanoActions plano={plano} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
