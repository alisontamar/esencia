import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleWhatsAppClick() {
  // let message = `Hola! Me interesa el producto: ${product.name} de ${product.brand}.`

  // if (quantity === 1) {
  //   message += ` Precio: $${product.price}`
  // } else {
  //   message += ` Cantidad: ${quantity} unidades. Precio unitario: $${product.price}. Total: $${totalPrice}`
  // }

  const message = `Me gustaria este sitio para mi tienda, por favor, más información`;

  const phoneNumber = "79710328";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;
  window.open(whatsappUrl, "_blank");
}

