import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<Partial<Product>>({ title: '', price: 0, slug: '', description: '', short_description: '', image_url: '', category_id: null, featured: false, in_stock: true });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const adminEmailsEnv = (import.meta.env.VITE_ADMIN_EMAILS as string) || '';
  const adminEmails = adminEmailsEnv
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    loadProducts();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending sign-in link...');
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setStatus('Error sending link: ' + error.message);
    else setStatus('Check your email for a sign-in link.');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const loadProducts = async () => {
    setIsLoading(true);
    const { data, error } = await (supabase as any).from('products').select('*').order('created_at', { ascending: false });
    if (error) setStatus(error.message);
    if (data) setProducts(data as Product[]);
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setForm((f) => ({ ...f, [name]: type === 'number' ? Number(value) : value }));
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({ ...p });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', price: 0, slug: '', description: '', short_description: '', image_url: '', category_id: null, featured: false, in_stock: true });
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Saving...');
    const payload: ProductInsert | ProductUpdate = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      short_description: form.short_description,
      price: form.price,
      image_url: form.image_url,
      category_id: form.category_id,
      featured: form.featured,
      in_stock: form.in_stock,
    };

    if (editingId) {
  const { error } = await (supabase as any).from('products').update(payload as any).eq('id', editingId);
      if (error) setStatus('Error: ' + error.message);
      else {
        setStatus('Updated');
        cancelEdit();
        loadProducts();
      }
    } else {
  const { error } = await (supabase as any).from('products').insert([payload as any]);
      if (error) setStatus('Error: ' + error.message);
      else {
        setStatus('Created');
        cancelEdit();
        loadProducts();
      }
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
  const { error } = await (supabase as any).from('products').delete().eq('id', id);
    if (error) setStatus('Error: ' + error.message);
    else {
      setStatus('Deleted');
      loadProducts();
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          {!user ? (
            <div>
              <h1 className="text-2xl font-bold mb-4">Admin Sign In</h1>
              <form onSubmit={signIn} className="flex items-center space-x-2">
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="admin@example.com" className="px-3 py-2 border rounded" />
                <button className="px-4 py-2 bg-amber-600 text-white rounded" type="submit">Send Link</button>
              </form>
              {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
            </div>
          ) : adminEmails.length > 0 && !adminEmails.includes(user.email) ? (
            <div>
              <h2 className="text-xl font-bold">Access denied</h2>
              <p className="mt-2 text-sm text-gray-600">Your account ({user.email}) is not authorized to access the admin dashboard.</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <div>
                  <span className="mr-4 text-sm text-gray-600">{user.email}</span>
                  <button onClick={signOut} className="px-3 py-1 bg-gray-200 rounded">Sign out</button>
                </div>
              </div>

              <form onSubmit={saveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input name="title" value={form.title ?? ''} onChange={handleChange} placeholder="Title" className="px-3 py-2 border rounded" required />
                <input name="slug" value={form.slug ?? ''} onChange={handleChange} placeholder="slug" className="px-3 py-2 border rounded" />
                <input name="price" value={form.price ?? 0} onChange={handleChange} type="number" placeholder="Price" className="px-3 py-2 border rounded" />
                <input name="image_url" value={form.image_url ?? ''} onChange={handleChange} placeholder="Image URL" className="px-3 py-2 border rounded" />
                <textarea name="short_description" value={form.short_description ?? ''} onChange={handleChange} placeholder="Short description" className="px-3 py-2 border rounded md:col-span-2" />
                <textarea name="description" value={form.description ?? ''} onChange={handleChange} placeholder="Full description" className="px-3 py-2 border rounded md:col-span-2" />

                <div className="md:col-span-2 flex items-center space-x-2">
                  <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded">{editingId ? 'Update' : 'Create'}</button>
                  {editingId && <button type="button" onClick={cancelEdit} className="px-3 py-2 bg-gray-200 rounded">Cancel</button>}
                  <span className="text-sm text-gray-600">{status}</span>
                </div>
              </form>

              <div>
                <h2 className="text-xl font-semibold mb-4">Products</h2>
                {isLoading ? (
                  <p>Loading...</p>
                ) : (
                  <div className="space-y-4">
                    {products.map((p) => (
                      <div key={p.id} className="bg-white p-4 rounded shadow flex items-center justify-between">
                        <div>
                          <div className="font-bold">{p.title}</div>
                          <div className="text-sm text-gray-500">{p.short_description}</div>
                        </div>
                        <div className="space-x-2">
                          <button onClick={() => startEdit(p)} className="px-3 py-1 bg-blue-100 rounded">Edit</button>
                          <button onClick={() => deleteProduct(p.id)} className="px-3 py-1 bg-red-100 rounded">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
