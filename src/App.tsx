import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Plus,
  Minus,
  X,
  Instagram,
  MessageCircle,
  ChevronRight,
  UtensilsCrossed,
  Pizza,
  IceCream,
  Beer
} from 'lucide-react';
import { MENU_ITEMS, WHATSAPP_NUMBER, INSTAGRAM_HANDLE } from './constants';
import { MenuItem, CartItem } from './types';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('combos');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categories = [
    { id: 'combos', label: 'Combos', icon: UtensilsCrossed },
    { id: 'salgadas', label: 'Salgadas', icon: Pizza },
    { id: 'doces', label: 'Doces', icon: IceCream },
    { id: 'bebidas', label: 'Bebidas', icon: Beer },
  ];

  const filteredItems = useMemo(() =>
    MENU_ITEMS.filter(item => item.category === activeCategory),
    [activeCategory]
  );

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const cartTotal = useMemo(() =>
    cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    [cart]
  );

  const cartCount = useMemo(() =>
    cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const handleCheckout = () => {
    const message = `Olá! Gostaria de fazer um pedido:\n\n${cart.map(item =>
      `• ${item.quantity}x ${item.name} (R$ ${(item.price * item.quantity).toFixed(2)})`
    ).join('\n')}\n\n*Total: R$ ${cartTotal.toFixed(2)}*`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-sans selection:bg-amber-500/30">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#1a1a1a]/80 backdrop-blur-md border-bottom border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="Logo Nossa Massa"
              className="w-16 h-16 object-contain drop-shadow-[0_2px_8px_rgba(180,80,0,0.5)]"
            />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight text-amber-500 uppercase leading-none">Esfiharia</h1>
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/50 font-semibold mt-0.5">Nossa Massa</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href={`https://instagram.com/${INSTAGRAM_HANDLE.replace('@', '')}`}
              target="_blank"
              className="text-white/60 hover:text-amber-500 transition-colors">
              <Instagram size={20} />
            </a>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-white/80 hover:text-amber-500 transition-colors"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#1a1a1a]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="max-w-2xl mx-auto px-4 pb-2 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 min-w-max">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/30'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
              >
                <cat.icon size={16} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 pb-32">
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={item.id}
                className="group bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-white/[0.08] transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-white/90 group-hover:text-amber-500 transition-colors">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-white/40 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  <p className="text-amber-500 font-bold mt-2">
                    R$ {item.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  {cart.find(i => i.id === item.id) ? (
                    <div className="flex items-center bg-amber-600 rounded-full p-1 shadow-lg">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">
                        {cart.find(i => i.id === item.id)?.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item)}
                      className="w-10 h-10 bg-white/10 hover:bg-amber-600 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    >
                      <Plus size={20} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#1a1a1a] border-l border-white/10 z-50 flex flex-col shadow-2xl"
            >
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="text-amber-500" />
                  <h2 className="text-xl font-bold">Seu Pedido</h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/40 space-y-4">
                    <ShoppingBag size={64} strokeWidth={1} />
                    <p className="text-lg">Seu carrinho está vazio</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="text-amber-500 font-semibold hover:underline"
                    >
                      Ver cardápio
                    </button>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-amber-500 text-sm font-bold">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center bg-white/5 rounded-full p-1 ml-4">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 hover:bg-white/10 rounded-full"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="p-1 hover:bg-white/10 rounded-full"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-white/5 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-amber-500">R$ {cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-amber-900/20 active:scale-[0.98]"
                  >
                    <MessageCircle size={20} />
                    Finalizar no WhatsApp
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Cart Button (Mobile) */}
      {cartCount > 0 && !isCartOpen && (
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 left-4 right-4 bg-amber-600 text-white py-4 rounded-2xl font-bold flex items-center justify-between px-6 shadow-2xl shadow-amber-900/40 z-40 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 px-2 py-1 rounded text-xs">
              {cartCount}
            </div>
            <span>Ver Carrinho</span>
          </div>
          <div className="flex items-center gap-1">
            <span>R$ {cartTotal.toFixed(2)}</span>
            <ChevronRight size={20} />
          </div>
        </motion.button>
      )}

      {/* Footer Info */}
      <footer className="max-w-2xl mx-auto px-4 py-12 text-center text-white/20 text-xs border-t border-white/5">
        <p className="mb-2">Esfiharia Nossa Massa • (13) 99679-7863</p>
        <p>© {new Date().getFullYear()} Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
