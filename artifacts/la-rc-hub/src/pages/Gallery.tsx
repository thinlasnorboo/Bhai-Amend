import { Layout } from "@/components/layout/Layout";
import carImagePath from "@assets/car_1780400879313.jpeg";

export default function Gallery() {
  const sections = [
    {
      title: "RC Cars",
      images: [
        carImagePath,
        carImagePath,
        carImagePath,
      ]
    },
    {
      title: "Drift Track",
      images: [
        "https://images.unsplash.com/photo-1511993226957-cd166ada52d8?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1536349788264-00edbcbf1bf6?q=80&w=800&auto=format&fit=crop",
      ]
    },
    {
      title: "Cafe Area",
      images: [
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop",
      ]
    }
  ];

  return (
    <Layout>
      <div className="bg-black py-16 border-b border-white/10 relative">
        <div className="container px-4 md:px-6 relative z-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-wider mb-4">
            Gallery
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Sights from the track, the shop, and the cafe.
          </p>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-12">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="mb-16">
            <h2 className="text-2xl font-display font-bold text-accent uppercase tracking-wider mb-8 inline-block border-b-2 border-primary pb-2">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.images.map((img, iIdx) => (
                <div 
                  key={iIdx} 
                  className={`relative group overflow-hidden rounded-xl bg-card border border-white/5 aspect-square ${
                    iIdx === 0 && sIdx === 0 ? "md:col-span-2 md:row-span-2 aspect-auto" : ""
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${section.title} ${iIdx + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <span className="text-white font-bold tracking-widest uppercase border border-white/20 px-4 py-2 bg-black/50 backdrop-blur">View</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
