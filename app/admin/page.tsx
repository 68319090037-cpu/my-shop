'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// เชื่อมต่อกับ Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [desc, setDesc] = useState('')
  const [image, setImage] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false })
    if (data) setProducts(data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.from('products').insert([
      { name, price: Number(price), description: desc, image_url: image }
    ])
    if (!error) {
      alert('เพิ่มสินค้าสำเร็จ!')
      setName(''); setPrice(''); setDesc(''); setImage('')
      fetchProducts()
    }
  }

  async function deleteProduct(id: number) {
    if (confirm('ยืนยันการลบสินค้า?')) {
      await supabase.from('products').delete().eq('id', id)
      fetchProducts()
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">ระบบจัดการสินค้า (Admin)</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md p-6 rounded-lg mb-10 border">
        <h2 className="text-xl font-semibold">เพิ่มสินค้าใหม่</h2>
        <input className="w-full p-2 border rounded" placeholder="ชื่อสินค้า" value={name} onChange={e => setName(e.target.value)} required />
        <input className="w-full p-2 border rounded" type="number" placeholder="ราคา" value={price} onChange={e => setPrice(e.target.value)} required />
        <textarea className="w-full p-2 border rounded" placeholder="รายละเอียด" value={desc} onChange={e => setDesc(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="ลิงก์รูปภาพ (URL)" value={image} onChange={e => setImage(e.target.value)} />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition">บันทึกสินค้า</button>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">รายการสินค้าในร้าน</h2>
        {products.map(p => (
          <div key={p.id} className="flex justify-between items-center p-4 border rounded bg-gray-50">
            <div>
              <p className="font-bold">{p.name}</p>
              <p className="text-sm text-gray-500">{p.price} บาท</p>
            </div>
            <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:text-red-700">ลบ</button>
          </div>
        ))}
      </div>
    </div>
  )
}