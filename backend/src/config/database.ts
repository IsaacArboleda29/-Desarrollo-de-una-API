import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  const MONGO_URI = process.env['MONGO_URI'];

  if (!MONGO_URI) {
    console.error('❌ Falta la variable MONGO_URI en el archivo .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('🔄 [Database]: Conexión exitosa a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error crítico al conectar a la base de datos:', error);
    process.exit(1);
  }
};