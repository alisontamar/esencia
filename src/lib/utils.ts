import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ProductWithOffer } from "@/types/database.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleWhatsAppClick(product: ProductWithOffer | null, quantity = 1) {
  if (!product) {
    console.error("No se pasó product a handleWhatsAppClick");
    return;
  }

  let message = `Hola! Me interesa el producto: ${product.nombre} de ${product.marcas?.nombre ?? "Sin marca"}.`;

  if (quantity === 1) {
    message += ` Precio: Bs${product.precio_base}`;
  } else {
    const totalPrice = product.precio_base * quantity;
    message += ` Cantidad: ${quantity} unidades. Precio unitario: Bs${product.precio_base}. Total: Bs${totalPrice}`;
  }

  const phoneNumber = "79710328";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
}
