import { products } from '../data/products';
import { migrateProductsToFirebase } from '../firebase/products';
import { createUser } from '../firebase/auth';

export const setupFirebaseData = async () => {
  try {
    console.log('Setting up Firebase data...');
    
    // Create admin user
    try {
      await createUser('admin@cyborgtech.com', 'admin123', 'Admin CyborgTech', 'admin');
      console.log('Admin user created successfully!');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('Admin user already exists');
      } else {
        console.error('Error creating admin user:', error);
      }
    }
    
    // Migrate products to Firebase
    try {
      await migrateProductsToFirebase(products);
      console.log('Products migrated successfully!');
    } catch (error) {
      console.error('Error migrating products:', error);
    }
    
    console.log('Firebase setup completed!');
    console.log('Admin credentials:');
    console.log('Email: admin@cyborgtech.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error setting up Firebase:', error);
  }
};

// Function to call from browser console for initial setup
(window as any).setupFirebase = setupFirebaseData;
