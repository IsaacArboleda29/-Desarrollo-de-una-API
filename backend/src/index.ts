import 'dotenv/config';
import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { MongoEmployeeRepository } from './repositories/mongo-employee.repository.js';

const PORT = Number(process.env['PORT'] ?? 3000);

const bootstrap = async (): Promise<void> => {
  await connectDatabase();

  // Único lugar donde se decide QUÉ implementación de repositorio se usa
  const app = createApp(new MongoEmployeeRepository());

  app.listen(PORT, () => {
    console.log(` http://localhost:${PORT}`);
  });
};

void bootstrap();