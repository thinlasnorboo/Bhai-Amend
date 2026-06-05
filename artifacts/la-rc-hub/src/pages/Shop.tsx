import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import carImagePath from "@assets/car_1780400879313.jpeg";
import { ShoppingCart } from "lucide-react";

// Mock data
const categories = ["All", "Drift RC Cars", "Crawler RC Cars", "Huina Construction Vehicles", "Volvo RC Trucks"];

const products = [
  { id: "1", name: "Yokomo YD-2Z Drift Chassis", category: "Drift RC Cars", price: 249.99, image: carImagePath },
  { id: "2", name: "MST RMX 2.0 RTR", category: "Drift RC Cars", price: 349.99, image: carImagePath },
  { id: "3", name: "Traxxas TRX-4 Sport", category: "Crawler RC Cars", price: 399.99, image: "https://images.unsplash.com/photo-1594815442531-15570bbccb35?q=80&w=400&auto=format&fit=crop" },
  { id: "4", name: "Axial SCX10 III Base Camp", category: "Crawler RC Cars", price: 389.99, image: "https://images.unsplash.com/photo-1594815442531-15570bbccb35?q=80&w=400&auto=format&fit=crop" },
  { id: "5", name: "Huina 1580 Excavator V4", category: "Huina Construction Vehicles", price: 549.99, image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=400&auto=format&fit=crop" },
  { id: "6", name: "Huina 1573 Dump Truck", category: "Huina Construction Vehicles", price: 299.99, image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=400&auto=format&fit=crop" },
  { id: "7", name: "Volvo A60H Hauler", category: "Volvo RC Trucks", price: 429.99, image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=400&auto=format&fit=crop" },
  { id: "8", name: "Tamiya SCX24 Deadbolt", category: "Crawler RC Cars", price: 134.99, image: "https://images.unsplash.com/photo-1594815442531-15570bbccb35?q=80&w=400&auto=format&fit=crop" },
];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { addItem } = useCart();
  const { toast } = useToast();

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Layout>
      <div className="bg-black py-16 border-b border-white/10 relative">
        <div className="absolute inset-0 bg-checkered opacity-10 pointer-events-none" />
        <div className="container px-4 md:px-6 relative z-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-wider mb-4">
            RC Pro Shop
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Premium chassis, RTR kits, and hop-up parts. We only stock what we race.
          </p>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-colors ${
                activeCategory === cat 
                  ? "bg-primary text-white" 
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-card border border-white/10 rounded-xl overflow-hidden group product-glow transition-all duration-300 flex flex-col"
              data-testid={`card-product-${product.id}`}
            >
              <div className="aspect-[4/3] overflow-hidden bg-black relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur px-2 py-1 rounded border border-white/10 text-xs font-bold text-accent uppercase">
                  {product.category.split(' ')[0]}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-2 leading-tight flex-1">
                  {product.name}
                </h3>
                <div className="text-2xl font-display font-bold text-primary mb-4">
                  ${product.price.toFixed(2)}
                </div>
                <div className="flex gap-2 mt-auto">
                  <Button 
                    className="flex-1 bg-white text-black hover:bg-gray-200 font-bold"
                    onClick={() => handleAddToCart(product)}
                    data-testid={`button-add-cart-${product.id}`}
                  >
                    Buy Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="border-white/20 hover:bg-white/10"
                    onClick={() => handleAddToCart(product)}
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
