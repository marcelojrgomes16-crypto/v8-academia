'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function ReceitaActions({ receita, categorias }: { receita?: any; categorias: string[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    descricao: receita?.descricao || '',
    valor: receita?.valor?.toString() || '',
    categoria: receita?.categoria || categorias[0],
    data: receita?.data ? new Date(receita.data).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    observacoes: receita?.observacoes || '',
  })

  const isEditing = !!receita

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        descricao: form.descricao,
        valor: parseFloat(form.valor),
        categoria: form.categoria,
        data: form.data,
        observacoes: form.observacoes || null,
      }

      const url = isEditing ? `/api/admin/receitas/${receita.id}` : '/api/admin/receitas'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
      }

      toast({ title: isEditing ? 'Receita atualizada' : 'Receita criada' })
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast({ title: 'Erro', description: error instanceof Error ? error.message : 'Erro ao salvar', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!receita) return
    if (!confirm('Tem certeza que deseja excluir esta receita?')) return
    try {
      const res = await fetch(`/api/admin/receitas/${receita.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erro ao excluir')
      toast({ title: 'Receita excluida' })
      router.refresh()
    } catch {
      toast({ title: 'Erro', description: 'Erro ao excluir', variant: 'destructive' })
    }
  }

  if (!receita) {
    return (
      <>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Nova Receita
        </Button>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-[#141414] border border-red-900/20 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">Nova Receita</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormFields form={form} setForm={setForm} categorias={categorias} />
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
            <h2 className="text-lg font-bold mb-4">Editar Receita</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormFields form={form} setForm={setForm} categorias={categorias} />
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

function FormFields({ form, setForm, categorias }: { form: any; setForm: (f: any) => void; categorias: string[] }) {
  return (
    <>
      <div>
        <Label>Descricao *</Label>
        <Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Valor (R$) *</Label>
          <Input type="number" step="0.01" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} required />
        </div>
        <div>
          <Label>Data *</Label>
          <Input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} required />
        </div>
      </div>
      <div>
        <Label>Categoria *</Label>
        <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="flex h-10 w-full rounded-md border border-gym-border bg-gym-dark px-3 py-2 text-white text-sm">
          {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <Label>Observacoes</Label>
        <Input value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
      </div>
    </>
  )
}
