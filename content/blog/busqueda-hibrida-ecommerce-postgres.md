---
title: "Búsqueda híbrida con PostgreSQL y pgvector: texto, embeddings y RRF"
description: "Aprendé cómo combinar full-text search y búsqueda semántica en PostgreSQL: embeddings, campos ponderados, recuperación de candidatos y ranking con Reciprocal Rank Fusion."
date: "2026-10-23"
category: "Inteligencia Artificial"
icon: "i-lucide-search"
draft: false
---

La **búsqueda híbrida** combina dos señales: las palabras que aparecen en un documento y la cercanía semántica entre ese documento y una consulta. En PostgreSQL se puede implementar con full-text search, pgvector y un algoritmo de fusión llamado **Reciprocal Rank Fusion (RRF)**.

Este artículo explica cada pieza y cómo conectarlas para buscar productos en un catálogo. Los fragmentos SQL muestran las partes del algoritmo: no son una migración ni un endpoint listos para producción.

Es el mismo enfoque que incorporamos en [ia-search](/ia-search), nuestro producto de búsqueda para e-commerce. Pero la técnica también sirve para documentación, artículos y otras colecciones de texto.

## 1. Entender qué aporta cada tipo de búsqueda

Imaginá dos consultas:

- **“campera térmica”**: contiene palabras que podrían aparecer en el nombre de un producto.
- **“ropa para días fríos”**: expresa una necesidad, pero puede no coincidir literalmente con ese nombre.

La búsqueda por texto es una buena señal para la primera. La búsqueda semántica puede ayudar con la segunda.

### Full-text search: coincidencias entre términos

PostgreSQL no se limita a buscar una subcadena con `LIKE`. Su búsqueda de texto completo transforma el contenido en términos normalizados y permite consultar y ordenar sus coincidencias.

Las piezas principales son:

| Función o tipo         | Responsabilidad                                           |
| ---------------------- | --------------------------------------------------------- |
| `tsvector`             | Representar los términos de un documento.                 |
| `to_tsvector`          | Convertir texto a esa representación.                     |
| `websearch_to_tsquery` | Convertir una consulta de usuario a una consulta textual. |
| `@@`                   | Comprobar si el documento coincide con la consulta.       |
| `ts_rank_cd`           | Puntuar la relevancia textual de las coincidencias.       |

La configuración de idioma importa: define reglas de normalización y palabras que se descartan. No es un sistema de traducción ni garantiza coincidencias entre sinónimos.

### Búsqueda semántica: cercanía entre representaciones

Un modelo de embeddings transforma texto en un vector numérico. La búsqueda semántica compara el vector de la consulta con los vectores almacenados para encontrar contenido cercano.

Esto permite recuperar candidatos que no contienen exactamente las mismas palabras. Sin embargo, **cercanía semántica no significa equivalencia**: dos productos pueden estar relacionados sin resolver la misma necesidad.

Combinar las dos señales permite aprovechar sus fortalezas, pero no garantiza mejores resultados para todas las consultas. Esa mejora hay que medirla.

## 2. Preparar el contenido del catálogo

Para seguir los ejemplos, suponé una tabla `products` con estos campos:

| Campo                        | Uso                                                     |
| ---------------------------- | ------------------------------------------------------- |
| `id`                         | Identificador único, utilizado también para desempatar. |
| `project_id`                 | Catálogo o proyecto al que pertenece el producto.       |
| `name`, `category`, `resume` | Contenido sobre el que se busca.                        |
| `is_active`                  | Indica si puede aparecer en los resultados.             |
| `embedding`                  | Vector del producto, almacenado con pgvector.           |

Antes de buscar, necesitás generar y guardar los embeddings del catálogo. Después, en cada búsqueda, generás el embedding de la consulta.

**Usá el mismo modelo y las mismas dimensiones para ambos.** Vectores de igual tamaño producidos por modelos diferentes no necesariamente comparten un espacio semántico comparable.

También necesitás una política de actualización: si cambia el texto usado para generar el embedding de un producto, su vector puede quedar desactualizado.

## 3. Construir la representación textual

No todos los campos aportan la misma información. Una coincidencia en el nombre puede ser más relevante que una mención incidental en el resumen.

PostgreSQL permite ponderarlos con `setweight`:

```sql
setweight(to_tsvector('spanish', coalesce(p.name, '')), 'A') ||
setweight(to_tsvector('spanish', coalesce(p.category, '')), 'B') ||
setweight(to_tsvector('spanish', coalesce(p.resume, '')), 'C')
```

Este fragmento usa `p` como alias del producto y construye un único `tsvector`:

- **A**: mayor peso para el nombre.
- **B**: peso intermedio para la categoría.
- **C**: menor peso para el resumen.

