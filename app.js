require('dotenv').config();
const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express();

// Configuración de EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware de sesiones
app.use(session({
  secret: process.env.JWT_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true en producción con HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Middleware para method override
app.use(methodOverride('_method'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para procesar datos de formularios

// Import routers existentes
const examenesRouter = require('./routes/ExamenesRouter');
const citasRouter = require('./routes/CitasRouter');
const areasRouter = require('./routes/AreasRouter');
const metodosPagoRouter = require('./routes/MetodosPagoRouter');

// Import routers nuevos para Insumo y Orden
const insumosRouter = require('./routes/insumos');
const ordenesRouter = require('./routes/ordenes');

// Import router de autenticación
const authRouter = require('./routes/auth');

// Import router de administración
const adminRouter = require('./routes/admin');

// Use routers existentes (manejan tanto rutas API como de vistas)
app.use('/', examenesRouter);
app.use('/', citasRouter);
app.use('/', areasRouter);
app.use('/', metodosPagoRouter);

// Use routers nuevos (manejan tanto rutas API como de vistas)
app.use('/', insumosRouter);
app.use('/', ordenesRouter);

// Use router de autenticación
app.use('/auth', authRouter);

// Use router de administración
app.use('/admin', adminRouter);

// Ruta raíz - redirige según estado de autenticación
app.get('/', (req, res) => {
  if (req.session.user) {
    // Usuario autenticado - ir al dashboard
    res.redirect('/dashboard');
  } else {
    // Usuario no autenticado - ir al login
    res.redirect('/login');
  }
});

// Página de login (pública) - ruta directa
app.get('/login', require('./controllers/UserController').showLoginForm);

// Dashboard (requiere autenticación)
app.get('/dashboard', require('./middleware/auth').requireWebAuth, (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard - Laboratorio Glorimar',
    user: req.session.user,
    error: req.query.error,
    success: req.query.success
  });
});

const PORT = 8888; // Puerto principal
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});