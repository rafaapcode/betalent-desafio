const UserController = () => import('#controllers/users_controller')
const HealthController = () => import('#controllers/health_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const TransactionsController = () => import('#controllers/transaction_controller')
const GatewaysController = () => import('#controllers/gateways_controller')
const ClientsController = () => import('#controllers/clients_controller')
const ProductsController = () => import('#controllers/products_controller')

router.get('/health', [HealthController, 'health'])
router.post('/login', [UserController, 'loginUser'])
router.post('/buy', [TransactionsController, 'createTransaction'])

// Users
router
  .group(() => {
    router.post('', [UserController, 'createUser'])
    router.patch('/:email', [UserController, 'updateUser'])
    router.delete('/:email', [UserController, 'deleteUser'])
    router.get('/:filter', [UserController, 'getUser'])
    router.get('', [UserController, 'getAllUser'])
  })
  .prefix('/user')
  .use(middleware.auth())
  .use(middleware.authorizeUser())

// Products
router
  .group(() => {
    router.post('', [ProductsController, 'createProduct'])
    router.get('/:id', [ProductsController, 'getProduct'])
    router.delete('/:id', [ProductsController, 'deleteProduct'])
    router.put('/:id', [ProductsController, 'updateProduct'])
    router.get('', [ProductsController, 'getAllProduct'])
  })
  .prefix('/product')
  .use(middleware.auth())
  .use(middleware.authorizeProduct())

// Gateway
router
  .group(() => {
    router.get('toggle/:name', [GatewaysController, 'toggleGateway'])
    router.post('priority/:name', [GatewaysController, 'changeThePriority'])
  })
  .prefix('/gateway')
  .use(middleware.auth())

// Clients
router
  .group(() => {
    router.post('', [ClientsController, 'createClients'])
    router.put('/:email', [ClientsController, 'updateClients'])
    router.delete('/:email', [ClientsController, 'deleteClients'])
    router.get('/:filter', [ClientsController, 'getClients'])
    router.get('', [ClientsController, 'getAllClients'])
    router.get('/details/:email', [ClientsController, 'getDetails'])
  })
  .prefix('/clients')
  .use(middleware.auth())

// Transactions
router
  .group(() => {
    router.get('', [TransactionsController, 'getAllTransaction'])
    router.get('/:id', [TransactionsController, 'getDetailsOfTransaction'])
    router
      .post('/refund/:id', [TransactionsController, 'refundTransaction'])
      .use(middleware.authorizeRefund())
  })
  .prefix('/transactions')
  .use(middleware.auth())