`coalesce` evita que un campo nulo invalide la concatenación. Los pesos son etiquetas que las funciones de ranking interpretan; no son filtros ni garantías de posición.

La consulta del usuario debe procesarse con la misma configuración textual:

```sql
SELECT websearch_to_tsquery('spanish', 'campera térmica');
```

Para un catálogo multilingüe, elegí la configuración de manera controlada según el idioma. `simple` puede servir cuando no hay una configuración específica adecuada, pero no aplica las mismas reglas lingüísticas que `spanish`.

## 4. Recuperar candidatos semánticos

Con pgvector, el operador `<=>` calcula la distancia coseno. Menor distancia significa mayor cercanía.

Esta consulta ilustra la recuperación semántica con parámetros enlazados por el cliente de PostgreSQL:

```sql
SELECT
  p.id,
  p.embedding <=> $1::vector AS distance
FROM products p
WHERE p.project_id = $2
  AND p.is_active = true
  AND p.embedding IS NOT NULL
ORDER BY distance, p.id
LIMIT $3;
```

Los parámetros son:

- `$1`: embedding de la consulta, con las dimensiones del catálogo.
- `$2`: identificador del proyecto autorizado por el backend.
- `$3`: cantidad máxima de candidatos semánticos.

No interpolés estos valores como texto SQL. Utilizá parámetros del driver o el mecanismo seguro de tu cliente de base de datos.

Si necesitás exponer una similitud, podés calcular:

```text
similarity = 1 - cosine_distance
```

La distancia coseno va de 0 a 2, así que esta similitud va de -1 a 1. No la interpretes como una probabilidad ni como un porcentaje de acierto. También podés aplicar un umbral para descartar candidatos poco cercanos; ese valor debe calibrarse con datos reales.

## 5. Recuperar candidatos textuales

La otra rama busca coincidencias en el documento ponderado y las ordena por relevancia textual:

```sql
SELECT
  p.id,
  ts_rank_cd(document.terms, input.query) AS lexical_score
FROM products p
CROSS JOIN (
  SELECT websearch_to_tsquery('spanish', $1) AS query
) input
CROSS JOIN LATERAL (
  SELECT
    setweight(to_tsvector('spanish', coalesce(p.name, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(p.category, '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce(p.resume, '')), 'C') AS terms
) document
WHERE p.project_id = $2
  AND p.is_active = true
  AND document.terms @@ input.query
ORDER BY lexical_score DESC, p.id
LIMIT $3;
```

En esta consulta, `$1` es el texto de búsqueda, `$2` el proyecto autorizado y `$3` el límite de candidatos textuales. La numeración de parámetros es independiente de la consulta anterior.

La condición `@@` selecciona las coincidencias; `ts_rank_cd` las ordena. El identificador sirve como criterio estable de desempate.

Este ejemplo permite recuperar productos sin embedding por la rama textual. Exigir un vector también en esta rama es una decisión del producto, no una condición necesaria para implementar búsqueda híbrida.

### Aplicar los filtros antes del límite

Ambas ramas deben respetar los mismos límites de acceso y filtros de negocio: proyecto, estado, categorías o cualquier otra restricción relevante.

Aplicarlos después del `LIMIT` puede dejar afuera candidatos válidos y producir menos resultados de los esperados. Además, el identificador del proyecto debe surgir de una autorización real: recibirlo del navegador no demuestra que el usuario tenga acceso. Estos fragmentos no reemplazan la autenticación, los permisos ni las políticas RLS que correspondan.

Un umbral semántico, en cambio, no tiene por qué aplicarse a la rama textual. Una coincidencia por palabras puede ser útil aunque su similitud vectorial sea baja.

## 6. Fusionar las listas con RRF

Ahora hay dos listas ordenadas, pero sus puntuaciones no son directamente comparables. `ts_rank_cd` y la distancia coseno miden cosas diferentes.

**RRF combina posiciones, no puntuaciones originales.** Para cada producto suma una contribución por cada lista en la que aparece:

```text
RRF(producto) = Σ 1 / (k + posición)
```

La posición empieza en 1. Si un producto no aparece en una lista, esa lista aporta cero. La constante `k` suaviza la ventaja de las primeras posiciones.

Con `k = 60`, un producto segundo en la lista textual y quinto en la semántica recibe:

```text
1 / (60 + 2) + 1 / (60 + 5) ≈ 0,03151
```

Otro que aparece primero únicamente en la lista semántica recibe:

```text
1 / (60 + 1) ≈ 0,01639
```

En este caso, el respaldo de ambas señales coloca al primer producto por delante. No significa que siempre sea el resultado correcto: es la regla de combinación elegida.

Si una señal resulta más confiable para tu catálogo, podés multiplicar la contribución de cada lista por un peso. La función de ejemplo de Supabase lo hace con `full_text_weight` y `semantic_weight`.

### Cómo se expresa en SQL

