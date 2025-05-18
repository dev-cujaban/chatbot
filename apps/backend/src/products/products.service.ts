import { Injectable, OnModuleInit } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

export interface Product {
  displayTitle: string;
  embeddingText: string;
  url: string;
  imageUrl: string;
  productType: string;
  discount: number;
  price: string;
  variants: string;
  createDate: string;
}

@Injectable()
export class ProductsService implements OnModuleInit {
  private products: Product[] = [];

  onModuleInit() {
    const csvFilePath = path.resolve(
      process.cwd(),
      'assets/product_list_fixed.csv',
    );
    const csvContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
    });
    this.products = records.map((r: Product) => ({
      displayTitle: r.displayTitle,
      embeddingText: r.embeddingText,
      url: r.url,
      imageUrl: r.imageUrl,
      productType: r.productType,
      discount: Number(r.discount),
      price: r.price,
      variants: r.variants,
      createDate: r.createDate,
    }));
  }

  searchProducts(query: string): Product[] {
    query = query.toLowerCase();
    return this.products.filter(
      (p) =>
        p.displayTitle.toLowerCase().includes(query) ||
        p.embeddingText.toLowerCase().includes(query) ||
        p.productType.toLowerCase().includes(query),
    );
  }
}
