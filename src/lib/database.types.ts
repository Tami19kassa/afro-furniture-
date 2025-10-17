export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          short_description: string;
          price: number;
          image_url: string;
          category_id: string | null;
          featured: boolean;
          in_stock: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string;
          short_description?: string;
          price: number;
          image_url?: string;
          category_id?: string | null;
          featured?: boolean;
          in_stock?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          short_description?: string;
          price?: number;
          image_url?: string;
          category_id?: string | null;
          featured?: boolean;
          in_stock?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          cover_image_url: string;
          author: string;
          category: string;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content?: string;
          excerpt?: string;
          cover_image_url?: string;
          author?: string;
          category?: string;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string;
          cover_image_url?: string;
          author?: string;
          category?: string;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string | null;
          customer_name: string;
          rating: number;
          comment: string;
          approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          customer_name: string;
          rating: number;
          comment?: string;
          approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          customer_name?: string;
          rating?: number;
          comment?: string;
          approved?: boolean;
          created_at?: string;
        };
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          created_at?: string;
        };
      };
    };
  };
}
