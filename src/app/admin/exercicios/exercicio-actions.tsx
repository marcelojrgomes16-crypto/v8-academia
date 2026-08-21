'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function ExercicioActions({ exercicio, gruposMusculares }: { exercicio?: any; gruposMusculares: string[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: exercicio?.nome || '',
    descricao: exercicio?.descricao || '',
    grupoMuscular: exercicio?.grupoMuscular || gruposMusculares[0],
    equipamento: exercicio?.equipamento || '',
    videoUrl: exercicio?.videoUrl || '',
    imagemUrl: exercicio?.imagemUrl || '',
  })

  const isEditing = !!exercicio

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        nome: form.nome,
        descricao: form.descricao || null,
        grupoMuscular: form.grupoMuscular,
        equipamento: form.equipamento || null,
        videoUrl: form.videoUrl || null,
        imagemUrl: form.imagemUrl || null,
      }
      const url = isEditing ? `/api/admin/exercicios/${exercicio.id}` : '/api/admin/exercicios'
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
      }
      toast({ title: isEditing ? 'Exercicio atualizado' : 'Exercicio criado' })
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast({ title: 'Erro', description: error instanceof Error ? error.message : 'Erro ao salvar', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!exercicio) return
    if (!confirm('Tem certeza que deseja excluir este exercicio?')) return
    try {
      const res = await fetch(`/api/admin/exercicios/${exercicio.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erro ao excluir')
      toast({ title: 'Exercicio excluido' })
      router.refresh()
    } catch {
      toast({ title: 'Erro', description: 'Erro ao excluir', variant: 'destructive' })
    }
  }

  if (!exercicio) {
    return (
      <>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Novo Exercicio
        </Button>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-[#141414] border border-red-900/20 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">Novo Exercicio</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormFields form={form} setForm={setForm} gruposMusculares={gruposMusculares} />
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
            <h2 className="text-lg font-bold mb-4">Editar Exercicio</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormFields form={form} setForm={setForm} gruposMusculares={gruposMusculares} />
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

function FormFields({ form, setForm, gruposMusculares }: { form: any; setForm: (f: any) => void; gruposMusculares: string[] }) {
  return (
    <>
      <div>
        <Label>Nome *</Label>
        <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
      </div>
      <div>
        <Label>Grupo Muscular *</Label>
        <select value={form.grupoMuscular} onChange={(e) => setForm({ ...form, grupoMuscular: e.target.value })} className="flex h-10 w-full rounded-md border border-gym-border bg-gym-dark px-3 py-2 text-white text-sm">
          {gruposMusculares.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div>
        <Label>Descricao</Label>
        <Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
      </div>
      <div>
        <Label>Equipamento</Label>
        <Input value={form.equipamento} onChange={(e) => setForm({ ...form, equipamento: e.target.value })} />
      </div>
      <div>
        <Label>URL do Video</Label>
        <Input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
      </div>
      <div>
        <Label>URL da Imagem</Label>
        <Input value={form.imagemUrl} onChange={(e) => setForm({ ...form, imagemUrl: e.target.value })} />
      </div>
    </>
  )
}
