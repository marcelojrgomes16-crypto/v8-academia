import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings } from 'lucide-react'
import { ConfiguracaoForm } from './configuracao-form'

export const dynamic = 'force-dynamic'

export default async function ConfiguracoesPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const configuracoes = await prisma.configuracao.findMany({
    orderBy: { chave: 'asc' },
  })

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Configuracoes</h1>
          <p className="text-gray-400 text-sm mt-1">Gerencie as configuracoes do sistema</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuracoes Gerais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ConfiguracaoForm configuracoes={configuracoes} />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
