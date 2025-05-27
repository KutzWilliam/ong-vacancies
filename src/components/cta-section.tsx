"use client"

import { Button }  from "@/components/ui/Button"
import { Building, User } from "lucide-react"
import { useRouter } from "next/navigation";

export default function CtaSection() {

  const router = useRouter();
  const registerRoute = '/register';

  const handleLoginClick = () => {
    router.push(registerRoute);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Building className="h-8 w-8" />
              <h3 className="text-2xl font-bold">Para ONGs</h3>
            </div>
            <p className="text-lg mb-6">
              Sua causa merece mais alcance. Cadastre sua ONG agora e transforme sua gestão de voluntariado! Acesse
              ferramentas poderosas para maximizar seu impacto social.
            </p>
            <Button className="bg-white text-blue-700 hover:bg-blue-50 text-lg py-6 px-8 w-full md:w-auto"
            onClick={handleLoginClick}>
              Cadastrar minha ONG
            </Button>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <User className="h-8 w-8" />
              <h3 className="text-2xl font-bold">Para Voluntários</h3>
            </div>
            <p className="text-lg mb-6">
              Pronto para fazer a diferença? Encontre sua oportunidade de voluntariado e comece a impactar vidas!
              Junte-se a uma comunidade comprometida com a transformação social.
            </p>
            <Button className="bg-white text-blue-700 hover:bg-blue-50 text-lg py-6 px-8 w-full md:w-auto"
            onClick={handleLoginClick}>
              Quero ser voluntário
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
