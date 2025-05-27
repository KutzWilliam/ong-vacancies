import { CircleUser, Search, BarChart3 } from "lucide-react"

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Sua Jornada de Impacto em 3 Passos</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nosso processo é simples e eficiente, permitindo que você comece a fazer a diferença rapidamente.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-blue-200 z-0"></div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <CircleUser className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Passo 1: Cadastro Fácil</h3>
              <p className="text-gray-700">
                Crie seu perfil como ONG ou voluntário em poucos minutos. Preencha suas informações, áreas de interesse
                e disponibilidade.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Passo 2: Conecte-se e Encontre</h3>
              <p className="text-gray-700">
                ONGs listam oportunidades; voluntários buscam e se candidatam – ou o sistema sugere o 'match' ideal
                baseado em perfis compatíveis.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Passo 3: Transforme e Gerencie</h3>
              <p className="text-gray-700">
                ONGs gerenciam atividades; voluntários participam e contribuem para o impacto social. Todos acompanham
                resultados e crescem juntos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
