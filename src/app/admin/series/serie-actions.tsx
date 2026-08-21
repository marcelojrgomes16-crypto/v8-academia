'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function SerieActions({ serie, exercicios }: { serie?: any; exercicios: any[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: serie?.nome || '',
    descricao: serie?.descricao || '',
    exercicioId: serie?.exercicioId || (exercicios[0]?.id || ''),
    series: serie?.series?.toString() || '3',
    repeticoes: serie?.repeticoes || '10',
    carga: serie?.carga || '',
    descanso: serie?.descanso?.toString() || '60',
    ordem: serie?.ordem?.toString() || '1',
    observacoes: serie?.observacoes || '',
  })

  const isEditing = !!serie

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        nome: form.nome,
        descricao: form.descricao || null,
        exercicioId: form.exercicioId,
        series: parseInt(form.series),
        repeticoes: form.repeticoes,
        carga: form.carga || null,
        descanso: form.descanso ? parseInt(form.descanso) : null,
        ordem: parseInt(form.ordem),
        observacoes: form.observacoes || null,
      }
      const url = isEditing ? `/api/admin/series/${serie.id}` : '/api/admin/series'
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
      }
      toast({ title: isEditing ? 'Serie atualizada' : 'Serie criada' })
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast({ title: 'Erro', description: error instanceof Error ? error.message : 'Erro ao salvar', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!serie) return
    if (!confirm('Tem certeza que deseja excluir esta serie?')) return
    try {
      const res = await fetch(`/api/admin/series/${serie.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erro ao excluir')
      toast({ title: 'Serie excluida' })
      router.refresh()
    } catch {
      toast({ title: 'Erro', description: 'Erro ao excluir', variant: 'destructive' })
    }
  }

  if (!serie) {
    return (
      <>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Nova Serie
        </Button>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-[#141414] border border-red-900/20 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">Nova Serie</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <SerieFormFields form={form} setForm={setForm} exercicios={exercicios} />
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
            <h2 className="text-lg font-bold mb-4">Editar Serie</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <SerieFormFields form={form} setForm={setForm} exercicios={exercicios} />
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

function SerieFormFields({ form, setForm, exercicios }: { form: any; setForm: (f: any) => void; exercicios: any[] }) {
  return (
    <>
      <div>
        <Label>Nome *</Label>
        <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
      </div>
      <div>
        <Label>Exercicio *</Label>
        <select value={form.exercicioId} onChange={(e) => setForm({ ...form, exercicioId: e.target.value })} className="flex h-10 w-full rounded-md border border-gym-border bg-gym-dark px-3 py-2 text-white text-sm">
          {exercicios.map((ex) => (
            <option key={ex.id} value={ex.id}>{ex.nome} ({ex.grupoMuscular})</option>
          ))}
        </select>
      </div>
      <div>
        <Label>Descricao</Label>
        <Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Sets *</Label>
          <Input type="number" value={form.series} onChange={(e) => setForm({ ...form, series: e.target.value })} required />
        </div>
        <div>
          <Label>Reps *</Label>
          <Input value={form.repeticoes} onChange={(e) => setForm({ ...form, repeticoes: e.target.value })} required placeholder="ex: 10-12" />
        </div>
        <div>
          <Label>Ordem *</Label>
          <Input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: e.target.value })} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Carga</Label>
          <Input value={form.carga} onChange={(e) => setForm({ ...form, carga: e.target.value })} placeholder="ex: 20kg" />
        </div>
        <div>
          <Label>Descanso (seg)</Label>
          <Input type="number" value={form.descanso} onChange={(e) => setForm({ ...form, descanso: e.target.value })} />
        </div>
      </div>
      <div>
        <Label>Observacoes</Label>
        <Input value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
      </div>
    </>
  )
}
