
import { useState, useMemo, useCallback } from 'react';
import { Header } from '../components/Header';
import { Filters } from '../components/Filters';
import { ProductGrid } from '../components/ProductGrid';
import { ProductModal } from '../components/ProductModal';
import { Cart } from '../components/Cart';
import { Footer } from '../components/Footer';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { Product, FilterState } from '../types';

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    priceRange: [0, 1000],
    sortBy: 'popularity',
    searchQuery: '',
  });

  const { data: products = [], isLoading, error } = useProducts();
  const cart = useCart();

  // Calculate max price for slider
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 1000;
    return Math.ceil(Math.max(...products.map(p => p.price)));
  }, [products]);

  // Update price range when max price changes
  useMemo(() => {
    if (filters.priceRange[1] === 1000 && maxPrice !== 1000) {
      setFilters(prev => ({ ...prev, priceRange: [0, maxPrice] }));
    }
  }, [maxPrice, filters.priceRange]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply filters
    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }

    if (filters.searchQuery) {
      result = result.filter(product =>
        product.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    result = result.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Apply sorting
    switch (filters.sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        result.sort((a, b) => b.rating.count - a.rating.count);
        break;
    }

    return result;
  }, [products, filters]);

  const handleSearch = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const handleCategorySelect = useCallback((category: string) => {
    setFilters(prev => ({ ...prev, category }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        onCartClick={() => setIsCartOpen(true)}
        cartItemsCount={cart.totalItems}
        searchQuery={filters.searchQuery}
      />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <Filters
                filters={filters}
                onFiltersChange={setFilters}
                maxPrice={maxPrice}
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {filters.category 
                  ? `${filters.category.replace("'s", '').replace('-', ' ')} (${filteredProducts.length})`
                  : `All Products (${filteredProducts.length})`
                }
              </h2>
            </div>

            <ProductGrid
              products={filteredProducts}
              isLoading={isLoading}
              error={error}
              onProductClick={setSelectedProduct}
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={cart.addToCart}
      />

      {/* Cart */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart.cartItems}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeFromCart}
        totalPrice={cart.totalPrice}
      />
    </div>
  );
};

export default Index;
