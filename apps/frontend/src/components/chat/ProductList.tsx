// components/ProductList.tsx

import { Percent } from "lucide-react";
import type { Product } from "../../utils/types";

/**
 * A component that renders a scrollable list of product cards.
 * Each product displays its image, title (as a link), price, discount icon (if any), and type.
 *
 * @param products - An array of Product objects to display.
 */
export default function ProductList({ products }: { products: Product[] }) {
  return (
    // Scrollable vertical list of products with spacing between items
    <ul className="space-y-3 max-h-60 overflow-y-auto">
      {products.map((product, i) => (
        <li
          key={i}
          className="flex gap-3 items-center border-b pb-2 border-gray-300 dark:border-gray-600"
        >
          {/* Product image */}
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-12 h-12 object-cover rounded"
          />

          {/* Product details */}
          <div className="flex flex-col">
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-bold"
            >
              {product.title}
            </a>

            {/* Product price */}
            <span>{product.price}</span>

            {/* Show discount icon green if discount is available */}
            {product.discount !== undefined ? (
              <Percent
                size={16}
                className={
                  !!product.discount ? "text-green-500" : "text-red-500"
                }
              />
            ) : null}

            {/* Product type description */}
            <small className="text-gray-500 dark:text-gray-400">
              {product.productType}
            </small>
          </div>
        </li>
      ))}
    </ul>
  );
}
