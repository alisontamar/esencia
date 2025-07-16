import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { brands, products } from '@/data/products';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/catalog' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Filter products based on search query
  const searchSuggestions = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const handleSearchSelect = (productId: string) => {
    navigate(`/product/${productId}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleBrandSelect = (brandName: string) => {
    navigate(`/brand/${encodeURIComponent(brandName)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              HomeMart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex justify-center items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-pink-500 ${isActive(item.href) ? 'text-pink-500' : 'text-gray-600'
                  }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Brands Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm w-auto font-medium text-gray-600 hover:text-pink-500">
                  Marcas
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                {brands.map((brand) => (
                  <DropdownMenuItem
                    key={brand.id}
                    onClick={() => handleBrandSelect(brand.name)}
                    className="cursor-pointer"
                  >
                    {brand.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="pl-10 w-64 bg-gray-50 border-gray-200 focus:bg-white focus:border-pink-300"
              />

              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50">
                  {searchSuggestions.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        handleSearchSelect(product.id)
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg mr-3"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.brand} • ${product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <>
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-sm font-medium transition-colors hover:text-pink-500 ${isActive(item.href) ? 'text-pink-500' : 'text-gray-600'
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </>

              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium text-gray-600 hover:text-pink-500">
                    Marcas
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  {brands.map((brand, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => {
                        handleBrandSelect(brand.name)
                        setIsMenuOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      {brand.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar productos..."
                  onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-pink-300"
                />
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50">
                    {searchSuggestions.map((product, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          handleSearchSelect(product.id)
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg mr-3"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.brand} • ${product.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};