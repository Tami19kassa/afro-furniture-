import { useEffect, useState } from 'react';
import { Calendar, User, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (data) setPosts(data);
    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (selectedPost) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center text-amber-600 hover:text-amber-700 mb-8 font-medium"
          >
            <ChevronRight size={20} className="rotate-180" />
            <span>Back to Blog</span>
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-96 overflow-hidden">
              <img
                src={selectedPost.cover_image_url}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8 md:p-12">
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
                  {selectedPost.category}
                </span>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>{formatDate(selectedPost.created_at)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User size={16} />
                  <span>{selectedPost.author}</span>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-6">{selectedPost.title}</h1>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedPost.content}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-xl text-amber-50">
            Stories, inspiration, and tips for African-inspired living
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-6 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div className="h-56 overflow-hidden">
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User size={14} />
                      <span>{post.author}</span>
                    </div>
                    <button className="text-amber-600 hover:text-amber-700 font-medium flex items-center space-x-1">
                      <span>Read More</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No blog posts available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
