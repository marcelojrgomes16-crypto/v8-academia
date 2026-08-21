import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCurrency } from '@/lib/utils'
import { DollarSign } from 'lucide-react'
import { ReceitaActions } from './receita-actions'

export const dynamic = 'force-dynamic'

const categorias = [
  'Mensalidade', 'Matricula', 'Personal', 'Avaliacao', 'Venda', 'Outros',
]

export default async function ReceitasPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const receitas = await prisma.receita.findMany({
    orderBy: { data: 'desc' },
  })

  const total = receitas.reduce((acc, r) => acc + r.valor, 0)

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Receitas</h1>
          <p className="text-gray-400 text-sm mt-1">Controle de receitas da academia</p>
        </div>
        <ReceitaActions categorias={categorias} />
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Total de Receitas</p>
            <p className="text-2xl font-bold text-green-400">{formatCurrency(total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Quantidade</p>
            <p className="text-2xl font-bold">{receitas.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Media</p>
            <p className="text-2xl font-bold text-blue-400">
              {receitas.length > 0 ? formatCurrency(total / receitas.length) : formatCurrency(0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {receitas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="h-12 w-12 text-gray-500 mb-4" />
            <p className="text-gray-400 text-center">Nenhuma receita registrada</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-red-900/20">
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Descricao</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Categoria</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Valor</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Data</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {receitas.map((receita) => (
                  <tr key={receita.id} className="border-b border-red-900/10 hover:bg-white/5">
                    <td className="p-4 text-sm">{receita.descricao}</td>
                    <td className="p-4">
                      <Badge variant="outline">{receita.categoria}</Badge>
                    </td>
                    <td className="p-4 text-sm text-right text-green-400 font-medium">
                      {formatCurrency(receita.valor)}
                    </td>
                    <td className="p-4 text-sm text-gray-400">{formatDate(receita.data)}</td>
                    <td className="p-4 text-right">
                      <ReceitaActions receita={receita} categorias={categorias} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </DashboardLayout>
  )
}
