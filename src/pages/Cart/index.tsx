import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();
 
  function setKeyAndValuePairs(object:any,target:object) {
    for (var [key, value] of Object.entries(target)) {
      object[key] = value
    }
}
  const cartFormatted = cart.map(product =>  {
    let TempProduct={} as any
    setKeyAndValuePairs(TempProduct,product)
    TempProduct['priceFormatted'] = formatPrice(product.price)
    TempProduct['subTotal'] = product.price*product.amount
   
    return TempProduct
    
  })
  // console.log('cartFormatted é: ',cartFormatted)
  const total =
    formatPrice(
      cartFormatted.reduce((sumTotal, product) => {
        // console.log('sumTotal: ',sumTotal)
        // console.log('product: ',product)
        return sumTotal + product.subTotal
      }, 0)
    )

  function handleProductIncrement(id: number) {
    updateProductAmount(id,1)
  }

  function handleProductDecrement(id:number) {
    updateProductAmount(id,-1)
    // TODO
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId)
    // TODO
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
    {cartFormatted.map(product=>{
      return(
      <tr data-testid="product" key={product.id}>
      <td>
        <img src={product.image} alt={product.text} />
      </td>
      <td>
        <strong>{product.text}</strong>
        <span>{product.priceFormatted}</span>
      </td>
      <td>
        <div>
          <button
            type="button"
            data-testid="decrement-product"
          disabled={product.amount <= 1}
          onClick={() => handleProductDecrement(product.id)}
          >
            <MdRemoveCircleOutline size={20} />
          </button>
          <input
            type="text"
            data-testid="product-amount"
            readOnly
            value={product.amount}
          />
          <button
            type="button"
            data-testid="increment-product"
          onClick={() => handleProductIncrement(product.id)}
          >
            <MdAddCircleOutline size={20} />
          </button>
        </div>
      </td>
      <td>
        <strong>{formatPrice(product.subTotal)}</strong>
      </td>
      <td>
        <button
          type="button"
          data-testid="remove-product"
        onClick={() => handleRemoveProduct(product.id)}
        >
          <MdDelete size={20} />
        </button>
      </td>
    </tr>
    )})}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
