# ERD - Cantaritos El Güero

## Diagrama Entidad-Relación

```
┌─────────────────────────────────────┐
│              users                  │
├─────────────────────────────────────┤
│ PK  id          UUID               │
│     auth_id     UUID?       UNIQUE  │
│     email       VARCHAR     UNIQUE  │
│     password    VARCHAR             │
│     name        VARCHAR             │
│     phone       VARCHAR?            │
│     role        Role        USER    │
│ FK  stand_id    UUID?               │
│     is_active   BOOLEAN     true    │
│     created_at  TIMESTAMP           │
│     updated_at  TIMESTAMP           │
├─────────────────────────────────────┤
│ Role: USER | ADMIN | STAND_OPERATOR │
└──────────────┬──────────────────────┘
               │ N:1
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
│ operators: User[] (1:N)             │
│ products:  Product[] (1:N) [futuro] │
└─────────────────────────────────────┘


═══════════════════════════════════════
         FUTURO (Fase 3+)
═══════════════════════════════════════


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
└──────────────┘  │     is_required BOOLEAN   │
                  ├───────────────────────────┤
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
                  │     price_adj  DEC(10,2) │
                  │     is_default   BOOLEAN │
                  │     is_active    BOOLEAN │
                  │     sort_order       INT │
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

users.stand_id          → stands.id          (N:1)
products.stand_id       → stands.id          (N:1)
product_sizes.product_id → products.id       (N:1, CASCADE)
product_modifier_groups.product_id → products.id (N:1, CASCADE)
product_modifiers.group_id → product_modifier_groups.id (N:1, CASCADE)
combo_items.combo_id    → combos.id          (N:1)
combo_items.product_id  → products.id        (N:1)
order_items.order_id    → orders.id          (N:1)
order_items.product_id  → products.id        (N:1)
order_items.combo_id    → combos.id          (N:1)
order_items.product_size_id → product_sizes.id (N:1)
order_item_modifiers.order_item_id → order_items.id (N:1, CASCADE)
order_item_modifiers.modifier_id → product_modifiers.id (N:1)
order_item_deliveries.order_item_id → order_items.id (N:1)
order_item_deliveries.stand_id → stands.id   (N:1)
```

## Resumen

| Tabla | Descripción | Fase |
|-------|-------------|------|
| `users` | Usuarios del sistema (admin, operador, cliente) | 2 ✅ |
| `stands` | Puestos de venta/entrega | 1 (schema) |
| `products` | Productos base con precio | 3 |
| `product_sizes` | Variantes de tamaño por producto | 3 |
| `product_modifier_groups` | Grupos de personalización | 3 |
| `product_modifiers` | Opciones dentro de cada grupo | 3 |
| `combos` | Combos de productos | 6 |
| `combo_items` | Productos dentro de un combo | 6 |
| `orders` | Órdenes con QR y código corto | 7 |
| `order_items` | Items de cada orden | 7 |
| `order_item_modifiers` | Modificadores seleccionados por item | 7 |
| `order_item_deliveries` | Registro de entrega por puesto | 7 |

---

## Descripción detallada de cada entidad

### `users`
Representa a todas las personas que interactúan con el sistema. Tiene 3 roles:
- **USER**: Cliente que compra productos. Se crea al registrarse o al hacer una compra.
- **ADMIN**: Dueño/gerente del negocio. Tiene control total: crea productos, combos, gestiona puestos y operadores.
- **STAND_OPERATOR**: Empleado asignado a un puesto específico (`stand_id`). Su única función es escanear códigos QR y entregar productos en su puesto.

El campo `auth_id` vincula al usuario con Supabase Auth (autenticación externa). El `password` se almacena hasheado con bcrypt.

---

### `stands`
Representa los puestos físicos donde se entregan los productos (ej: "Puesto Principal", "Puesto Esquina Norte"). Cada puesto tiene operadores asignados (`users` con rol `STAND_OPERATOR`) y en el futuro tendrá productos asignados.

