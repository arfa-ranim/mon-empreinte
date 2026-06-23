import { WHATSAPP_NUMBER } from "./constants";

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function productOrderMessage(title: string, price: number): string {
  return `Bonjour ! Je souhaite commander :\n\n📦 ${title}\n💰 Prix : ${price.toFixed(0)} DT\n\nMerci !`;
}

export function workshopBookingMessage(title: string, price: number, duration: string): string {
  return `Bonjour ! Je souhaite réserver l'atelier :\n\n🎨 ${title}\n⏱ Durée : ${duration}\n💰 Prix : ${price.toFixed(0)} DT\n\nMerci !`;
}
