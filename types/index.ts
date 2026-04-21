export type Item = {
  id: string;
  name: string;
  unit: string; // liter, kg, pcs
  pricePerUnit?: number; 
};

export type Entry = {
  id: string;
  itemId: string;
  quantity: number;
  date: string; // ISO string
};