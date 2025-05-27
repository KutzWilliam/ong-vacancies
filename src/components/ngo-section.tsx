import { ClipboardList, Users, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NgoSection() {
  return (
    <section id="ongs" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Potencialize Seu Impacto Social</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Para ONGs, oferecemos as ferramentas que você precisa para gerenciar suas iniciativas com eficiência e
            encontrar os voluntários ideais.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all">
            <CardHeader className="pb-2">
              <ClipboardList className="h-12 w-12 text-blue-600 mb-2" />
              <CardTitle>Cadastrar e Gerenciar Atividades</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Organize suas ações de forma simples e eficaz. Crie, edite e gerencie atividades com facilidade através
                de nossa interface intuitiva.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all">
            <CardHeader className="pb-2">
              <Users className="h-12 w-12 text-blue-600 mb-2" />
              <CardTitle>Encontrar Voluntários Qualificados</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Utilize nosso sistema de busca e 'match' para conectar-se com voluntários alinhados à sua causa e com as
                habilidades necessárias.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all">
            <CardHeader className="pb-2">
              <BarChart3 className="h-12 w-12 text-blue-600 mb-2" />
              <CardTitle>Acompanhar e Reportar Impacto</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Gere relatórios claros sobre o impacto de suas atividades e o engajamento dos voluntários para
                demonstrar resultados.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
