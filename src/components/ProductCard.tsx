
import { Product } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  return (
    <Card className="product-card h-full flex flex-col overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-105"
        />
        <Badge 
          variant="secondary" 
          className="absolute top-2 right-2 capitalize"
        >
          {product.category.replace("'s", '').replace('-', ' ')}
        </Badge>
      </div>
      
      <CardContent className="flex-1 p-4">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating.rate}</span>
          </div>
          <span className="text-xs text-gray-500">
            ({product.rating.count} avaliações)
          </span>
        </div>
        
        <div className="text-lg font-bold text-primary">
          ${product.price.toFixed(2)}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onViewDetails(product)}
          className="w-full"
          size="sm"
        >
          Ver mais
        </Button>
      </CardFooter>
    </Card>
  );
};
