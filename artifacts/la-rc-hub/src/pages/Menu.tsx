import { Layout } from "@/components/layout/Layout";
import { Coffee } from "lucide-react";

const menuItems = {
  "Coffee": [
    { name: "Espresso", price: 3.50, desc: "Double shot of our house blend" },
    { name: "Cappuccino", price: 4.50, desc: "Espresso, steamed milk, deep foam" },
    { name: "Latte", price: 5.00, desc: "Espresso, steamed milk, light foam" },
    { name: "Cold Brew", price: 5.50, desc: "Steeped for 18 hours, served over ice" },
  ],
  "Tea": [
    { name: "Masala Chai", price: 4.50, desc: "Spiced black tea with steamed milk" },
    { name: "Green Tea", price: 3.50, desc: "Organic sencha" },
    { name: "Iced Tea", price: 4.00, desc: "House brewed black tea, lemon" },
  ],
  "Cold Drinks": [
    { name: "Lemonade", price: 4.00, desc: "Fresh squeezed, lightly sweetened" },
    { name: "Iced Coffee", price: 4.50, desc: "Chilled house drip over ice" },
    { name: "Mojito (Virgin)", price: 5.50, desc: "Mint, lime, soda water" },
  ],
  "Burgers": [
    { name: "Classic Pit Burger", price: 12.00, desc: "Beef patty, cheddar, lettuce, tomato, house sauce" },
    { name: "Spicy Drift Burger", price: 14.00, desc: "Beef patty, pepper jack, jalapeños, spicy mayo" },
    { name: "Double Patty", price: 16.00, desc: "Two beef patties, double cheese, bacon" },
  ],
  "Sandwiches": [
    { name: "Club Sandwich", price: 11.00, desc: "Turkey, ham, bacon, lettuce, tomato, mayo" },
    { name: "Grilled Veggie", price: 10.00, desc: "Zucchini, bell peppers, mozzarella, pesto" },
  ],
  "Snacks": [
    { name: "Fries", price: 5.00, desc: "Crispy shoestring fries" },
    { name: "Nachos", price: 8.00, desc: "Tortilla chips, cheese sauce, jalapeños, salsa" },
    { name: "Onion Rings", price: 6.00, desc: "Beer battered, served with ranch" },
  ]
};

export default function Menu() {
  return (
    <Layout>
      <div className="bg-black py-16 border-b border-white/10 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 pointer-events-none" />
        <div className="container px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/20 text-primary mb-4 border border-primary/30">
            <Coffee className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-wider mb-4">
            Pit Stop Cafe Menu
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Fuel up for your next heat. Order at the counter.
          </p>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto">
          {Object.entries(menuItems).map(([category, items]) => (
            <div key={category} className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-accent uppercase tracking-wider border-b border-white/10 pb-4">
                {category}
              </h2>
              <div className="space-y-6">
                {items.map((item, index) => (
                  <div key={index} className="group">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex-1 border-b border-dashed border-white/20 mx-4 relative top-[-4px]"></div>
                      <span className="text-lg font-mono text-white">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
