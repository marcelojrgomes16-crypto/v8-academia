export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Carregando...</p>
      </div>
    </div>
  )
}
