import { useEffect } from 'react';
import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  id: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => void;
  removeProduct: (productId: number) => void;
  updateProductAmount: (id: number, amount: number) => void;
  productsList: Product[];
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [productsList, setProductsList] = useState<Product[]>([])
  const [stockList, setStockList] = useState<UpdateProductAmount[]>([])
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')
    if (storagedCart) { return JSON.parse(storagedCart); }
    return [];
  });

  function tentaPegarProducts() {
      api.get('products')
        .then((response: any) => setProductsList(response.data))
        .catch((error: any) => { console.log("deu merda pegando a lista 'products' da api ", error) })
    
  }
  function tentaPegarStock() {
      api.get('/stock')
        .then((response: any) => { setStockList(response.data) })
        .catch((error: any) => { console.log("deu merda pegando a lista 'products' da api ", error) })
  }
  async function GetApiInformations() {
    let a = await tentaPegarProducts()
    tentaPegarStock()
  }
  useEffect(() => {
    GetApiInformations()
  }, [])


  function atualizarCarrinho(cart: Product[]) {
    setCart(cart);
    localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
    console.log('atualizei o cart e é: ', cart)
  }
  const addProduct = (productId: number) => {
    // por enquanto essa função só atualiza o cart!!!

    try {
      let cartIds = cart.map((product: Product) => product.id)
      if (cartIds.includes(productId)) {
        updateProductAmount(productId, 1)
      } else {
        let newProduct = {} as Product
        productsList.forEach((product: Product) => {
          if (product.id === productId) { newProduct = product }
        })
        newProduct.amount = 1;
        atualizarCarrinho([...cart, newProduct])
      }
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const newCart = [] as Product[];
      for (let product of cart) {
        if (product.id !== productId) {
          newCart.push(product);
        }
      }
      atualizarCarrinho(newCart)
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async (id: number, amount: number) => {
    try {
      let newCart = []
      let updatedProduct = {} as Product
      for (let product of cart) {
        updatedProduct = product
        if (updatedProduct.id === id) {
          if (amount === -1) {
            if (updatedProduct.amount > 0) {
              updatedProduct.amount -= 1
            } else {
              return
            }
          } else
            for (let stockProduct of stockList) {
              if (stockProduct.id === id) {
                if (updatedProduct.amount + 1 <= stockProduct.amount) { updatedProduct.amount += amount }
                else { toast.error('Quantidade solicitada fora de estoque'); }
              }
            }
        }
        if (updatedProduct.amount > 0) {
          newCart.push(updatedProduct)
        }

      }
      atualizarCarrinho(newCart)

    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount, productsList, }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
