export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  cover_image_url: string | null
}

export interface GalleryItem {
  id: number
  category_id: number
  title: string | null
  description: string | null
  image_url: string
  size_bytes?: number | null
  created_at: string
  category?: Category
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
}
