// lib/whatsapp.ts

export function buildWhatsAppUrl(number: string, message: string): string {
  // Clean the number (remove +, spaces, etc.)
  const cleanNumber = number.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function productOrderMessage(title: string, price: number): string {
  return `Bonjour ! Je souhaite commander :\n\n📦 ${title}\n💰 Prix : ${price.toFixed(0)} DT\n\nMerci !`;
}

export function workshopBookingMessage(title: string, price: number, duration: string): string {
  return `Bonjour ! Je souhaite réserver l'atelier :\n\n🎨 ${title}\n⏱ Durée : ${duration}\n💰 Prix : ${price.toFixed(0)} DT\n\nMerci !`;
}