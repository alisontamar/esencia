import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { brands } from '@/data/products';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const BrandCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const [visibleBrands, setVisibleBrands] = useState(1);
  const maxIndex = Math.max(0, brands.length - visibleBrands);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + brands.length) % brands.length)
  }

  const goToSlide = (index: number) => setCurrentIndex(index);


useEffect(() => {
  const updateVisibleBrands = () => {
    const width = window.innerWidth;
    if ( width >= 1024) setVisibleBrands(4);
    else if (width >= 768) setVisibleBrands(2);
    else setVisibleBrands(1);
  };

  updateVisibleBrands(); // initial
  window.addEventListener('resize', updateVisibleBrands);
  return () => window.removeEventListener('resize', updateVisibleBrands);
}, []);


  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nuestras
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent ml-2">
              Marcas
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Colaboramos con las marcas más prestigiosas para ofrecerte productos
            excepcionales que transformarán tu hogar
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Brand Cards Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${(100 / visibleBrands) * currentIndex}%)` }}
            >
              {brands.map((brand) => (
                <div key={brand.id} className="flex-shrink-0 px-3 w-full md:w-auto"
                  style={{ width: `${100 / visibleBrands}%` }}
                >
                  <Link to={`/brand/${encodeURIComponent(brand.name)}`}>
                    <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      <CardContent className="p-8 text-center">
                        <div className="mb-6">
                          <div className="mb-6 flex justify-center">
                            <div className="w-auto h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center shadow-inner group-hover:shadow-lg transition-all duration-300">
                              <img
                                src={"/homemart.webp"}
                                alt={`Logo ${brand.name}`}
                                className="w-auto h-24 object-contain group-hover:scale-110 transition-transform duration-300 rounded-lg"
                              />
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {brand.name}
                          </h3>
                        </div>

                        <div className="flex justify-center space-x-8 text-center">
                          <div>
                            <div className="text-2xl font-bold text-pink-500">
                              {Math.floor(Math.random() * 20) + 5}
                            </div>
                            <div className="text-xs text-gray-500">Productos</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-500">
                              {Math.floor(Math.random() * 5) + 2}
                            </div>
                            <div className="text-xs text-gray-500">Categorías</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full"
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 w-8'
                  : 'bg-gray-300'
                  }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};