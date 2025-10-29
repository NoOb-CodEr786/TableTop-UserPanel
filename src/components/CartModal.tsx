import React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface CartModalProps {
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ onClose }) => {
  const router = useRouter();
  
  // Get cart data directly from store to avoid prop drilling and unnecessary re-renders
  const { cartItems, isCartVisible } = useCartStore();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleViewCart = () => {
    router.push("/cart");
    onClose();
  };

  // Only show modal if cart has items (regardless of isCartVisible state)
  const shouldShow = cartItems.length > 0;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-32 left-4 right-4 z-50 mx-auto max-w-2xl"
        >
          <div className="overflow-hidden">
            <div className="p-4 rounded-2xl bg-zinc-100/95 border border-zinc-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-9 h-9 p-1 text-black" />
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-black">
                      {totalItems} {totalItems === 1 ? "item" : "items"} added
                      to cart
                    </span>
                    <p className="text-base sm:text-lg font-bold text-black">
                      ₹{totalAmount}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleViewCart}
                  className="text-zinc-100 bg-theme-secondary-dark px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                >
                  View Cart
                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                  >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartModal;