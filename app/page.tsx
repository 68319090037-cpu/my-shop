import { createClient } from '@supabase/supabase-js'

// เชื่อมต่อกับ Supabase ผ่าน Environment Variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function Home() {
  // ดึงข้อมูลสินค้าจากตาราง products
  const { data: products, error } = await supabase
    .from('products')
    .select('*')

  // กรณีเกิด Error จากการเชื่อมต่อ
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-red-600">
          <h1 className="font-bold text-xl mb-2">เกิดข้อผิดพลาดในการเชื่อมต่อ</h1>
          <p>{error.message}</p>
          <p className="text-sm mt-2 opacity-70">โปรดตรวจสอบไฟล์ .env.local และสิทธิ์ RLS ใน Supabase</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Online Store</h1>
          <p className="text-gray-600">ยินดีต้อนรับสู่ร้านค้าของฉัน เลือกชมสินค้าได้เลยครับ</p>
        </header>

        {/* ตรวจสอบว่ามีข้อมูลสินค้าหรือไม่ */}
        {!products || products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border">
            <p className="text-gray-400 text-lg">ยังไม่มีสินค้าในระบบ... ลองเพิ่มข้อมูลใน Supabase ดูนะ!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col">
                {/* ส่วนรูปภาพสินค้า */}
                <div className="h-56 bg-gray-200">
                  <img 
                    src={product.image_url || 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* รายละเอียดสินค้า */}
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h2>
                  <p className="text-2xl font-black text-blue-600 mb-4">
                    {Number(product.price).toLocaleString()} <span className="text-sm font-normal text-gray-500">บาท</span>
                  </p>
                  
                  <button className="mt-auto w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <span>สั่งซื้อผ่าน Line</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}