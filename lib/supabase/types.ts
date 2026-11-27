// lib/supabase/types.ts
// Auto-generated shape — replace with `npx supabase gen types typescript` after migration

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type StockStatus = 'in_stock' | 'low' | 'on_order' | 'out_of_stock'
export type OrderStatus =
  | 'quote_requested' | 'quote_sent' | 'paid_deposit'
  | 'paid_full' | 'scheduled' | 'dispatched' | 'delivered'
  | 'expired' | 'cancelled'
export type PaymentType = 'deposit' | 'balance' | 'full'
export type PaymentStatus = 'pending' | 'confirmed' | 'failed'
export type StaffRole = 'owner' | 'sales' | 'dispatch' | 'content'
export type Source = 'web' | 'whatsapp' | 'staff'

export interface Category {
  id: string
  name: string
  slug: string
  intro_text: string | null
  tile_image: string | null
  sort_order: number
  filter_schema: Record<string, string[]>
  created_at: string
}

export interface Product {
  id: string
  category_id: string | null
  name: string
  slug: string
  brand: string | null
  size_grade: string | null
  unit: string
  specs: Json
  photos: string[]
  related_ids: string[]
  stock_status: StockStatus
  featured: boolean
  created_at: string
}

export interface Price {
  id: string
  product_id: string
  unit_price: number
  tiers: PriceTier[]
  offer_price: number | null
  offer_start: string | null
  offer_end: string | null
  updated_at: string
}

export interface PriceTier {
  min_qty: number
  price: number
}

export interface Customer {
  id: string
  phone: string
  name: string | null
  email: string | null
  trade_account: boolean
  default_location: string | null
  created_at: string
}

export interface QuoteOrderLine {
  product_id: string
  name: string
  unit: string
  qty: number
  unit_price: number
  subtotal: number
}

export interface QuoteOrder {
  id: string
  ref_no: string
  customer_id: string | null
  lines: QuoteOrderLine[]
  boq_files: string[]
  location_text: string | null
  location_lat: number | null
  location_lng: number | null
  in_nakuru_town: boolean | null
  delivery_charge: number
  deposit_pct: number
  total: number | null
  validity_date: string | null
  status: OrderStatus
  pay_link_token: string
  source: Source
  notes: string | null
  staff_notes: string | null
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  quote_order_id: string
  amount: number
  type: PaymentType
  mpesa_receipt: string | null
  mpesa_phone: string | null
  checkout_request_id: string | null
  status: PaymentStatus
  paid_at: string | null
  created_at: string
}

export interface Delivery {
  id: string
  quote_order_id: string
  delivery_date: string | null
  time_window: string | null
  vehicle: string | null
  driver_name: string | null
  driver_phone: string | null
  status: 'scheduled' | 'dispatched' | 'delivered'
  dispatched_at: string | null
  delivered_at: string | null
  created_at: string
}

export interface DeliveryZone {
  id: string
  name: string
  areas: string[]
  free: boolean
  rate: number | null
  sort_order: number
}

export interface CalculatorConfig {
  id: string
  calculator: string
  ratios: Json
  wastage_pct: number
  mappings: Json
}

export interface Review {
  id: string
  customer_id: string | null
  order_id: string | null
  rating: number
  review_text: string | null
  town: string | null
  verified: boolean
  created_at: string
}

export interface StaffUser {
  id: string
  role: StaffRole
  name: string | null
}

export interface AuditLog {
  id: string
  staff_id: string | null
  action: string
  table_name: string | null
  record_id: string | null
  old_data: Json
  new_data: Json
  created_at: string
}

// Join types used in queries
export interface ProductWithPrice extends Product {
  prices: Price | null
  categories: Pick<Category, 'name' | 'slug'> | null
}

type Rel = {
  foreignKeyName: string
  columns: string[]
  isOneToOne?: boolean
  referencedRelation: string
  referencedColumns: string[]
}

// Mapped types so interfaces satisfy supabase-js's Record<string, unknown> constraint
type Plain<T> = { [K in keyof T]: T[K] }

type Table<R, Rels extends Rel[] = []> = {
  Row: Plain<R>
  Insert: Partial<Plain<R>>
  Update: Partial<Plain<R>>
  Relationships: Rels
}

export interface Database {
  public: {
    Tables: {
      categories: Table<Category>
      products: Table<Product, [
        { foreignKeyName: 'products_category_id_fkey'; columns: ['category_id']; isOneToOne: false; referencedRelation: 'categories'; referencedColumns: ['id'] },
      ]>
      prices: Table<Price, [
        { foreignKeyName: 'prices_product_id_fkey'; columns: ['product_id']; isOneToOne: true; referencedRelation: 'products'; referencedColumns: ['id'] },
      ]>
      customers: Table<Customer>
      quote_orders: Table<QuoteOrder, [
        { foreignKeyName: 'quote_orders_customer_id_fkey'; columns: ['customer_id']; isOneToOne: false; referencedRelation: 'customers'; referencedColumns: ['id'] },
      ]>
      payments: Table<Payment, [
        { foreignKeyName: 'payments_quote_order_id_fkey'; columns: ['quote_order_id']; isOneToOne: false; referencedRelation: 'quote_orders'; referencedColumns: ['id'] },
      ]>
      deliveries: Table<Delivery, [
        { foreignKeyName: 'deliveries_quote_order_id_fkey'; columns: ['quote_order_id']; isOneToOne: false; referencedRelation: 'quote_orders'; referencedColumns: ['id'] },
      ]>
      delivery_zones: Table<DeliveryZone>
      calculator_configs: Table<CalculatorConfig>
      reviews: Table<Review, [
        { foreignKeyName: 'reviews_customer_id_fkey'; columns: ['customer_id']; isOneToOne: false; referencedRelation: 'customers'; referencedColumns: ['id'] },
        { foreignKeyName: 'reviews_order_id_fkey'; columns: ['order_id']; isOneToOne: false; referencedRelation: 'quote_orders'; referencedColumns: ['id'] },
      ]>
      staff_users: Table<StaffUser>
      audit_log: Table<AuditLog>
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
