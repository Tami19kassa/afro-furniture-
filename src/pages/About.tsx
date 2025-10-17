import { useEffect, useState } from 'react';
import { Heart, Users, Award, Globe } from 'lucide-react';

export default function About() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Heart,
      title: 'Handcrafted with Love',
      description:
        'Each piece is carefully crafted by skilled artisans who pour their passion and expertise into every detail.',
    },
    {
      icon: Users,
      title: 'Community Support',
      description:
        'We work directly with local communities, supporting traditional craftsmanship and creating sustainable livelihoods.',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description:
        'We use only the finest materials and time-tested techniques to ensure furniture that lasts for generations.',
    },
    {
      icon: Globe,
      title: 'Cultural Heritage',
      description:
        'Our designs celebrate African heritage, bringing authentic cultural elements into modern homes worldwide.',
    },
  ];

  return (
    <div className="pt-20 min-h-screen">
      <div
        className="relative h-96 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg')",
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-white text-center px-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Story</h1>
            <p className="text-xl md:text-2xl text-gray-200">
              Bringing African Heritage to Your Home
            </p>
          </div>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About Afro-Furniture</h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Founded with a passion for celebrating African culture and craftsmanship,
                Afro-Furniture was born from a simple vision: to bring the warmth, elegance, and
                rich heritage of African design into homes around the world.
              </p>
              <p>
                Our journey began in the vibrant markets and artisan workshops across Africa, where
                we witnessed the incredible skill and artistry of local craftspeople. Each piece of
                furniture tells a story—a story of tradition, community, and the timeless beauty of
                African aesthetics.
              </p>
              <p>
                Today, we work directly with talented artisans to create furniture that seamlessly
                blends traditional African design elements with modern comfort and functionality.
                Every chair, table, and sofa is more than just furniture; it's a celebration of
                culture, a testament to quality, and a commitment to sustainable practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
            <p className="text-lg text-gray-600">Our commitment to excellence in every aspect</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="inline-block p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4">
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            To preserve and promote African craftsmanship while providing customers with exceptional,
            sustainable furniture that brings culture, comfort, and beauty into their homes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6">
              <div className="text-4xl font-bold text-amber-600 mb-2">500+</div>
              <div className="text-gray-600">Artisans Supported</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-amber-600 mb-2">10,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-amber-600 mb-2">15+</div>
              <div className="text-gray-600">Years of Excellence</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
