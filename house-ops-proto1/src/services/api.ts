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

// Helpers
const loadData = <T,>(key: string, defaultValue: T): T => {
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return defaultValue;
    }
  }
  return defaultValue;
};

const saveData = <T,>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Mock Data persisted in localStorage
let products: Product[] = loadData<Product[]>('api_products', [
  { id: '1', name: 'Detergente', category: 'Limpeza', stock: 2 },
  { id: '2', name: 'Leite', category: 'Alimentos', stock: 6 },
]);

let cartList: SupermarketItem[] = loadData<SupermarketItem[]>('api_cart', [
  { id: '1', name: 'Maçãs', quantity: 5, completed: false },
  { id: '2', name: 'Pão de Forma', quantity: 1, completed: true },
]);

let tasks: Task[] = loadData<Task[]>('api_tasks', [
  { id: '1', title: 'Limpar banheiro', completed: false, date: new Date().toISOString().split('T')[0] },
  { id: '2', title: 'Pagar conta de luz', completed: true, date: new Date().toISOString().split('T')[0] },
]);

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
    saveData('api_products', products);
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
    saveData('api_cart', cartList);
    return true;
  },
  addSupermarketItem: async (item: Omit<SupermarketItem, 'id'>) => {
    await delay(600);
    const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
    cartList.push(newItem);
    saveData('api_cart', cartList);
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
    saveData('api_tasks', tasks);
    return true;
  },
  addTask: async (task: Omit<Task, 'id'>) => {
    await delay(600);
    const newTask = { ...task, id: Math.random().toString(36).substr(2, 9) };
    tasks.push(newTask);
    saveData('api_tasks', tasks);
    return newTask;
  }
};
