export default function ProductCatalog() {
    const products = [
      { sku: 'nestle_000', name: 'Nescafé Original Instant Coffee (7oz)', price: 7.99 },
      { sku: 'nestle_001', name: 'Nestlé Carnation Evaporated Milk (12oz)', price: 2.49 },
      { sku: 'nestle_002', name: 'Coffee-mate Original Creamer (16oz)', price: 4.29 },
      { sku: 'nestle_003', name: 'Nestlé Toll House Semi-Sweet Morsels (12oz)', price: 4.99 },
      { sku: 'nestle_004', name: 'Nesquik Chocolate Powder Mix (18.7oz)', price: 5.29 },
      { sku: 'nestle_005', name: 'Maggi Chicken Bouillon Cubes (100ct)', price: 3.99 },
      { sku: 'nestle_006', name: 'La Lechera Sweetened Condensed Milk (14oz)', price: 2.99 },
      { sku: 'nestle_007', name: 'Nestlé Table Cream (7.6oz)', price: 1.99 },
      { sku: 'nestle_008', name: 'Maggi Seasoning Sauce (6.7oz)', price: 3.49 },
      { sku: 'nestle_009', name: 'Nido Fortificada Dry Whole Milk (12.6oz)', price: 6.99 }
    ];
  
    return (
      <div className="h-full bg-gray-50 rounded-md p-4">
        <h2 className="text-lg font-bold mb-4">Product Catalog</h2>
        <ul className="space-y-2">
          {products.map((product) => (
            <li key={product.sku} className="flex flex-col p-2 border-b">
              <span className="font-medium">{product.name}</span>
              <div className="flex justify-between text-sm text-gray-600">
                <span>SKU: {product.sku}</span>
                <span>${product.price.toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }