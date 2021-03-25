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

    // if (storagedCart) {
    //   return JSON.parse(storagedCart);
    // }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const isProductOnCart = cart.find((product)=>(product.id===productId));
      const productAmount = isProductOnCart ? isProductOnCart.amount : 0;
      
      const  {data:stockInfo} = await api.get(`/stock/${productId}`);
      
      if(stockInfo.amount < productAmount){
        toast.error('Quantidade solicitada fora de estoque');
        return
      }


      const  {data:addedProduct} = await api.get(`/products/${productId}`); 
      setCart((cart)=>{
        if(!(isProductOnCart)){
          return([...cart, {...addedProduct, amount:1}]);
        }else{
          return cart.map((product)=>{
            if(product.id===productId){
              const updatedProduct = {...product}
              updatedProduct.amount+=1;
              return updatedProduct;
            }
              return product
          });
        }
      });



      // await localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))


    } catch (e) {
      if(e){
        toast.error(e);

      }else{
        toast.error('Erro na adição do produto');
      }
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
