import { useCategory } from "@/hooks/useCategory";
import { Link } from "react-router-dom";

export function Footer() {
  const { categories } = useCategory();

  return (
    <footer className="bg-pink-100 border-t border-gray-100">
      <div className="container mx-auto p-9 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Esencia
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            Tu destino para cosméticos de alta calidad. Descubre lo mejor en cuidado de la piel, maquillaje y bienestar personal.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Categorías</h3>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/catalog?category=${encodeURIComponent(category.nombre)}`}
                  className="text-gray-600 hover:text-pink-500 transition-colors"
                >
                  {category.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Contacto</h3>
          <p className="text-gray-600 text-sm">info@tiendaesencia.com</p>
          <p className="text-gray-600 text-sm">Tel: +591 123 456 789</p>
          <p className="text-gray-600 text-sm">Cochabamba, Bolivia</p>
        </div>
      </div>

      <div className="border-t border-gray-100 mt-8 pt-4 text-center text-sm text-gray-600">
        <p>Tienda Esencia © {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
