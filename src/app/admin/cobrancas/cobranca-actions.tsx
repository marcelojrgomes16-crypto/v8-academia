'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function CobrancaActions({ cobranca }: { cobranca?: any }) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    alunoId: cobranca?.alunoId || '',
    valor: cobranca?.valor?.toString() || '',
    descricao: cobranca?.descricao || '',
    dataVencimento: cobranca?.dataVencimento ? new Date(cobranca.dataVencimento).toISOString().split('T')[0] : '',
    status: cobranca?.status || 'PENDENTE',
    observacoes: cobranca?.observacoes || '',
  })

  const isEditing = !!cobranca

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        alunoId: form.alunoId,
        valor: parseFloat(form.valor),
        descricao: form.descricao,
        dataVencimento: form.dataVencimento,
        status: form.status,
        dataPagamento: form.status === 'PAGO' ? new Date().toISOString() : null,
        observacoes: form.observacoes || null,
      }
      const url = isEditing ? `/api/admin/cobrancas/${cobranca.id}` : '/api/admin/cobrancas'
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
      }
      toast({ title: isEditing ? 'Cobranca atualizada' : 'Cobranca criada' })
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast({ title: 'Erro', description: error instanceof Error ? error.message : 'Erro ao salvar', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!cobranca) return
    if (!confirm('Tem certeza que deseja excluir esta cobranca?')) return
    try {
      const res = await fetch(`/api/admin/cobrancas/${cobranca.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erro ao excluir')
      toast({ title: 'Cobranca excluida' })
      router.refresh()
    } catch {
      toast({ title: 'Erro', description: 'Erro ao excluir', variant: 'destructive' })
    }
  }

  if (!cobranca) {
    return (
      <>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Nova Cobranca
        </Button>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-[#141414] border border-red-900/20 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">Nova Cobranca</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormFields form={form} setForm={setForm} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button type="submit" loading={loading}>Salvar</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="flex gap-1 justify-end">
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <Pencil className="h-3 w-3" />
      </Button>
      <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-400 hover:text-red-300">
        <Trash2 className="h-3 w-3" />
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#141414] border border-red-900/20 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Editar Cobranca</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormFields form={form} setForm={setForm} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit" loading={loading}>Atualizar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function FormFields({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  return (
    <>
      <div>
        <Label>ID do Aluno *</Label>
        <Input value={form.alunoId} onChange={(e) => setForm({ ...form, alunoId: e.target.value })} required placeholder="ID do aluno" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Valor (R$) *</Label>
          <Input type="number" step="0.01" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} required />
        </div>
        <div>
          <Label>Vencimento *</Label>
          <Input type="date" value={form.dataVencimento} onChange={(e) => setForm({ ...form, dataVencimento: e.target.value })} required />
        </div>
      </div>
      <div>
        <Label>Descricao *</Label>
        <Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} required />
      </div>
      <div>
        <Label>Status</Label>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="flex h-10 w-full rounded-md border border-gym-border bg-gym-dark px-3 py-2 text-white text-sm">
          <option value="PENDENTE">Pendente</option>
          <option value="PAGO">Pago</option>
          <option value="ATRASADO">Atrasado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>
      <div>
        <Label>Observacoes</Label>
        <Input value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
      </div>
    </>
  )
}
