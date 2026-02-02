# ERD - Cantaritos El Guero

## Diagrama Entidad-Relacion

```
┌─────────────────────────────────────┐
│              users                  │
├─────────────────────────────────────┤
│ PK  id          UUID               │
│     auth_id     UUID?       UNIQUE  │
│     email       VARCHAR     UNIQUE  │
│     name        VARCHAR             │
│     phone       VARCHAR?            │
│     role        Role        USER    │
│     is_active   BOOLEAN     true    │
│     created_at  TIMESTAMP           │
│     updated_at  TIMESTAMP           │
├─────────────────────────────────────┤
│ Role: USER | ADMIN |                │
│       CATALOG_MANAGER |             │
│       STAND_OPERATOR                │
│ stands: StandOperator[] (N:N)       │
└──────────────┬──────────────────────┘
               │ N:N (via stand_operators)
               │
┌──────────────▼──────────────────────┐
│         stand_operators             │
├─────────────────────────────────────┤
│ PK,FK stand_id    UUID              │
│ PK,FK user_id     UUID              │
├─────────────────────────────────────┤
│ UNIQUE(stand_id, user_id)           │
└──────────────┬──────────────────────┘
               │ N:N
               │
┌──────────────▼──────────────────────┐
│              stands                 │
├─────────────────────────────────────┤
│ PK  id          UUID               │
│     name        VARCHAR             │
│     description VARCHAR?            │
│     image       VARCHAR?            │
│     location    VARCHAR?            │
│     is_active   BOOLEAN     true    │
│     created_at  TIMESTAMP           │
│     updated_at  TIMESTAMP           │
├─────────────────────────────────────┤
│ operators: StandOperator[] (N:N)    │
│ products:  Product[] (1:N)          │
└─────────────────────────────────────┘


┌─────────────────────────────────────┐
│            products                 │
├─────────────────────────────────────┤
│ PK  id          UUID               │
│     name        VARCHAR             │
│     description VARCHAR?            │
│     base_price  DECIMAL(10,2)       │
│     image       VARCHAR?            │
│     stock       INT?                │
│     is_active   BOOLEAN     true    │
│ FK  stand_id    UUID?               │
│     created_at  TIMESTAMP           │
│     updated_at  TIMESTAMP           │
├─────────────────────────────────────┤
│ stand_id NULL = producto global     │
│ stand_id UUID = exclusivo del stand │
├─────────────────────────────────────┤
│ sizes: ProductSize[] (1:N)          │
│ modifierGroups: ModifierGroup[] 1:N │
└──────┬──────────────┬───────────────┘
       │ 1:N          │ 1:N
       │              │
       ▼              ▼
┌──────────────┐  ┌───────────────────────────┐
│ product_sizes│  │ product_modifier_groups    │
├──────────────┤  ├───────────────────────────┤
│ PK id        │  │ PK  id          UUID      │
│ FK product_id│  │ FK  product_id  UUID      │
│    name      │  │     name        VARCHAR   │
│    price     │  │     description VARCHAR?  │
│    sort_order│  │     min_select  INT    0  │
│    is_default│  │     max_select  INT    1  │
│    is_active │  │     sort_order  INT    0  │
└──────────────┘  ├───────────────────────────┤
                  │ modifiers: Modifier[] 1:N │
                  └──────────┬────────────────┘
                             │ 1:N
                             ▼
                  ┌───────────────────────────┐
                  │   product_modifiers       │
                  ├───────────────────────────┤
                  │ PK  id               UUID │
                  │ FK  group_id         UUID │
                  │     name          VARCHAR │
                  │     price_adj  DEC(10,2)  │
                  │     is_default   BOOLEAN  │
                  │     is_active    BOOLEAN  │
                  │     sort_order       INT  │
                  └───────────────────────────┘


┌─────────────────────────────────────┐
│             combos                  │
├─────────────────────────────────────┤
│ PK  id          UUID               │
│     name        VARCHAR             │
│     description VARCHAR?            │
│     price       DECIMAL(10,2)       │
│     image       VARCHAR?            │
│     is_active   BOOLEAN     true    │
│     created_at  TIMESTAMP           │
│     updated_at  TIMESTAMP           │
├─────────────────────────────────────┤
│ items: ComboItem[] (1:N)            │
└──────────┬──────────────────────────┘
           │ 1:N
           ▼
┌─────────────────────────────────────┐
│          combo_items                │
├─────────────────────────────────────┤
│ PK  id          UUID               │
│ FK  combo_id    UUID               │
│ FK  product_id  UUID               │
│     quantity    INT         1       │
└─────────────────────────────────────┘


┌─────────────────────────────────────────┐
│              orders                     │
├─────────────────────────────────────────┤
│ PK  id            UUID                  │
│     order_number  VARCHAR       UNIQUE  │
│     qr_code       UUID          UNIQUE  │
│     short_code    VARCHAR(6)    UNIQUE  │
│     status        OrderStatus   PENDING │
│     total         DECIMAL(10,2)         │
│     client_name   VARCHAR               │
│     client_email  VARCHAR               │
│     client_phone  VARCHAR?              │
│     created_at    TIMESTAMP             │
│     paid_at       TIMESTAMP?            │
│     completed_at  TIMESTAMP?            │
├─────────────────────────────────────────┤
│ OrderStatus: PENDING | PAID | PARTIAL   │
│              COMPLETED | CANCELLED      │
├─────────────────────────────────────────┤
│ items: OrderItem[] (1:N)                │
└──────────┬──────────────────────────────┘
           │ 1:N
           ▼
┌─────────────────────────────────────┐
│          order_items                │
├─────────────────────────────────────┤
│ PK  id              UUID           │
│ FK  order_id        UUID           │
│ FK  product_id      UUID?          │
│ FK  combo_id        UUID?          │
│ FK  product_size_id UUID?          │
│     quantity        INT       1    │
│     unit_price      DEC(10,2)      │
│     total_price     DEC(10,2)      │
├─────────────────────────────────────┤
│ modifiers: OrderItemModifier[] 1:N │
│ deliveries: OrderItemDelivery[] 1:N│
└───────┬─────────────┬───────────────┘
        │ 1:N         │ 1:N
        ▼             ▼
┌────────────────┐  ┌──────────────────────────┐
│ order_item_    │  │ order_item_              │
│ modifiers      │  │ deliveries               │
├────────────────┤  ├──────────────────────────┤
│ PK id          │  │ PK  id          UUID     │
│ FK order_item  │  │ FK  order_item_id UUID   │
│    _id         │  │ FK  stand_id      UUID   │
│ FK modifier_id │  │     status  DeliveryStatus│
│    name        │  │     delivered_at TIMESTAMP│
│    price_adj   │  ├──────────────────────────┤
└────────────────┘  │ UNIQUE(order_item, stand)│
                    │ DeliveryStatus:          │
                    │   PENDING | DELIVERED    │
                    └──────────────────────────┘


═══════════════════════════════════════
           RELACIONES
═══════════════════════════════════════

stand_operators.stand_id  → stands.id         (N:N, CASCADE)
stand_operators.user_id   → users.id          (N:N, CASCADE)
products.stand_id         → stands.id         (N:1, opcional)
product_sizes.product_id  → products.id       (N:1, CASCADE)
product_modifier_groups.product_id → products.id (N:1, CASCADE)
product_modifiers.group_id → product_modifier_groups.id (N:1, CASCADE)
combo_items.combo_id      → combos.id         (N:1)
combo_items.product_id    → products.id       (N:1)
order_items.order_id      → orders.id         (N:1)
order_items.product_id    → products.id       (N:1)
order_items.combo_id      → combos.id         (N:1)
order_items.product_size_id → product_sizes.id (N:1)
order_item_modifiers.order_item_id → order_items.id (N:1, CASCADE)
order_item_modifiers.modifier_id → product_modifiers.id (N:1)
order_item_deliveries.order_item_id → order_items.id (N:1)
order_item_deliveries.stand_id → stands.id    (N:1)
```

