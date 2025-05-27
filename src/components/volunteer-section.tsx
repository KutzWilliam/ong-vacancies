import Image from "next/image"
import { Search, Handshake, Award } from "lucide-react"
import Voluntario from "../../public/ONG.jpg"

export default function VolunteerSection() {
  return (
    <section id="voluntarios" className="py-16 md:py-24 bg-green-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Faça a Diferença Onde Você Mais Acredita</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Para voluntários, abrir as portas para oportunidades significativas nunca foi tão fácil. Encontre a causa
            que te move e comece a transformar o mundo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-white p-3 rounded-full shadow-md">
                  <Search className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Descubra Oportunidades Diversas</h3>
                  <p className="text-gray-700">
                    Navegue por uma vasta lista de ações de voluntariado em diversas áreas, desde educação até meio
                    ambiente, e encontre aquela que ressoa com seus valores.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-white p-3 rounded-full shadow-md">
                  <Handshake className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Encontre o 'Match' Perfeito</h3>
                  <p className="text-gray-700">
                    Nosso sistema te ajuda a encontrar ONGs e atividades que combinam com seus interesses e habilidades,
                    garantindo uma experiência gratificante.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-white p-3 rounded-full shadow-md">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Deixe Sua Marca</h3>
                  <p className="text-gray-700">
                    Acompanhe seu impacto e veja como sua dedicação contribui para a redução das desigualdades. Cada
                    hora doada é um passo em direção a um mundo melhor.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative h-[450px] w-full rounded-xl overflow-hidden shadow-xl">
              <Image
                src={Voluntario}
                alt="Voluntários em ação"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