Cuando un cliente compra un combo con productos de distintos puestos, debe ir a cada puesto a recoger lo que le corresponde. El QR es válido en todos los puestos.

---

### `products`
El producto base que se vende (ej: "Cantarito", "Michelada"). Contiene el nombre, descripción, imagen y un precio base de referencia. Un producto puede tener múltiples tamaños y grupos de modificadores para personalización.

---

### `product_sizes`
Variantes de tamaño de un producto, cada una con su propio precio. Ejemplo:
- Cantarito Chico → $80
- Cantarito Mediano → $100
- Cantarito Grande → $120

`is_default` indica cuál se muestra preseleccionado en la UI. `sort_order` controla el orden de aparición.

---

### `product_modifier_groups`
Agrupa las opciones de personalización de un producto. Funciona como las secciones de personalización en apps tipo Rappi/Uber Eats. Ejemplo:
- **"Elige tu salsa"** → obligatorio, máximo 1 opción (`min_select=1`, `max_select=1`)
- **"Extras"** → opcional, máximo 3 opciones (`min_select=0`, `max_select=3`)
- **"¿Qué quieres quitar?"** → opcional, sin límite

`is_required` + `min_select` determinan si el cliente debe elegir algo antes de agregar al carrito.

---

### `product_modifiers`
Las opciones individuales dentro de cada grupo. Ejemplo dentro del grupo "Extras":
- Extra limón → +$5
- Extra sal → +$5
- Chamoy → +$10

`price_adjustment` puede ser positivo (extras), negativo (descuento) o cero (sin costo adicional, ej: "Sin cebolla").

---

### `combos`
Un combo agrupa varios productos a un precio especial fijo. Ejemplo:
- **"Combo Fiesta"** → $250 (incluye 2 Cantaritos + 1 Michelada)

El precio del combo es independiente de los precios individuales de los productos que lo componen.

---

### `combo_items`
La tabla intermedia que define qué productos y en qué cantidad forman parte de un combo. Ejemplo para "Combo Fiesta":
- Cantarito × 2
- Michelada × 1

---

### `orders`
Representa una compra realizada por un cliente. Contiene:
- `order_number`: Número legible (ej: "ORD-00123")
- `qr_code`: UUID único que se codifica en el código QR
- `short_code`: Código de 6 caracteres (ej: "ABC123") como respaldo si el QR falla
- `status`: Estado de la orden (PENDING → PAID → PARTIAL → COMPLETED)
- Datos del cliente (nombre, email, teléfono) — no requiere estar registrado

El cliente recibe el QR después de pagar y lo presenta en cada puesto para recoger sus productos.

---

### `order_items`
Cada línea de la orden. Un item puede ser un producto individual o un combo. Guarda:
- El producto/combo seleccionado
- El tamaño elegido (`product_size_id`)
- Cantidad, precio unitario y total calculado

El precio se congela al momento de la compra para que cambios futuros en el catálogo no afecten órdenes existentes.

---

### `order_item_modifiers`
Los modificadores que el cliente eligió para cada item. Ejemplo: si pidió un Cantarito con "Salsa verde" y "Extra chamoy", se guardan 2 registros aquí.

Se guarda el `name` y `price_adjustment` como snapshot (copia) porque el modificador original podría cambiar o eliminarse después.

---

### `order_item_deliveries`
El registro clave del sistema de entrega por puesto. Cada registro indica si un item específico fue entregado en un puesto específico.

- Constraint `UNIQUE(order_item_id, stand_id)` → impide entregar dos veces el mismo item en el mismo puesto
- `status`: PENDING → DELIVERED
- `delivered_at`: Timestamp de cuándo se escaneó el QR y se entregó

**Flujo de entrega:**
1. Cliente muestra QR en el puesto
2. Operador escanea → sistema busca la orden
3. Si el item no se ha entregado en ese puesto → marca DELIVERED
4. Si ya se entregó → muestra "Ya entregado"
5. El QR sigue válido para los demás puestos
