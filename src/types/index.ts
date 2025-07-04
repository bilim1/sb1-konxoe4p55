export interface House {
  id: number;
  name: string;
  area: number;
  rooms: number;
  price: {
    rent: number;
    buy: number;
  };
  images: string[];
  description: string;
  materials: string[];
  features: string[];
  floorPlan?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}