import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const  {data:addedProduct} = await api.get(`/products/${productId}`); 
      const  {data:stockInfo} = await api.get(`/stock/${productId}`);

      const updatedCart = [...cart]
      const productOnCart = updatedCart.find((product)=>(product.id===productId));

      const stockAmount = stockInfo.data;
      const currentAmount = productOnCart ? productOnCart.amount : 0;
      const amount = currentAmount + 1;

      if(stockAmount < amount){
        toast.error('Quantidade solicitada fora de estoque');
        return
      }

      if(productOnCart){
        productOnCart.amount = amount;
      }else{
       const newProduct={...addedProduct, amount: 1};
       updatedCart.push(newProduct);
      }
      setCart(updatedCart);
      await localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart));

    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
