'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function PlanoActions({ plano }: { plano?: any }) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: plano?.nome || '',
    descricao: plano?.descricao || '',
    preco: plano?.preco?.toString() || '',
    duracaoDias: plano?.duracaoDias?.toString() || '',
    features: Array.isArray(plano?.features) ? plano.features.join(', ') : '',
    ativo: plano?.ativo ?? true,
  })

  const isEditing = !!plano

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        nome: form.nome,
        descricao: form.descricao || null,
        preco: parseFloat(form.preco),
        duracaoDias: parseInt(form.duracaoDias),
        features: form.features ? form.features.split(',').map((f: string) => f.trim()).filter(Boolean) : [],
        ativo: form.ativo,
      }

      const url = isEditing ? `/api/admin/planos/${plano.id}` : '/api/admin/planos'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Erro ao salvar plano')
      }

      toast({ title: isEditing ? 'Plano atualizado' : 'Plano criado' })
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast({ title: 'Erro', description: error instanceof Error ? error.message : 'Erro ao salvar', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!plano) return
    if (!confirm('Tem certeza que deseja excluir este plano?')) return
    try {
      const res = await fetch(`/api/admin/planos/${plano.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erro ao excluir plano')
      toast({ title: 'Plano excluido' })
      router.refresh()
    } catch {
      toast({ title: 'Erro', description: 'Erro ao excluir plano', variant: 'destructive' })
    }
  }

  if (!plano) {
    return (
      <>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Novo Plano
        </Button>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-[#141414] border border-red-900/20 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">Novo Plano</h2>
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
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Pencil className="h-3 w-3 mr-1" /> Editar
      </Button>
      <Button variant="destructive" size="sm" onClick={handleDelete}>
        <Trash2 className="h-3 w-3 mr-1" /> Excluir
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#141414] border border-red-900/20 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Editar Plano</h2>
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
    </>
  )
}

function FormFields({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  return (
    <>
      <div>
        <Label>Nome *</Label>
        <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
      </div>
      <div>
        <Label>Descricao</Label>
        <Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Preco (R$) *</Label>
          <Input type="number" step="0.01" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} required />
        </div>
        <div>
          <Label>Duracao (dias) *</Label>
          <Input type="number" value={form.duracaoDias} onChange={(e) => setForm({ ...form, duracaoDias: e.target.value })} required />
        </div>
      </div>
      <div>
        <Label>Features (separadas por virgula)</Label>
        <Input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Ex: Musculacao, Cardio, Spinning" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="ativo" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} className="rounded border-gym-border" />
        <Label htmlFor="ativo">Ativo</Label>
      </div>
    </>
  )
}
