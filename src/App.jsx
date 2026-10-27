import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { CATEGORIES, INITIAL_PRODUCTS } from "./data/products";

// --- Íconos Nativos en SVG (Sin dependencias externas que fallen) ---
const Heart = ({ size = 20, className = "", fill = "none" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const Instagram = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const MessageCircle = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </svg>
);

const Star = ({ size = 14, className = "", fill = "none" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const X = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const ChevronDown = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const ChevronUp = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m18 15-6-6-6 6" />
  </svg>
);

const Leaf = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6" />
  </svg>
);

const Phone = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const formatPrice = (price) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
};

const getWhatsAppLink = (productName) => {
  const phone = "573206940028"; // Pon aquí tu número con indicativo
  const text = `Hola Presencia Macramé, me interesa cotizar/comprar: ${productName}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

// --- Componente de Reseñas ---
const ReviewSection = ({ productId, reviews, onAddReview }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;
    onAddReview(productId, { author, rating, text });
    setAuthor("");
    setText("");
  };

  return (
    <div className="mt-4 border-t border-vinotinto-oscuro/20 pt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-sm font-semibold text-vinotinto-oscuro hover:opacity-80 transition"
      >
        <span>Reseñas ({reviews.length})</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3">
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {reviews.length === 0 ? (
              <p className="text-xs text-gray-500 italic">
                Sé el primero en dejar una reseña.
              </p>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="bg-[#F2EDE4] p-2 rounded-lg text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-vinotinto-oscuro">
                      {r.author}
                    </span>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          fill={i < r.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{r.text}</p>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-crema p-3 rounded-lg border border-vinotinto-oscuro/10 space-y-2"
          >
            <input
              type="text"
              placeholder="Tu nombre"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full text-xs p-2 rounded border border-gray-300 focus:outline-none focus:border-vinotinto-oscuro bg-white"
              required
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Calificación:</span>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="text-xs p-1 rounded border border-gray-300 bg-white"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} Estrellas
                  </option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="¿Qué tal tu experiencia?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full text-xs p-2 rounded border border-gray-300 focus:outline-none focus:border-vinotinto-oscuro bg-white resize-none h-14"
              required
            />
            <button
              type="submit"
              className="w-full py-1.5 bg-vinotinto-oscuro text-crema text-xs font-semibold rounded hover:opacity-90 transition"
            >
              Publicar Reseña
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

// --- Componente de Tarjeta de Producto ---
const ProductCard = ({
  product,
  isFavorite,
  onToggleFavorite,
  reviews,
  onAddReview,
  onAddToCart,
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full border border-[#F2EDE4]">
      <div className="relative h-64 overflow-hidden group">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow hover:scale-110 transition"
        >
          <Heart
            size={18}
            className={isFavorite ? "text-vinotinto-oscuro" : "text-gray-400"}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
        <span className="absolute top-3 left-3 bg-crema/90 text-vinotinto-oscuro text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          {product.category}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-vinotinto-oscuro mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-600 line-clamp-2 mb-3 flex-grow">
          {product.description}
        </p>
        <p className="text-xl font-bold text-vinotinto-oscuro mb-4">
          {formatPrice(product.price)}
        </p>

        <button
          onClick={() => onAddToCart(product)}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-vinotinto-oscuro text-crema rounded-xl font-semibold hover:bg-crema hover:text-vinotinto-oscuro transition shadow-sm text-sm"
        >
          <MessageCircle size={18} />
          Añadir al Carrito
        </button>

        <ReviewSection
          productId={product.id}
          reviews={reviews}
          onAddReview={onAddReview}
        />
      </div>
    </div>
  );
};

// --- Componente Principal ---
export default function App() {
  // 1. Memoria del carrito (Inicia vacío)
  const [carrito, setCarrito] = useState([]);
  // Cargar reseñas reales guardadas en Supabase al cargar la página
  useEffect(() => {
    const descargarResenas = async () => {
      const { data, error } = await supabase.from("reviews").select("*");
      if (!error && data) {
        // Mantenemos las iniciales de prueba y le sumamos las reales de Supabase
        const agrupadas = {};

        data.forEach((r) => {
          if (!agrupadas[r.product_id]) {
            agrupadas[r.product_id] = [];
          }
          agrupadas[r.product_id].push({
            id: r.id,
            author: r.author,
            rating: r.rating,
            text: r.text,
          });
        });

        setReviews(agrupadas);
      }
    };

    descargarResenas();
  }, []);

  // 2. Función para añadir un producto al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
    alert("¡Agregado al carrito! 🌿");
  };

  // 3. Función para compilar el mensaje y abrir WhatsApp
  // Función para compilar el mensaje consolidado y abrir WhatsApp
  const enviarPedido = () => {
    if (carrito.length === 0) return alert("Tu carrito está vacío.");

    let mensaje =
      "¡Hola Presencia Macramé! 🌿 Quiero realizar el siguiente pedido:\n\n";
    let total = 0;

    carrito.forEach((item) => {
      // Usamos item.name porque así está definido en tu catálogo
      mensaje += `- 1x ${item.name} (${formatPrice(item.price)})\n`;
      total += item.price;
    });

    mensaje += `\nTotal estimado: ${formatPrice(total)}\nQuedo atenta para acordar el pago y envío.`;

    const numero = "573206940028"; // Tu número real con indicativo
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  const [activeCategory, setActiveCategory] = useState("Todos");
  const [favorites, setFavorites] = useState([]);
  const [isFavOpen, setIsFavOpen] = useState(false);
  const [reviews, setReviews] = useState({});

  const filteredProducts =
    activeCategory === "Todos"
      ? INITIAL_PRODUCTS
      : INITIAL_PRODUCTS.filter((p) => p.category === activeCategory);

  const favoriteProducts = INITIAL_PRODUCTS.filter((p) =>
    favorites.includes(p.id),
  );

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleAddReview = async (productId, newReview) => {
    // Intentamos guardar en Supabase
    const { data, error } = await supabase.from("reviews").insert([
      {
        product_id: productId,
        author: newReview.author,
        rating: newReview.rating,
        text: newReview.text,
      },
    ]);

    // Si Supabase devuelve un error (ej. permisos o tabla inexistente)
    if (error) {
      console.error("Detalle del error:", error);
      alert(`No se pudo guardar la reseña: ${error.message}`);
      return;
    }

    // Si todo sale bien, actualizamos el estado local
    setReviews((prev) => ({
      ...prev,
      [productId]: [...(prev[productId] || []), newReview],
    }));
    alert("¡Reseña guardada con éxito en Supabase!");
  };

  return (
    <div className="min-h-screen textura-macrame text-gray-800 font-sans">
      {/* Navegación */}
      <nav className="sticky top-0 z-40 bg-crema backdrop-blur border-b border-[#F2EDE4] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="text-vinotinto-oscuro" size={26} />
            <span className="text-2xl font-bold text-vinotinto-oscuro tracking-tight">
              Presencia Macramé
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-vinotinto-oscuro hover:opacity-80 transition flex items-center gap-1.5 font-medium text-sm"
            >
              <Instagram size={20} />
              <span className="hidden sm:inline">Instagram</span>
            </a>

            <button
              onClick={() => setIsFavOpen(true)}
              className="relative p-2 text-vinotinto-oscuro hover:bg-[#F2EDE4] rounded-full transition"
            >
              <Heart
                size={22}
                fill={favorites.length > 0 ? "currentColor" : "none"}
              />
              {favorites.length > 0 && (
                <span className="absolute top-0 right-0 bg-vinotinto-oscuro text-crema text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-20 px-4 text-center textura-vinotinto shadow-inner border-b border-vinotinto-oscuro/30">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 drop-shadow-sm text-crema-claro">
          Arte hecho nudo a nudo
        </h1>
        <p className="text-crema/90 max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed font-light">
          Piezas únicas tejidas a mano para darle calidez y estilo bohemio a tus
          rincones favoritos.
        </p>
        <button
          onClick={() =>
            document
              .getElementById("catalogo")
              .scrollIntoView({ behavior: "smooth" })
          }
          className="inline-flex items-center gap-2 bg-crema-claro text-vinotinto-oscuro px-8 py-3 rounded-full font-bold text-sm shadow-lg hover:bg-vinotinto hover:text-crema hover:border-b hover:border-crema hover:scale-105 transition-all duration-300"
        >
          Explorar Catálogo <ChevronDown size={16} />
        </button>
      </header>

      {/* Catálogo */}
      <main id="catalogo" className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                activeCategory === cat
                  ? "bg-vinotinto-oscuro text-crema shadow"
                  : "bg-white text-vinotinto-oscuro border border-vinotinto-oscuro/20 hover:bg-[#F2EDE4]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={favorites.includes(product.id)}
              onToggleFavorite={toggleFavorite}
              reviews={reviews[product.id] || []}
              onAddReview={handleAddReview}
              onAddToCart={agregarAlCarrito}
            />
          ))}
        </div>
        {/* Botón flotante del Carrito */}
        {carrito.length > 0 && (
          <button
            onClick={enviarPedido}
            className="fixed bottom-6 right-6 bg-vinotinto text-crema px-6 py-4 rounded-full font-bold shadow-2xl hover:scale-105 transition-all z-50 flex items-center gap-2 border-2 border-crema"
          >
            🛒 Enviar Pedido ({carrito.length})
          </button>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-vinotinto-oscuro text-crema py-10 mt-16 text-center text-xs space-y-4">
        <div className="flex justify-center items-center gap-2">
          <Leaf size={20} />
          <span className="text-lg font-bold">Presencia Macramé</span>
        </div>
        <p className="text-[#F2EDE4]/80">
          Hecho a mano en Colombia • Envíos a Bogotá y Cali.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <a
            href="https://www.instagram.com/presencia.macrame/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white"
          >
            <Instagram size={20} />
          </a>
          <a
            href={getWhatsAppLink("información")}
            target="_blank"
            rel="noreferrer"
            className="hover:text-white"
          >
            <Phone size={20} />
          </a>
        </div>
      </footer>

      {/* Modal Lateral de Favoritos */}
      {isFavOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-sm bg-crema h-full shadow-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-vinotinto-oscuro/20">
                <h3 className="font-bold text-vinotinto-oscuro text-lg flex items-center gap-2">
                  <Heart size={20} fill="currentColor" /> Favoritos (
                  {favoriteProducts.length})
                </h3>
                <button
                  onClick={() => setIsFavOpen(false)}
                  className="text-gray-500 hover:text-vinotinto-oscuro"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-4 space-y-3 max-h-[65vh] overflow-y-auto pr-1">
                {favoriteProducts.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-10">
                    No tienes productos guardados todavía.
                  </p>
                ) : (
                  favoriteProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="flex gap-3 bg-white p-2.5 rounded-xl border border-gray-100 items-center"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-vinotinto-oscuro line-clamp-1">
                          {prod.name}
                        </h4>
                        <p className="text-xs font-semibold text-gray-700">
                          {formatPrice(prod.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleFavorite(prod.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {favoriteProducts.length > 0 && (
              <a
                href={getWhatsAppLink("la lista de mis favoritos")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-vinotinto-oscuro text-crema text-center text-sm font-bold rounded-xl shadow hover:opacity-90 transition flex justify-center items-center gap-2"
              >
                <MessageCircle size={18} /> Cotizar todo por WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
