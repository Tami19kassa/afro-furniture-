import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<Partial<Product>>({ title: '', price: 0, slug: '', description: '', short_description: '', image_url: '', category_id: null, featured: false, in_stock: true });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Upload image to Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus('Uploading image...');
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `products/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
    if (uploadError) {
      setStatus('Image upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }
    // Get public URL
    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
    setForm((f) => ({ ...f, image_url: data.publicUrl }));
    setStatus('Image uploaded!');
    setUploading(false);
  };
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate('/admin');
      setUser(data.user);
    });
    loadProducts();
  }, []);

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
    const payload = {
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
      const { error } = await (supabase as any).from('products').update(payload).eq('id', editingId);
      if (error) setStatus('Error: ' + error.message);
      else {
        setStatus('Updated');
        cancelEdit();
        loadProducts();
      }
    } else {
      const { error } = await (supabase as any).from('products').insert([payload]);
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

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div>
              <span className="mr-4 text-sm text-gray-600">{user?.email}</span>
              <button onClick={signOut} className="px-3 py-1 bg-gray-200 rounded">Sign out</button>
            </div>
          </div>

          <form onSubmit={saveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input name="title" value={form.title ?? ''} onChange={handleChange} placeholder="Title" className="px-3 py-2 border rounded" required />
            <input name="slug" value={form.slug ?? ''} onChange={handleChange} placeholder="slug" className="px-3 py-2 border rounded" />
            <input name="price" value={form.price ?? 0} onChange={handleChange} type="number" placeholder="Price" className="px-3 py-2 border rounded" />
            <div>
              <label className="block mb-1 text-sm font-medium">Product Image</label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="mb-2"
                disabled={uploading}
              />
              {form.image_url && (
                <img src={form.image_url} alt="Preview" className="h-24 rounded border mb-2" />
              )}
              <input name="image_url" value={form.image_url ?? ''} onChange={handleChange} placeholder="Image URL" className="px-3 py-2 border rounded w-full" />
            </div>
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
      </div>
    </div>
  );
}
