import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import { Product } from '../types/Product';

const PRODUCTS_COLLECTION = 'products';

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsRef, 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error('Error getting products by category:', error);
    throw error;
  }
};

// Add new product
export const addProduct = async (productData: Omit<Product, 'id'>): Promise<string> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const docRef = await addDoc(productsRef, {
      ...productData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (productId: string, productData: Partial<Product>): Promise<void> => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Real-time listener for products
export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  const q = query(productsRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    callback(products);
  });
};

// Migrate existing products to Firebase (run once)
export const migrateProductsToFirebase = async (products: Product[]): Promise<void> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    
    for (const product of products) {
      const { id, ...productData } = product;
      await addDoc(productsRef, {
        ...productData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }
    
    console.log('Products migrated successfully!');
  } catch (error) {
    console.error('Error migrating products:', error);
    throw error;
  }
};