## Resumen

| Tabla | Descripcion | Fase |
|-------|-------------|------|
| `users` | Usuarios del sistema (admin, operador, cliente) | 2 |
| `stands` | Puestos de venta/entrega | 5 |
| `stand_operators` | Relacion N:N entre usuarios y stands | 5 |
| `products` | Productos base con precio | 4 |
| `product_sizes` | Variantes de tamano por producto | 4 |
| `product_modifier_groups` | Grupos de personalizacion | 4 |
| `product_modifiers` | Opciones dentro de cada grupo | 4 |
| `combos` | Combos de productos | 6 |
| `combo_items` | Productos dentro de un combo | 6 |
| `orders` | Ordenes con QR y codigo corto | 7 |
| `order_items` | Items de cada orden | 7 |
| `order_item_modifiers` | Modificadores seleccionados por item | 7 |
| `order_item_deliveries` | Registro de entrega por puesto | 7 |

---

## Descripcion detallada de cada entidad

### `users`
Representa a todas las personas que interactuan con el sistema. Tiene 4 roles:
- **ADMIN**: Dueno/gerente del negocio. Control total: precios, eliminacion, gestiona puestos, operadores, combos y todo el sistema.
- **CATALOG_MANAGER**: Gestiona el catalogo de productos (nombre, descripcion, imagen), sizes y modificadores (crear, editar). NO puede cambiar precios ni eliminar productos.
- **STAND_OPERATOR**: Empleado asignado a uno o mas puestos via `stand_operators`. Su funcion es escanear codigos QR y entregar productos.
- **USER**: Cliente que compra productos. Se crea al registrarse o al hacer una compra.

