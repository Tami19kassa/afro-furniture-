import { useEffect, useState } from 'react';
import { ChevronRight, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import type { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Featured products
    const { data: featured } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .limit(3);

    // Newest products (latest 6)
    const { data: latest } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);

    // Reviews
    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (featured) setFeaturedProducts(featured);
    if (latest) setNewProducts(latest);
    if (reviewsData) setReviews(reviewsData);
    setIsLoading(false);
  };

  return (
    <div className="pt-20">
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg')] bg-cover bg-center opacity-10"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 bg-clip-text text-transparent">
              Afro-Furniture
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 animate-slide-up">
            Elegant African-Inspired Design for Your Home
          </p>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto animate-slide-up-delay">
            Discover handcrafted furniture that tells a story. Each piece celebrates African heritage with modern comfort and timeless elegance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up-delay-2">
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Shop Collection</span>
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => navigate('/about')}
              className="px-8 py-4 bg-white text-gray-800 rounded-lg font-semibold border-2 border-gray-300 hover:border-amber-600 hover:text-amber-600 transform hover:scale-105 transition-all duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>


      {/* Featured Collection Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Collection</h2>
            <p className="text-lg text-gray-600">Handpicked pieces that bring African elegance to life</p>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-6 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg mb-4 h-64">
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.title}</h3>
                  <p className="text-gray-600 mb-3">{product.short_description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-amber-600">${product.price}</span>
                    <button className="text-amber-600 hover:text-amber-700 font-medium flex items-center space-x-1">
                      <span>View Details</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transform hover:scale-105 transition-all duration-300"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* New Products Section */}
      <section className="py-20 bg-gradient-to-br from-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">New Products</h2>
            <p className="text-lg text-gray-600">See the latest additions from our admin team</p>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-6 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {newProducts.map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg mb-4 h-64">
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.title}</h3>
                  <p className="text-gray-600 mb-3">{product.short_description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-amber-600">${product.price}</span>
                    <button className="text-amber-600 hover:text-amber-700 font-medium flex items-center space-x-1">
                      <span>View Details</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Real experiences from our valued customers</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-white p-6 rounded-lg">
                  <div className="bg-gray-200 h-4 rounded mb-4"></div>
                  <div className="bg-gray-200 h-20 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < review.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{review.comment}"</p>
                  <p className="text-gray-900 font-semibold">{review.customer_name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
