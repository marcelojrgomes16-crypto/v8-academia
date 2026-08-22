'use client'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <div className="h-16 w-16 rounded-full bg-red-600/20 flex items-center justify-center">
          <span className="text-2xl">!</span>
        </div>
        <h2 className="text-xl font-bold text-white">Algo deu errado</h2>
        <p className="text-gray-400 text-sm">
          Ocorreu um erro ao carregar esta pagina. Tente novamente.
        </p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  )
}
