import { Clock, MapPin, Phone } from "lucide-react";

export const localizationData = [
  {
    icon: MapPin,
    title: "Endereço",
    lines: [
      "Rua Tolentino Filgueiras, 30",
      "Gonzaga - Santos/SP",
      "CEP: 11060-470",
    ],
  },
  {
    icon: Clock,
    title: "Funcionamento",
    lines: [
      "Seg - Qui: 17h às 00h",
      "Sex: 17h às 01:00h",
      "Sab: 13h às 01:00h",
      "Dom: 12h às 23:00h",
    ],
  },
  {
    icon: Phone,
    title: "Contato",
    lines: [
      "WhatsApp: (13) 97826-7391",
    ],
  },
] as const