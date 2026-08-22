import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getPrisma } from '@/lib/prisma';
const prisma = getPrisma()
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Wallet } from 'lucide-react'
import { DespesaActions } from './despesa-actions'

export const dynamic = 'force-dynamic'

const categorias = [
  'Aluguel', 'Energia', 'Agua', 'Funcionarios', 'Equipamentos', 'Manutencao', 'Marketing', 'Impostos', 'Outros',
]

export default async function DespesasPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const despesas = await prisma.despesa.findMany({
    orderBy: { data: 'desc' },
  })

  const total = despesas.reduce((acc, d) => acc + d.valor, 0)

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Despesas</h1>
          <p className="text-gray-400 text-sm mt-1">Controle de despesas da academia</p>
        </div>
        <DespesaActions categorias={categorias} />
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Total de Despesas</p>
            <p className="text-2xl font-bold text-red-400">{formatCurrency(total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Quantidade</p>
            <p className="text-2xl font-bold">{despesas.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Media</p>
            <p className="text-2xl font-bold text-yellow-400">
              {despesas.length > 0 ? formatCurrency(total / despesas.length) : formatCurrency(0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {despesas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wallet className="h-12 w-12 text-gray-500 mb-4" />
            <p className="text-gray-400 text-center">Nenhuma despesa registrada</p>
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
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Fornecedor</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Valor</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Data</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {despesas.map((despesa) => (
                  <tr key={despesa.id} className="border-b border-red-900/10 hover:bg-white/5">
                    <td className="p-4 text-sm">{despesa.descricao}</td>
                    <td className="p-4">
                      <Badge variant="outline">{despesa.categoria}</Badge>
                    </td>
                    <td className="p-4 text-sm text-gray-400">{despesa.fornecedor || '-'}</td>
                    <td className="p-4 text-sm text-right text-red-400 font-medium">
                      {formatCurrency(despesa.valor)}
                    </td>
                    <td className="p-4 text-sm text-gray-400">{formatDate(despesa.data)}</td>
                    <td className="p-4 text-right">
                      <DespesaActions despesa={despesa} categorias={categorias} />
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
