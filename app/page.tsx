import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function Home() {
  const { data: products } = await supabase.from('products').select('*')

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">ร้านค้าของฉัน</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg shadow">
            <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover mb-4" />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-blue-600 font-bold mt-2">{product.price} บาท</p>
          </div>
        ))}
      </div>
    </main>
  )
}