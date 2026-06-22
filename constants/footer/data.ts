import { SiIfood, SiInstagram, SiWhatsapp } from "react-icons/si"

export const navLinks = [
    { href: "#sobre", label: "Sobre" },
    { href: "#galeria", label: "Galeria" },
    { href: "#cardapio", label: "Cardápio" },
    { href: "#reservas", label: "Reservas" },
    { href: "#localizacao", label: "Localização" },
]

export const socialLinks = [
  { href: "https://www.instagram.com/botecodogonza/", icon: SiInstagram, label: "Instagram" },
  { href: "https://wa.me/5513978267391?text=Olá%2C%20vim%20pelo%20site%20e%20estou%20com%20uma%20dúvida.", icon: SiWhatsapp, label: "WhatsApp" },
  { href: "https://www.ifood.com.br/delivery/santos-sp/boteco-do-gonza---lanches-e-porcoes-ponta-da-praia/a2ca3fec-7808-44bb-98ed-9e1fa0f58c78?UTM_Medium=share", icon: SiIfood, label: "IFood" },
]