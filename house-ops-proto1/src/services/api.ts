// Simulando os tipos de dados
export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
}

export interface SupermarketItem {
  id: string;
  name: string;
  quantity: number;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string;
}

// Simulando latência de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data
let products: Product[] = [
  { id: '1', name: 'Detergente', category: 'Limpeza', stock: 2 },
  { id: '2', name: 'Leite', category: 'Alimentos', stock: 6 },
];

let cartList: SupermarketItem[] = [
  { id: '1', name: 'Maçãs', quantity: 5, completed: false },
  { id: '2', name: 'Pão de Forma', quantity: 1, completed: true },
];

let tasks: Task[] = [
  { id: '1', title: 'Limpar banheiro', completed: false, date: new Date().toISOString().split('T')[0] },
  { id: '2', title: 'Pagar conta de luz', completed: true, date: new Date().toISOString().split('T')[0] },
];

export const api = {
  // --- Produtos ---
  getProducts: async () => {
    await delay(500);
    return [...products];
  },
  addProduct: async (product: Omit<Product, 'id'>) => {
    await delay(600);
    const newProduct = { ...product, id: Math.random().toString(36).substr(2, 9) };
    products.push(newProduct);
    return newProduct;
  },

  // --- Supermercado ---
  getSupermarketList: async () => {
    await delay(500);
    return [...cartList];
  },
  toggleSupermarketItem: async (id: string, completed: boolean) => {
    await delay(300);
    cartList = cartList.map(item => item.id === id ? { ...item, completed } : item);
    return true;
  },
  addSupermarketItem: async (item: Omit<SupermarketItem, 'id'>) => {
    await delay(600);
    const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
    cartList.push(newItem);
    return newItem;
  },

  // --- Tarefas ---
  getTasks: async () => {
    await delay(500);
    return [...tasks];
  },
  toggleTask: async (id: string, completed: boolean) => {
    await delay(300);
    tasks = tasks.map(task => task.id === id ? { ...task, completed } : task);
    return true;
  },
  addTask: async (task: Omit<Task, 'id'>) => {
    await delay(600);
    const newTask = { ...task, id: Math.random().toString(36).substr(2, 9) };
    tasks.push(newTask);
    return newTask;
  }
};
