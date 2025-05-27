import Image from "next/image"
import { Goal } from "lucide-react"
import Voluntario from "../../public/ONG2.jpg"

export default function AboutSection() {
  return (
    <section id="sobre" className="py-16 md:py-24 bg-blue-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Um Novo Jeito de Fazer o Bem</h2>
            <p className="text-lg text-gray-700 mb-6">
              Nosso sistema de gestão de voluntariado é a ponte que une a paixão de quem quer ajudar com as causas que
              realmente precisam. Inspirados pelo Objetivo de Desenvolvimento Sustentável (ODS) 10 – Redução das
              Desigualdades, criamos uma plataforma intuitiva para simplificar a gestão de atividades sociais, conectar
              pessoas e potencializar o impacto de cada ação.
            </p>
            <p className="text-lg text-gray-700">
              Juntos, estamos construindo um mundo onde a solidariedade é a força motriz para a equidade.
            </p>
            <div className="mt-8 flex items-center gap-3 bg-white p-4 rounded-lg border shadow-sm">
              <Goal className="h-10 w-10 text-blue-600" />
              <div>
                <h3 className="font-semibold">ODS 10 - Redução das Desigualdades</h3>
                <p className="text-sm text-gray-600">Contribuindo para um mundo mais justo e equitativo</p>
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-xl">
              <Image
                src={Voluntario}
                alt="Pessoas colaborando em atividade voluntária"
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
