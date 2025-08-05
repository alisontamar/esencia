import { handleWhatsAppClick } from "@/lib/utils";

export const Contact = () => {
    return (
        <section className="p-3 mx-3 md:mx-0 flex-wrap bg-gradient-to-r from-pink-500 text-white to-purple-600 flex md:justify-between justify-center gap-3 md:gap-0 items-center shadow-md rounded-lg mt-6">
            <p>
                Si vendes cosméticos o productos del hogar, esto es para ti. Tu propio catálogo online. ¿Te interesa?
            </p>
            <button
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleWhatsAppClick}>
                Contactar
            </button>
        </section>
    );
}