export function getSuggestedGstRate(categoryId: string, price: number, platformId: string): number {
  // Only apply custom GST logic to Indian platforms
  if (platformId !== 'amazon-in' && platformId !== 'flipkart' && platformId !== 'meesho') {
    return 0; // Or whatever default is applicable, though other countries have different VAT, assuming 0 for now.
  }

  const lowerCat = categoryId.toLowerCase();

  // Books are 0%
  if (lowerCat.includes('book')) return 0;

  // Jewelry is 3%
  if (lowerCat.includes('jewelry')) return 0.03;

  // Groceries / Food can be tricky, typically essential is 0% to 5%, processed is 12%-18%. Defaulting to 12% as a middle ground for generic "Grocery".
  if (lowerCat.includes('grocery') || lowerCat.includes('food')) return 0.12;

  // Apparel & Footwear: 5% up to ₹2500, else 18%
  if (
    lowerCat.includes('apparel') ||
    lowerCat.includes('clothing') ||
    lowerCat.includes('shoes') ||
    lowerCat.includes('footwear') ||
    lowerCat.includes('bags')
  ) {
    if (price <= 2500) {
      return 0.05;
    }
    return 0.18;
  }

  // Consumer electronics, accessories, beauty, home & kitchen typically 18% standard
  return 0.18;
}
