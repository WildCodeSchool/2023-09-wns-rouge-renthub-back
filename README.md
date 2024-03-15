### WildCodeSchool

Group project carried out as part of the training at the Wild Code School for the preparation of the title "Application developer designer".

### "RentHub" project

E-commerce. Sports equipment rental.

### Project launch

- Copy `.env.sample` and create `.env`
- Lunch options :
  - with docker and docker-compose.yaml. Command in root : `docker compose up`
  - `npm run start`

### COMMANDS scripts

- `npm run start`
- `npm run test` => testing app with jest library
- `npm run build` => build an app

### TESTING with jest

- `jest.config.ts` is present in the root. Configure if needed.
- Create test in the app and execute command in root : `npm run test`

### SUPPORT

- `docker-compose.yaml` :
  services:
  backend:
  build:
  context: ./backend
  target: dev
  container_name: renthub_backend
  ports: - 5000:5000
  volumes: - ./backend/src/:/app/src/ - assets:/app/public/
  env_file: ./backend/.env
  networks: - rethub-network
  postgres_db:
  image: postgres
  env_file: ./backend/.env
  volumes: - postgres-data:/var/lib/postgresql/data
  ports: - "5432:5432"
  networks: - rethub-network
  frontend:
  build:
  context: ./frontend
  target: dev
  container_name: renthub_frontend
  ports: - 3000:3000
  volumes: - ./frontend/src:/app/src
  networks:
  rethub-network:
  driver: bridge
  volumes:
  assets:
  postgres-data:
