import { z } from 'zod'

export const ManualOrderSchema = z.object({
  customer_name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^\d{10}$/, 'Enter a 10-digit mobile number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().min(5, 'Address is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a 6-digit pincode'),
  payment_method: z.enum(['UPI', 'Cash', 'COD', 'Payment Link', 'Bank Transfer']),
  payment_status: z.enum(['Paid', 'Not Paid', 'COD']),
  notes: z.string().max(500).optional(),
  distributor_name: z.string().optional(),
  items: z
    .array(
      z.object({
        product: z.string().min(1, 'Select a product'),
        quantity: z.coerce.number().int().min(1, 'Min quantity is 1'),
        unit_price: z.number().min(0).optional(),
      })
    )
    .min(1, 'Add at least one product'),
})

export type ManualOrderFormValues = z.infer<typeof ManualOrderSchema>

export const CsvRowSchema = z.object({
  name: z.string().min(1, 'Name required'),
  phone: z.string().regex(/^\d{10}$/, 'Invalid phone'),
  product: z.string().min(1, 'Product required'),
  qty: z.coerce.number().int().min(1, 'Min 1'),
  address: z.string().min(1, 'Address required'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
  amount: z.coerce.number().min(0, 'Invalid amount'),
})

export type CsvRow = z.infer<typeof CsvRowSchema>

export const ShortenUrlSchema = z.object({
  long_url: z.string().url('Enter a valid URL (include https://)'),
  custom_code: z
    .string()
    .regex(/^[a-z0-9-]{2,30}$/, 'Use 2–30 lowercase letters, numbers, or hyphens')
    .optional()
    .or(z.literal('')),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
})

export type ShortenUrlFormValues = z.infer<typeof ShortenUrlSchema>