El campo `auth_id` vincula al usuario con Supabase Auth (autenticacion externa). Los passwords los gestiona Supabase, no se almacenan en nuestra DB.

---

### `stands`
Representa los puestos fisicos donde se entregan los productos (ej: "Puesto Principal", "Puesto Esquina Norte"). Cada puesto tiene operadores asignados via la tabla `stand_operators` (relacion N:N).

Cuando un cliente compra un combo con productos de distintos puestos, debe ir a cada puesto a recoger lo que le corresponde. El QR es valido en todos los puestos.

---

### `stand_operators`
Tabla intermedia que implementa la relacion N:N entre usuarios y stands. Permite que:
- Un operador pueda cubrir varios stands (turnos, refuerzos, eventos)
- Un stand pueda tener multiples operadores asignados

---

### `products`
El producto base que se vende (ej: "Cantarito", "Michelada"). Contiene el nombre, descripcion, imagen y un precio base de referencia. Un producto puede tener multiples tamanos y grupos de modificadores para personalizacion.

Si `stand_id` es NULL, el producto es global (disponible en todos los stands). Si tiene un UUID, es exclusivo de ese stand.

---

### `product_sizes`
Variantes de tamano de un producto, cada una con su propio precio. Ejemplo:
- Cantarito Chico -> $80
- Cantarito Mediano -> $100
- Cantarito Grande -> $120

`is_default` indica cual se muestra preseleccionado en la UI. `sort_order` controla el orden de aparicion.

---

### `product_modifier_groups`
Agrupa las opciones de personalizacion de un producto. Funciona como las secciones de personalizacion en apps tipo Rappi/Uber Eats. Ejemplo:
- **"Elige tu salsa"** -> obligatorio, maximo 1 opcion (`min_select=1`, `max_select=1`)
- **"Extras"** -> opcional, maximo 3 opciones (`min_select=0`, `max_select=3`)
- **"Que quieres quitar?"** -> opcional, sin limite

`min_select` determina si el cliente debe elegir algo antes de agregar al carrito.

---

### `product_modifiers`
Las opciones individuales dentro de cada grupo. Ejemplo dentro del grupo "Extras":
- Extra limon -> +$5
- Extra sal -> +$5
- Chamoy -> +$10

`price_adjustment` puede ser positivo (extras), negativo (descuento) o cero (sin costo adicional, ej: "Sin cebolla").

---

### `combos`
Un combo agrupa varios productos a un precio especial fijo. Ejemplo:
- **"Combo Fiesta"** -> $250 (incluye 2 Cantaritos + 1 Michelada)

El precio del combo es independiente de los precios individuales de los productos que lo componen.

---

### `combo_items`
La tabla intermedia que define que productos y en que cantidad forman parte de un combo. Ejemplo para "Combo Fiesta":
- Cantarito x 2
- Michelada x 1

---

### `orders`
Representa una compra realizada por un cliente. Contiene:
- `order_number`: Numero legible (ej: "ORD-00123")
- `qr_code`: UUID unico que se codifica en el codigo QR
- `short_code`: Codigo de 6 caracteres (ej: "ABC123") como respaldo si el QR falla
- `status`: Estado de la orden (PENDING -> PAID -> PARTIAL -> COMPLETED)
- Datos del cliente (nombre, email, telefono) -- no requiere estar registrado

El cliente recibe el QR despues de pagar y lo presenta en cada puesto para recoger sus productos.

---

### `order_items`
Cada linea de la orden. Un item puede ser un producto individual o un combo. Guarda:
- El producto/combo seleccionado
- El tamano elegido (`product_size_id`)
- Cantidad, precio unitario y total calculado

El precio se congela al momento de la compra para que cambios futuros en el catalogo no afecten ordenes existentes.

---

### `order_item_modifiers`
Los modificadores que el cliente eligio para cada item. Ejemplo: si pidio un Cantarito con "Salsa verde" y "Extra chamoy", se guardan 2 registros aqui.

Se guarda el `name` y `price_adjustment` como snapshot (copia) porque el modificador original podria cambiar o eliminarse despues.

---

### `order_item_deliveries`
El registro clave del sistema de entrega por puesto. Cada registro indica si un item especifico fue entregado en un puesto especifico.

- Constraint `UNIQUE(order_item_id, stand_id)` -> impide entregar dos veces el mismo item en el mismo puesto
- `status`: PENDING -> DELIVERED
- `delivered_at`: Timestamp de cuando se escaneo el QR y se entrego

**Flujo de entrega:**
1. Cliente muestra QR en el puesto
2. Operador escanea -> sistema busca la orden
3. Si el item no se ha entregado en ese puesto -> marca DELIVERED
4. Si ya se entrego -> muestra "Ya entregado"
5. El QR sigue valido para los demas puestos
