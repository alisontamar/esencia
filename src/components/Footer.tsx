import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-pink-100 border-t border-gray-100">
      <div className="p-9">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                HomeMart
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Tu destino para productos del hogar de alta calidad. Descubre lo mejor en decoración, organización y
              confort para tu hogar.
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Categorías</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/catalog?category=bedroom" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Dormitorio
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=living" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Sala de Estar
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=kitchen" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Cocina
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=bathroom" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Baño
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=lighting" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Iluminación
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog?category=decoration"
                  className="text-gray-600 hover:text-pink-500 transition-colors"
                >
                  Decoración
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>Tienda HomeMart</p>
        </div>
      </div>
    </footer>
  )
}