Si las consultas anteriores se integran como CTE llamadas `semantic_pool` y `lexical_pool`, la parte de fusión puede escribirse así:

```sql
votes AS (
  SELECT
    id,
    row_number() OVER (ORDER BY distance, id) AS rank
  FROM semantic_pool

  UNION ALL

  SELECT
    id,
    row_number() OVER (ORDER BY lexical_score DESC, id) AS rank
  FROM lexical_pool
),
fused AS (
  SELECT id, sum(1.0 / (60 + rank)) AS rrf_score
  FROM votes
  GROUP BY id
)
```

Este fragmento es una continuación de un `WITH`, no una consulta autónoma. Cada pool debe contener una sola fila por producto.

`UNION ALL` conserva los votos de ambas ramas. `GROUP BY id` los reúne y evita devolver el producto dos veces. Después se une `fused` con `products`, se ordena por `rrf_score DESC` y un desempate estable, y se aplica el límite final.

No devuelvas el puntaje RRF bajo el nombre `similarity`: **el ranking combinado y la similitud vectorial son señales distintas**.

## 7. Elegir el tamaño de los pools

Para mostrar diez resultados, conviene evaluar más de diez candidatos por rama. Por ejemplo, cincuenta semánticos y cincuenta textuales, fusionados antes de recortar a diez.

Ese margen permite que productos algo más abajo en ambas listas participen del ranking final. El tamaño adecuado depende del catálogo, la relevancia y la latencia aceptable.

Hay una distinción importante: **limitar un pool a cincuenta candidatos no implica que PostgreSQL solo examine cincuenta filas**. La base puede necesitar procesar muchas más para encontrarlos y ordenarlos.

## 8. Preparar la búsqueda para crecer

Calcular el `tsvector` durante cada consulta ayuda a explicar el algoritmo, pero agrega trabajo repetido. Para un catálogo grande, evaluá almacenar esa representación e indexarla con GIN.

La [guía de búsqueda híbrida de Supabase](https://supabase.com/docs/guides/ai/hybrid-search) muestra una columna generada `tsvector`, un índice GIN y un índice vectorial HNSW.

Si usás distancia coseno, el índice vectorial debe ser compatible con ese operador, por ejemplo con la clase `vector_cosine_ops`. No copies un índice configurado para producto interno y supongas que acelerará una consulta con `<=>`.

La forma del `ORDER BY` también importa. pgvector usa el índice cuando la consulta ordena por la distancia y aplica un `LIMIT`; agregar `p.id` como segundo criterio, como en el ejemplo de la sección 4, puede impedir que lo use. Con un índice aproximado, ordená solo por distancia y resolvé el desempate después, al calcular las posiciones.

Los índices aproximados también implican compromisos de recuperación, especialmente al combinarlos con filtros: con HNSW, el filtro se aplica sobre los candidatos que devuelve el índice, por lo que una condición muy selectiva puede dejar menos filas que el `LIMIT`. Desde pgvector 0.8 podés activar los escaneos iterativos (`hnsw.iterative_scan`) para mitigarlo. Medí con un volumen representativo y revisá el plan con `EXPLAIN (ANALYZE, BUFFERS)` en un entorno controlado: `ANALYZE` ejecuta la consulta, no solo describe su plan.

## 9. Validar relevancia, no solo que el SQL funcione

Una consulta que devuelve filas no demuestra que el buscador sea útil. Prepará un conjunto de evaluación que incluya:

- Nombres y términos concretos del catálogo.
- Necesidades expresadas sin usar las palabras de los productos.
- Consultas ambiguas y búsquedas sin resultados relevantes.
- Filtros que deban excluir productos aunque sean semánticamente cercanos.

Compará búsqueda textual, semántica e híbrida sobre las mismas consultas. Revisá la relevancia de los primeros resultados, los falsos positivos y la latencia, incluyendo el costo de generar el embedding.

Parámetros como el tamaño de los pools, el umbral semántico y la constante de RRF son puntos de ajuste, no recetas universales.

## Del algoritmo al producto

La arquitectura queda resumida así:

```text
Consulta → embedding + consulta textual
         → candidatos semánticos y textuales
         → posiciones en cada lista
         → fusión RRF
         → productos ordenados
```

Un modelo generativo puede presentar esos resultados en una conversación, pero no hace falta para fusionarlos: PostgreSQL resuelve la recuperación y el ranking, y el catálogo sigue siendo la fuente de verdad.

En [ia-search](/ia-search) incorporamos este enfoque como un motor seleccionable por proyecto, con campos ponderados y filtros de catálogo. Es una aplicación concreta de la técnica; sus parámetros deben adaptarse y evaluarse para cada caso.

### Referencia

- [Hybrid search — documentación de Supabase](https://supabase.com/docs/guides/ai/hybrid-search).
