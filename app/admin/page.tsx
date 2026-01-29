'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

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

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false })
    if (error) console.error("ดึงข้อมูลไม่ได้:", error.message)
    if (data) setProducts(data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // ลองส่งข้อมูล
    const { error } = await supabase.from('products').insert([
      { name, price: Number(price), description: desc, image_url: image }
    ])

    if (error) {
      alert('บันทึกไม่ได้: ' + error.message)
      console.error("Error details:", error)
    } else {
      alert('เพิ่มสินค้าสำเร็จ!')
      setName(''); setPrice(''); setDesc(''); setImage('')
      fetchProducts()
    }
  }

  async function deleteProduct(id: number) {
    if (confirm('ยืนยันการลบ?')) {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) alert('ลบไม่ได้: ' + error.message)
      fetchProducts()
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Admin Dashboard</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-xl shadow-sm border mb-10">
        <input className="w-full p-3 border rounded-lg" placeholder="ชื่อสินค้า" value={name} onChange={e => setName(e.target.value)} required />
        <input className="w-full p-3 border rounded-lg" type="number" placeholder="ราคา" value={price} onChange={e => setPrice(e.target.value)} required />
        <textarea className="w-full p-3 border rounded-lg" placeholder="รายละเอียด" value={desc} onChange={e => setDesc(e.target.value)} />
        <input className="w-full p-3 border rounded-lg" placeholder="ลิงก์รูปภาพ (URL)" value={image} onChange={e => setImage(e.target.value)} />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">บันทึกสินค้าลงร้าน</button>
      </form>

      <div className="space-y-3">
        <h2 className="text-xl font-bold">สินค้าปัจจุบัน</h2>
        {products.length === 0 && <p className="text-gray-400">ยังไม่มีสินค้าในระบบ</p>}
        {products.map(p => (
          <div key={p.id} className="flex justify-between items-center p-4 border rounded-lg bg-white shadow-sm">
            <div>
              <p className="font-bold text-lg">{p.name}</p>
              <p className="text-blue-500 font-semibold">{p.price} บาท</p>
            </div>
            <button onClick={() => deleteProduct(p.id)} className="bg-red-50 text-red-500 px-4 py-2 rounded-md hover:bg-red-100 transition">ลบ</button>
          </div>
        ))}
      </div>
    </div>
  )
}  