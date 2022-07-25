import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart, productsList } = useCart();
  const [cartItemsAmount,setCartItemsAmount] =useState<CartItemsAmount>({}as CartItemsAmount)
  
  useEffect(()=>{
    let temporaryItensAmount = {} as CartItemsAmount
    for (let product of cart) {
      temporaryItensAmount[product.id] = product.amount
    }
    setCartItemsAmount(temporaryItensAmount)
  },[cart])

  function loadProducts(productsList: Product[]): void {
    let productsFormatted: ProductFormatted[] = []
    for (let product of productsList) {
      let formattedProduct = { ...product, priceFormatted: formatPrice(product.price) }
      productsFormatted.push(formattedProduct)
    }
    setProducts(productsFormatted)
  }
  useEffect(() => {
    //this function loads the formattedProducts based on the productsList when the page loads
    loadProducts(productsList);
  }, [productsList]);

  function handleAddProduct(id: number) {
    addProduct(id)
  }

  return (
    <ProductList>
      {products.map(product => {
        return (
          <li key={product.id}>
            <img src={product.image} alt={product.title} />
            <strong>{product.title}</strong>
            <span>{product.priceFormatted}</span>
            <button
              type="button"
              data-testid="add-product-button"
            onClick={() => handleAddProduct(product.id)}
            >
              <div data-testid="cart-product-quantity">
                <MdAddShoppingCart size={16} color="#FFF" />
                {cartItemsAmount[product.id] || 0}
              </div>

              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
        )
      })}
    </ProductList>
  );
};

export default Home;
