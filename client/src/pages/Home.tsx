/*
 * Saffron Counter direction: contemporary Indian editorial café design.
 * This page keeps ordering fast and one-handed: dark cocoa rail, warm ivory canvas,
 * saffron action states, receipt-like cart surfaces, and short active microcopy.
 */
import { Fragment, useMemo, useState } from "react";
import {
  ArrowRight,
  Bike,
  Check,
  ChevronDown,
  Clock3,
  Coffee,
  Filter,
  Flame,
  Heart,
  IceCreamBowl,
  Leaf,
  MapPin,
  Menu as MenuIcon,
  MessageCircle,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  ReceiptText,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Utensils,
  X,
} from "lucide-react";
import { toast } from "sonner";

type MenuItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number | null;
  image: string;
  tag?: string;
  popular?: boolean;
  note?: string;
};

type CartLine = MenuItem & { quantity: number };

type OrderType = "pickup" | "delivery";

const heroImage = "/manus-storage/rv-amul-hero_3120ec68.jpg";
const shakeImage = "/manus-storage/rv-amul-shake_e4c9dfdf.jpg";
const jalebiImage = "/manus-storage/rv-amul-jalebi_66c816e7.jpg";
const bhatureImage = "/manus-storage/rv-amul-bhature_b2a87815.jpg";
const kulchaImage = "/manus-storage/rv-amul-kulcha_dd9115f1.jpg";
const sandwichImage = "/manus-storage/rv-amul-sandwich_e0d2fc48.jpg";
const snacksImage = "/manus-storage/rv-amul-evening-snacks_5a28cbc2.jpg";
const dessertBowlImage = "/manus-storage/rv-amul-dessert-bowl_88c90b47.jpg";
const basicShakesImage = "/manus-storage/rv-amul-basic-shakes_ac9f4e65.jpg";
const premiumShakesImage = "/manus-storage/rv-amul-premium-shakes_b2d5419c.jpg";
const specialShakesImage = "/manus-storage/rv-amul-special-shakes_36649a29.jpg";
const signatureShakesImage = "/manus-storage/rv-amul-signature-shakes_43d4360d.jpg";
const iceCreamImage = "/manus-storage/rv-amul-ice-cream_89cc1dc1.jpg";
const markImage = "/manus-storage/rv-amul-mark_d4ef08ba.png";

const dishImages: Record<string, string> = {
  "regular-bhature": "/manus-storage/menu-regular-bhature-chole_c769b7d6.jpg",
  "ghee-bhature": "/manus-storage/menu-desi-ghee-bhature-chole_52d87044.jpg",
  "amritsari-bhature": "/manus-storage/menu-amritsari-special-bhature_87838f1c.jpg",
  "paneer-bhaatura": "/manus-storage/menu-paneer-bhaatura-chole_13b47199.jpg",
  "extra-bhaatura": "/manus-storage/menu-extra-bhatura_0f073676.jpg",
  "nutri-plate": "/manus-storage/menu-nutri-kulcha-plate_96926a51.jpg",
  "nutri-special": "/manus-storage/menu-nutri-kulcha-special_3755796a.jpg",
  "extra-kulcha": "/manus-storage/menu-extra-kulcha_be3bfe95.jpg",
  "chocolate-shake": "/manus-storage/menu-chocolate-shake_c20842b3.jpg",
  "vanilla-shake": "/manus-storage/menu-vanilla-shake_967ea47d.jpg",
  "strawberry-shake": "/manus-storage/menu-strawberry-shake_be4bd4ca.jpg",
  "mango-shake": "/manus-storage/menu-mango-shake_9cfb1f00.jpg",
  "butterscotch-shake": "/manus-storage/menu-butterscotch-shake_6c952e64.jpg",
  "oreo-shake": "/manus-storage/menu-oreo-shake_7015909d.jpg",
  "kitkat-shake": "/manus-storage/menu-kitkat-shake_141e7919.jpg",
  "cold-coffee-shake": "/manus-storage/menu-cold-coffee-shake_f200616c.jpg",
  "brownie-shake": "/manus-storage/menu-brownie-shake_ee7c89ba.jpg",
  "dry-fruit-shake": "/manus-storage/menu-dry-fruit-shake_0966afd0.jpg",
  "snickers-shake": "/manus-storage/menu-snickers-shake_43eb6ea0.jpg",
  "ferrero-shake": "/manus-storage/menu-ferrero-rocher-shake_9d30cdc6.jpg",
  "biscoff-shake": "/manus-storage/menu-lotus-biscoff-shake_e4a56bfd.jpg",
  "biscoff-brownie-shake": "/manus-storage/menu-biscoff-brownie-shake_2a894514.jpg",
  "veg-sandwich": "/manus-storage/menu-veg-sandwich_e0290c71.jpg",
  "cheese-sandwich": "/manus-storage/menu-cheese-sandwich_88dad73d.jpg",
  "grilled-sandwich": "/manus-storage/menu-grilled-veg-sandwich_996ada42.jpg",
  "paneer-sandwich": "/manus-storage/menu-paneer-sandwich_44e531e5.jpg",
  "corn-cheese-sandwich": "/manus-storage/menu-corn-cheese-sandwich_89ac01f1.jpg",
  "cheese-chilli-toast": "/manus-storage/menu-cheese-chilli-toast_eeae0a22.jpg",
  "chocolate-thick-shake": "/manus-storage/menu-chocolate-thick-shake_0a4b0096.jpg",
  "oreo-thick-shake": "/manus-storage/menu-oreo-thick-shake_5a10042b.jpg",
  "kitkat-thick-shake": "/manus-storage/menu-kitkat-thick-shake_1ae8cad7.jpg",
  "brownie-thick-shake": "/manus-storage/menu-brownie-thick-shake_931dbe17.jpg",
  "dry-fruit-thick-shake": "/manus-storage/menu-dry-fruit-thick-shake_0b0e920f.jpg",
  "biscoff-thick-shake": "/manus-storage/menu-biscoff-thick-shake_58da3292.jpg",
  "samosa": "/manus-storage/menu-samosa_5f4be363.jpg",
  "samosa-chaat": "/manus-storage/menu-samosa-chaat_b3b62635.jpg",
  "paneer-pakoda": "/manus-storage/menu-paneer-pakoda_c02fd249.jpg",
  "spring-roll": "/manus-storage/menu-spring-roll_d8fc55df.jpg",
  "paneer-spring-roll": "/manus-storage/menu-paneer-spring-roll_46cca834.jpg",
  "regular-jalebi": "/manus-storage/menu-regular-jalebi_74ff170a.jpg",
  "kesar-jalebi": "/manus-storage/menu-kesar-jalebi_1cf21acc.jpg",
  "jalebi-rabri": "/manus-storage/menu-jalebi-with-rabri_54485e61.jpg",
  "extra-rabri": "/manus-storage/menu-extra-rabri_09ce9468.jpg",
  "amul-cup": "/manus-storage/menu-amul-cup_6a913f6e.jpg",
  "amul-tub": "/manus-storage/menu-amul-tub_487e8e12.jpg",
  "amul-tricone": "/manus-storage/menu-amul-tricone_c1000aeb.jpg",
  "amul-bricks": "/manus-storage/menu-amul-bricks_1dd21630.jpg",
  "amul-sundae": "/manus-storage/menu-special-sundae_83dd0c63.jpg",
  "ice-cream-scoop": "/manus-storage/menu-ice-cream-scoop_96cf6bd8.jpg",
  "hot-chocolate": "/manus-storage/menu-hot-chocolate_3e63aeef.jpg",
  "chocolate-brownie": "/manus-storage/menu-chocolate-brownie_8e92e4c5.jpg",
  "brownie-ice-cream": "/manus-storage/menu-brownie-with-ice-cream_1381d434.jpg",
  "jalebi-rabri-dessert": "/manus-storage/menu-jalebi-rabri-dessert_413fa914.jpg",
  "amul-taaza": "/manus-storage/menu-amul-taaza-milk_6441da7e.jpg",
  "amul-butter": "/manus-storage/menu-amul-butter_fd84f4df.jpg",
  "amul-cheese": "/manus-storage/menu-amul-cheese_80fc73da.jpg",
  "amul-paneer": "/manus-storage/menu-amul-paneer_1e99e483.jpg",
  "amul-curd": "/manus-storage/menu-amul-curd-dahi_538a6c4d.jpg",
  "other-amul": "/manus-storage/menu-other-amul-products_7acdc132.jpg",
};

const categoryImages: Record<string, string> = {
  "Breakfast Specials": dishImages["regular-bhature"],
  "Nutri Kulcha": dishImages["nutri-plate"],
  Shakes: dishImages["oreo-shake"],
  Sandwiches: dishImages["paneer-sandwich"],
  "Thick Shakes": dishImages["brownie-thick-shake"],
  "Evening Snacks": dishImages.samosa,
  "Jalebi Specials": dishImages["kesar-jalebi"],
  "Amul Ice Creams": dishImages["amul-tricone"],
  "Amul Desserts & Beverages": dishImages["brownie-ice-cream"],
  "Amul Dairy Products": dishImages["amul-taaza"],
};

const categories = [
  { name: "All items", icon: Sparkles, sub: "50+ picks" },
  { name: "Breakfast Specials", icon: Utensils, sub: "7 AM – 4 PM" },
  { name: "Nutri Kulcha", icon: Leaf, sub: "Fresh & filling" },
  { name: "Shakes", icon: Coffee, sub: "All day" },
  { name: "Sandwiches", icon: SandwichIcon, sub: "Grilled fresh" },
  { name: "Thick Shakes", icon: IceCreamBowl, sub: "Extra indulgent" },
  { name: "Evening Snacks", icon: Flame, sub: "4 PM – 10 PM" },
  { name: "Jalebi Specials", icon: Sparkles, sub: "Made fresh" },
  { name: "Amul Ice Creams", icon: IceCreamBowl, sub: "Chilled" },
  { name: "Amul Desserts & Beverages", icon: Coffee, sub: "Sweet finish" },
  { name: "Amul Dairy Products", icon: PackageCheck, sub: "Subject to stock" },
];

function SandwichIcon({ size = 18, strokeWidth = 2, className = "" }: { size?: number; strokeWidth?: number; className?: string }) {
  return <Utensils size={size} strokeWidth={strokeWidth} className={className} />;
}

const menuItems: MenuItem[] = [
  { id: "regular-bhature", name: "Regular Bhaature Chole", category: "Breakfast Specials", description: "2 bhaature with hearty chole", price: 50, image: dishImages["regular-bhature"], popular: true },
  { id: "ghee-bhature", name: "Desi Ghee Bhaature Chole", category: "Breakfast Specials", description: "2 bhaature, chole & pure desi ghee", price: 70, image: dishImages["ghee-bhature"], tag: "Classic" },
  { id: "amritsari-bhature", name: "Amritsari Special Bhaature Chole", category: "Breakfast Specials", description: "2 large bhaature, chole & salad", price: 80, image: dishImages["amritsari-bhature"], tag: "Special", popular: true },
  { id: "paneer-bhaatura", name: "Paneer Bhaatura Chole", category: "Breakfast Specials", description: "Paneer-stuffed bhaatura with chole", price: 90, image: dishImages["paneer-bhaatura"], tag: "Special" },
  { id: "extra-bhaatura", name: "Extra Bhaatura", category: "Breakfast Specials", description: "One fluffy piece, made to order", price: 20, image: dishImages["extra-bhaatura"], note: "Per piece" },
  { id: "nutri-plate", name: "Nutri Kulcha Plate", category: "Nutri Kulcha", description: "Fresh nutri with 2 kulche", price: 50, image: dishImages["nutri-plate"], popular: true },
  { id: "nutri-special", name: "Nutri Kulcha Special", category: "Nutri Kulcha", description: "Extra nutri, butter & salad", price: 70, image: dishImages["nutri-special"], tag: "Special" },
  { id: "extra-kulcha", name: "Extra Kulcha", category: "Nutri Kulcha", description: "Golden, crisp and warm", price: 20, image: dishImages["extra-kulcha"], note: "Per piece" },
  { id: "chocolate-shake", name: "Chocolate Shake", category: "Shakes", description: "Silky chocolate with real milk", price: 90, image: dishImages["chocolate-shake"], tag: "Basic", popular: true },
  { id: "vanilla-shake", name: "Vanilla Shake", category: "Shakes", description: "Creamy vanilla, softly sweet", price: 90, image: dishImages["vanilla-shake"], tag: "Basic" },
  { id: "strawberry-shake", name: "Strawberry Shake", category: "Shakes", description: "Fruity, creamy and refreshing", price: 90, image: dishImages["strawberry-shake"], tag: "Basic" },
  { id: "mango-shake", name: "Mango Shake", category: "Shakes", description: "Mango sunshine in a glass", price: 90, image: dishImages["mango-shake"], tag: "Basic" },
  { id: "butterscotch-shake", name: "Butterscotch Shake", category: "Shakes", description: "Caramel notes with a smooth finish", price: 90, image: dishImages["butterscotch-shake"], tag: "Basic" },
  { id: "oreo-shake", name: "Oreo Shake", category: "Shakes", description: "Cookie crumble, cream & chocolate", price: 139, image: dishImages["oreo-shake"], tag: "Premium", popular: true },
  { id: "kitkat-shake", name: "KitKat Shake", category: "Shakes", description: "Crunchy wafer with chocolate cream", price: 139, image: dishImages["kitkat-shake"], tag: "Premium" },
  { id: "cold-coffee-shake", name: "Cold Coffee Shake", category: "Shakes", description: "Bold cold coffee, silky and chilled", price: 139, image: dishImages["cold-coffee-shake"], tag: "Premium", popular: true },
  { id: "brownie-shake", name: "Brownie Shake", category: "Shakes", description: "Chocolate brownie blended with ice cream", price: 169, image: dishImages["brownie-shake"], tag: "Special" },
  { id: "dry-fruit-shake", name: "Dry Fruit Shake", category: "Shakes", description: "Rich milkshake with crunchy dry fruits", price: 169, image: dishImages["dry-fruit-shake"], tag: "Special" },
  { id: "snickers-shake", name: "Snickers Shake", category: "Shakes", description: "Peanut, caramel and chocolate layers", price: 169, image: dishImages["snickers-shake"], tag: "Special" },
  { id: "ferrero-shake", name: "Ferrero Rocher Shake", category: "Shakes", description: "Hazelnut chocolate, extra indulgent", price: 169, image: dishImages["ferrero-shake"], tag: "Special", popular: true },
  { id: "biscoff-shake", name: "Lotus Biscoff Shake", category: "Shakes", description: "Caramel biscuit cream with a crisp finish", price: 190, image: dishImages["biscoff-shake"], tag: "Signature" },
  { id: "biscoff-brownie-shake", name: "Biscoff Brownie Shake", category: "Shakes", description: "Biscoff, brownie and whipped cream", price: 210, image: dishImages["biscoff-brownie-shake"], tag: "Signature", popular: true },
  { id: "veg-sandwich", name: "Veg Sandwich", category: "Sandwiches", description: "Classic fresh vegetable filling", price: 60, image: dishImages["veg-sandwich"], popular: true },
  { id: "cheese-sandwich", name: "Cheese Sandwich", category: "Sandwiches", description: "Cheesy, creamy and comforting", price: 70, image: dishImages["cheese-sandwich"] },
  { id: "grilled-sandwich", name: "Grilled Veg Sandwich", category: "Sandwiches", description: "Grilled with fresh vegetables", price: 80, image: dishImages["grilled-sandwich"] },
  { id: "paneer-sandwich", name: "Paneer Sandwich", category: "Sandwiches", description: "Spiced paneer filling, toasted warm", price: 90, image: dishImages["paneer-sandwich"], popular: true },
  { id: "corn-cheese-sandwich", name: "Corn Cheese Sandwich", category: "Sandwiches", description: "Sweet corn with melted cheese", price: 90, image: dishImages["corn-cheese-sandwich"] },
  { id: "cheese-chilli-toast", name: "Cheese Chilli Toast", category: "Sandwiches", description: "Melted cheese with a chilli kick", price: 100, image: dishImages["cheese-chilli-toast"], tag: "Popular" },
  { id: "chocolate-thick-shake", name: "Chocolate Thick Shake", category: "Thick Shakes", description: "Dense, cold and deeply chocolatey", price: 139, image: dishImages["chocolate-thick-shake"], tag: "Premium" },
  { id: "oreo-thick-shake", name: "Oreo Thick Shake", category: "Thick Shakes", description: "Extra cookie crumble, extra thick", price: 149, image: dishImages["oreo-thick-shake"], tag: "Premium", popular: true },
  { id: "kitkat-thick-shake", name: "KitKat Thick Shake", category: "Thick Shakes", description: "Thick chocolate shake with wafer crunch", price: 159, image: dishImages["kitkat-thick-shake"], tag: "Special" },
  { id: "brownie-thick-shake", name: "Brownie Thick Shake", category: "Thick Shakes", description: "Brownie pieces in a rich cold shake", price: 169, image: dishImages["brownie-thick-shake"], tag: "Special" },
  { id: "dry-fruit-thick-shake", name: "Dry Fruit Thick Shake", category: "Thick Shakes", description: "Creamy shake with crunchy dry fruits", price: 179, image: dishImages["dry-fruit-thick-shake"], tag: "Special" },
  { id: "biscoff-thick-shake", name: "Biscoff Thick Shake", category: "Thick Shakes", description: "Caramel biscuit cream, thick and chilled", price: 190, image: dishImages["biscoff-thick-shake"], tag: "Signature" },
  { id: "samosa", name: "Samosa", category: "Evening Snacks", description: "Crisp pastry with spiced filling", price: 20, image: dishImages["samosa"], note: "Per piece", popular: true },
  { id: "samosa-chaat", name: "Samosa Chaat", category: "Evening Snacks", description: "2 samosa, chole and chutneys", price: 50, image: dishImages["samosa-chaat"], tag: "Popular" },
  { id: "paneer-pakoda", name: "Paneer Pakoda", category: "Evening Snacks", description: "Crisp paneer fritters, 4 pieces", price: 40, image: dishImages["paneer-pakoda"], note: "4 pieces per plate" },
  { id: "spring-roll", name: "Spring Roll", category: "Evening Snacks", description: "Crisp vegetable spring rolls", price: 50, image: dishImages["spring-roll"], note: "3 pieces per plate" },
  { id: "paneer-spring-roll", name: "Paneer Spring Roll", category: "Evening Snacks", description: "Paneer-filled spring rolls", price: 70, image: dishImages["paneer-spring-roll"], note: "3 pieces per plate" },
  { id: "regular-jalebi", name: "Regular Jalebi", category: "Jalebi Specials", description: "Fresh, crisp and syrupy", price: 40, image: dishImages["regular-jalebi"], note: "100 gm", popular: true },
  { id: "kesar-jalebi", name: "Kesar Jalebi", category: "Jalebi Specials", description: "Saffron-kissed jalebi, made fresh", price: 50, image: dishImages["kesar-jalebi"], note: "100 gm", tag: "Special" },
  { id: "jalebi-rabri", name: "Jalebi with Rabri", category: "Jalebi Specials", description: "100 gm jalebi with creamy rabri", price: 80, image: dishImages["jalebi-rabri"], tag: "Popular" },
  { id: "extra-rabri", name: "Extra Rabri", category: "Jalebi Specials", description: "A small serving of creamy rabri", price: 30, image: dishImages["extra-rabri"], note: "Small serving" },
  { id: "amul-cup", name: "Amul Cup", category: "Amul Ice Creams", description: "Cold, creamy and ready to scoop", price: 30, image: dishImages["amul-cup"], note: "125 ml" },
  { id: "amul-tub", name: "Amul Icecream", category: "Amul Ice Creams", description: "A little more of your favourite", price: null, image: dishImages["amul-tub"], note: "125 ml" },
  { id: "amul-tricone", name: "Amul Tricone", category: "Amul Ice Creams", description: "Cone, chocolate and ice cream", price: 50, image: dishImages["amul-tricone"] },
  { id: "amul-bricks", name: "Amul Bricks", category: "Amul Ice Creams", description: "Take home a creamy classic", price: 120, image: dishImages["amul-bricks"], note: "500 ml" },
  { id: "amul-sundae", name: "Amul Special Sundae", category: "Amul Ice Creams", description: "A layered little celebration", price: 110, image: dishImages["amul-sundae"], tag: "Special", popular: true },
  { id: "ice-cream-scoop", name: "Ice Cream Scoop", category: "Amul Ice Creams", description: "One generous scoop of your choice", price: 70, image: dishImages["ice-cream-scoop"], note: "Per scoop" },
  { id: "hot-chocolate", name: "Hot Chocolate", category: "Amul Desserts & Beverages", description: "Warm cocoa made with real milk", price: 90, image: dishImages["hot-chocolate"], popular: true },
  { id: "chocolate-brownie", name: "Chocolate Brownie", category: "Amul Desserts & Beverages", description: "Soft, fudgy and chocolate-rich", price: 100, image: dishImages["chocolate-brownie"], popular: true },
  { id: "brownie-ice-cream", name: "Brownie with Ice Cream", category: "Amul Desserts & Beverages", description: "Warm brownie with a cold scoop", price: 150, image: dishImages["brownie-ice-cream"], tag: "Popular" },
  { id: "jalebi-rabri-dessert", name: "Jalebi Rabri", category: "Amul Desserts & Beverages", description: "Crisp jalebi with creamy rabri", price: 80, image: dishImages["jalebi-rabri-dessert"] },
  { id: "amul-taaza", name: "Amul Taaza / Milk", category: "Amul Dairy Products", description: "Everyday dairy, subject to availability", price: null, image: dishImages["amul-taaza"], note: "MRP" },
  { id: "amul-butter", name: "Amul Butter", category: "Amul Dairy Products", description: "Subject to availability", price: null, image: dishImages["amul-butter"], note: "MRP" },
  { id: "amul-cheese", name: "Amul Cheese", category: "Amul Dairy Products", description: "Subject to availability", price: null, image: dishImages["amul-cheese"], note: "MRP" },
  { id: "amul-paneer", name: "Amul Paneer", category: "Amul Dairy Products", description: "Subject to availability", price: null, image: dishImages["amul-paneer"], note: "MRP" },
  { id: "amul-curd", name: "Amul Curd / Dahi", category: "Amul Dairy Products", description: "Subject to availability", price: null, image: dishImages["amul-curd"], note: "MRP" },
  { id: "other-amul", name: "Other Amul Products", category: "Amul Dairy Products", description: "Subject to availability", price: null, image: dishImages["other-amul"], note: "MRP" },
];

const quickCategories = ["All items", "Breakfast Specials", "Shakes", "Sandwiches", "Evening Snacks", "Jalebi Specials", "Amul Ice Creams"];

function formatPrice(price: number | null) {
  return price === null ? "MRP" : `₹${price}`;
}

function AppMark({ small = false }: { small?: boolean }) {
  return (
    <div className={`brand-mark ${small ? "brand-mark--small" : ""}`}>
      <img src={markImage} alt="" />
    </div>
  );
}

function ItemCard({ item, quantity, onAdd, onIncrease, onDecrease, onOpen }: { item: MenuItem; quantity: number; onAdd: () => void; onIncrease: () => void; onDecrease: () => void; onOpen: () => void }) {
  return (
    <article className="item-card" onClick={onOpen} tabIndex={0} onKeyDown={(event) => event.key === "Enter" && onOpen()}>
      <div className="item-card__image-wrap">
        <img src={item.image} alt={item.name} className="item-card__image" loading="lazy" />
        <div className="item-card__image-shade" />
        <div className="item-card__badges">
          {item.tag && <span className="item-badge item-badge--dark">{item.tag}</span>}
          <span className="item-badge item-badge--veg"><Leaf size={11} /> VEG</span>
        </div>
        {item.popular && <span className="item-card__popular"><Flame size={12} /> Loved</span>}
      </div>
      <div className="item-card__body">
        <div className="item-card__meta"><span>{item.category}</span>{item.note && <span>{item.note}</span>}</div>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className="item-card__footer">
          <strong>{formatPrice(item.price)}</strong>
          {quantity === 0 ? (
            <button className="add-button" onClick={(event) => { event.stopPropagation(); onAdd(); }} aria-label={`Add ${item.name}`}><Plus size={16} /> Add</button>
          ) : (
            <div className="quantity-control" onClick={(event) => event.stopPropagation()}>
              <button onClick={onDecrease} aria-label={`Remove one ${item.name}`}><Minus size={14} /></button>
              <b>{quantity}</b>
              <button onClick={onIncrease} aria-label={`Add one ${item.name}`}><Plus size={14} /></button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function CartDrawer({ cart, subtotal, cartOpen, setCartOpen, setCart, onCheckout, checkoutOpen, setCheckoutOpen, onOrderComplete }: { cart: CartLine[]; subtotal: number; cartOpen: boolean; setCartOpen: (open: boolean) => void; setCart: React.Dispatch<React.SetStateAction<CartLine[]>>; onCheckout: () => void; checkoutOpen: boolean; setCheckoutOpen: (open: boolean) => void; onOrderComplete: (order: { number: string; type: OrderType; total: number; customer: string }) => void }) {
  const [orderType, setOrderType] = useState<OrderType>("pickup");
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "", landmark: "", instructions: "" });
  const deliveryFee = orderType === "delivery" ? 40 : 0;
  const total = subtotal + deliveryFee;

  function changeQuantity(id: string, delta: number) {
    setCart((current) => current.flatMap((line) => line.id === id ? (line.quantity + delta > 0 ? [{ ...line, quantity: line.quantity + delta }] : []) : [line]));
  }

  function placeOrder() {
    if (!customer.name.trim() || !customer.phone.trim()) {
      toast.error("Add your name and mobile number to continue.");
      return;
    }
    if (orderType === "delivery" && !customer.address.trim()) {
      toast.error("Add a delivery address to continue.");
      return;
    }
    const orderNumber = `RV${Math.floor(1000 + Math.random() * 8999)}`;
    const lines = cart.map((line, index) => `${index + 1}. ${line.name} × ${line.quantity} = ${formatPrice((line.price ?? 0) * line.quantity)}`).join("\n");
    const message = `Hello RV Amul Dessert Cafe 👋\n\nI would like to place an order.\n\n*ORDER DETAILS*\nOrder No: ${orderNumber}\n\n*Customer Details*\nName: ${customer.name}\nMobile: ${customer.phone}\n\n*Order Type*\n${orderType === "delivery" ? "🛵 Delivery" : "🛍 Pickup"}\n\n*Items*\n${lines}\n\nSubtotal: ₹${subtotal}\nDelivery Fee: ₹${deliveryFee}\n*TOTAL: ₹${total}*\n\n${orderType === "delivery" ? `Delivery Address:\n${customer.address}${customer.landmark ? `, ${customer.landmark}` : ""}` : "Pickup from RV Amul Dessert Cafe"}\n\nSpecial Instructions:\n${customer.instructions || "None"}\n\nPlease confirm my order. Thank you!`;
    window.open(`https://wa.me/919878624493?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    onOrderComplete({ number: orderNumber, type: orderType, total, customer: customer.name });
    setCart([]);
    setCheckoutOpen(false);
    setCartOpen(false);
    setCustomer({ name: "", phone: "", address: "", landmark: "", instructions: "" });
    toast.success("Order summary ready — WhatsApp is opening.");
  }

  if (!cartOpen) return null;

  return (
    <div className="drawer-layer" role="presentation">
      <button className="drawer-scrim" onClick={() => setCartOpen(false)} aria-label="Close cart" />
      <aside className="cart-drawer" aria-label="Shopping cart">
        <div className="drawer-head">
          <div><span className="eyebrow">RV / ORDER DESK</span><h2>{checkoutOpen ? "Finish your order" : "Your cart"}</h2></div>
          <button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close"><X size={20} /></button>
        </div>
        {!checkoutOpen ? (
          cart.length === 0 ? (
            <div className="empty-cart"><div className="empty-cart__icon"><ShoppingBag size={30} /></div><h3>Your cart is waiting.</h3><p>Pick a few favourites and they will show up here.</p><button className="button button--dark" onClick={() => setCartOpen(false)}>Browse the menu <ArrowRight size={16} /></button></div>
          ) : (
            <>
              <div className="cart-lines">
                {cart.map((line) => <div className="cart-line" key={line.id}><img src={line.image} alt="" /><div className="cart-line__copy"><strong>{line.name}</strong><span>{formatPrice(line.price)} each</span><div className="cart-line__actions"><button onClick={() => changeQuantity(line.id, -1)} aria-label="Decrease quantity"><Minus size={13} /></button><b>{line.quantity}</b><button onClick={() => changeQuantity(line.id, 1)} aria-label="Increase quantity"><Plus size={13} /></button></div></div><b className="cart-line__price">{formatPrice(line.price === null ? null : line.price * line.quantity)}</b></div>)}
              </div>
              <div className="receipt-block"><div><span>Subtotal</span><b>₹{subtotal}</b></div><div><span>Delivery fee</span><b>{deliveryFee ? `₹${deliveryFee}` : "Free"}</b></div><div className="receipt-total"><span>Total</span><b>₹{total}</b></div></div>
              <div className="drawer-note"><Leaf size={16} /><span>100% pure veg. Prices shown are current menu prices and may change.</span></div>
              <button className="button button--saffron button--wide" onClick={onCheckout}>Proceed to order <ArrowRight size={17} /></button>
              <button className="button button--text button--wide" onClick={() => setCartOpen(false)}>Continue shopping</button>
            </>
          )
        ) : (
          <div className="checkout-form">
            <button className="back-link" onClick={() => setCheckoutOpen(false)}>← Back to cart</button>
            <div className="order-type-grid"><button className={`order-type ${orderType === "pickup" ? "is-active" : ""}`} onClick={() => setOrderType("pickup")}><Store size={20} /><strong>Pickup</strong><span>I'll collect it from the café</span></button><button className={`order-type ${orderType === "delivery" ? "is-active" : ""}`} onClick={() => setOrderType("delivery")}><Bike size={20} /><strong>Delivery</strong><span>Please deliver my order</span></button></div>
            <label>Full name<input value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} placeholder="Your name" /></label>
            <label>Mobile number<input value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} placeholder="10-digit mobile number" inputMode="tel" /></label>
            {orderType === "delivery" ? <><label>Delivery address<textarea value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} placeholder="House / street / area" rows={2} /></label><label>Landmark <span className="muted-label">optional</span><input value={customer.landmark} onChange={(event) => setCustomer({ ...customer, landmark: event.target.value })} placeholder="Near..." /></label></> : <div className="pickup-note"><Store size={17} /><span><b>Pickup from RV Amul Dessert Cafe</b><small>Opp. Trillium Mall, Circular Road, Amritsar</small></span></div>}
            <label>Special instructions <span className="muted-label">optional</span><textarea value={customer.instructions} onChange={(event) => setCustomer({ ...customer, instructions: event.target.value })} placeholder="Less spicy, extra chutney, no onions, etc." rows={2} /></label>
            <div className="checkout-summary"><div><span>{cart.reduce((sum, line) => sum + line.quantity, 0)} items</span><b>₹{subtotal}</b></div><div><span>{orderType === "delivery" ? "Delivery" : "Pickup"}</span><b>{deliveryFee ? "₹40" : "Free"}</b></div><div className="receipt-total"><span>Payable total</span><b>₹{total}</b></div></div>
            <button className="button button--whatsapp button--wide" onClick={placeOrder}><MessageCircle size={18} /> Send order on WhatsApp</button>
            <p className="form-footnote"><ReceiptText size={14} /> A formatted bill will be prepared before WhatsApp opens.</p>
          </div>
        )}
      </aside>
    </div>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All items");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Recommended");
  const [popularOnly, setPopularOnly] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [lastOrder, setLastOrder] = useState<{ number: string; type: OrderType; total: number; customer: string } | null>(null);

  const filteredItems = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const items = menuItems.filter((item) => {
      const matchesCategory = activeCategory === "All items" || item.category === activeCategory;
      const matchesSearch = !normalized || `${item.name} ${item.category} ${item.description}`.toLowerCase().includes(normalized);
      const matchesPopular = !popularOnly || item.popular;
      return matchesCategory && matchesSearch && matchesPopular;
    });
    return [...items].sort((a, b) => sort === "Price Low → High" ? (a.price ?? 9999) - (b.price ?? 9999) : sort === "Price High → Low" ? (b.price ?? 0) - (a.price ?? 0) : Number(Boolean(b.popular)) - Number(Boolean(a.popular)));
  }, [activeCategory, popularOnly, search, sort]);

  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cart.reduce((sum, line) => sum + (line.price ?? 0) * line.quantity, 0);

  function addToCart(item: MenuItem) {
    setCart((current) => current.some((line) => line.id === item.id) ? current.map((line) => line.id === item.id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { ...item, quantity: 1 }]);
    toast.success(`${item.name} added to cart`, { description: "Your order is building nicely." });
  }
  function updateCart(item: MenuItem, delta: number) {
    setCart((current) => current.flatMap((line) => line.id === item.id ? (line.quantity + delta > 0 ? [{ ...line, quantity: line.quantity + delta }] : []) : [line]));
  }
  function jumpToMenu(category = "All items") {
    setActiveCategory(category);
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand-lockup" href="#top"><AppMark small /><span className="brand-wordmark"><b>RV</b><em>AMUL DESSERT CAFE</em></span></a>
        <nav className="topnav" aria-label="Main navigation"><a href="#menu">Menu</a><a href="#why-us">Why us</a><a href="#visit">Visit</a></nav>
        <div className="topbar__actions"><a className="call-link" href="tel:+917888484761"><Phone size={15} /> <span>Call café</span></a><button className="mini-cart" onClick={() => setCartOpen(true)}><ShoppingBag size={17} /><span>Cart</span>{cartCount > 0 && <b>{cartCount}</b>}</button></div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-rail"><div className="hero-rail__top"><AppMark /><span className="rail-word">AMUL<br />DESSERT<br />CAFE</span></div><div className="hero-rail__bottom"><span>100% PURE VEG</span><span>REAL MILK</span><span>REAL ICE CREAM</span></div></div>
          <div className="hero-copy"><div className="eyebrow eyebrow--accent"><span className="eyebrow-dot" /> Opp. Trillium Mall · Amritsar</div><h1>Good food.<br /><i>Sweet</i> finish.</h1><p className="hero-lede">Your neighbourhood stop for pure-veg comfort food, real-milk shakes, and desserts worth a detour.</p><div className="hero-actions"><button className="button button--saffron" onClick={() => jumpToMenu()}><ShoppingBag size={17} /> Order now</button><button className="text-action" onClick={() => jumpToMenu("Shakes")}>Browse the menu <ArrowRight size={16} /></button></div><div className="hero-details"><span><Clock3 size={15} /><b>Open today</b> 7:00 AM – 10:00 PM</span><span><MapPin size={15} /> Circular Road, Amritsar</span></div></div>
          <div className="hero-visual"><img src={heroImage} alt="A spread of shakes, jalebi, bhature and sandwiches" /><div className="hero-visual__wash" /><div className="hero-stamp"><span>MADE<br />FRESH</span><Sparkles size={17} /></div><div className="hero-caption"><span>01 / 03</span><b>From our counter</b></div></div>
        </section>

        <section className="specials-strip"><div className="section-intro"><span className="eyebrow">COUNTER FAVOURITES</span><h2>Start with<br /><i>something good.</i></h2><p>A few easy wins for hungry afternoons and sweet evenings.</p><button className="text-action" onClick={() => jumpToMenu("Shakes")}>See all picks <ArrowRight size={16} /></button></div><div className="feature-card feature-card--dark"><div className="feature-card__image"><img src={dishImages["oreo-shake"]} alt="Oreo shake" /></div><div className="feature-card__copy"><span className="feature-card__tag">MOST ORDERED</span><h3>Oreo Shake</h3><p>Cookie crumble, cream & chocolate.</p><div><b>₹139</b><button className="circle-arrow" onClick={() => addToCart(menuItems.find((item) => item.id === "oreo-shake")!)}><Plus size={18} /></button></div></div></div><div className="feature-card feature-card--saffron"><div className="feature-card__image"><img src={dishImages["jalebi-rabri"]} alt="Jalebi with rabri" /></div><div className="feature-card__copy"><span className="feature-card__tag">FRESH TODAY</span><h3>Jalebi with Rabri</h3><p>Golden spirals, creamy rabri.</p><div><b>₹80</b><button className="circle-arrow circle-arrow--dark" onClick={() => addToCart(menuItems.find((item) => item.id === "jalebi-rabri")!)}><Plus size={18} /></button></div></div></div></section>

        <section className="menu-section" id="menu"><div className="section-heading-row"><div><span className="eyebrow">THE FULL MENU</span><h2>Pick your<br /><i>kind of happy.</i></h2></div><div className="menu-heading-note"><Leaf size={18} /><span>Everything here is<br /><b>100% vegetarian.</b></span></div></div>
          <div className="category-scroller" aria-label="Menu categories">{categories.map(({ name, icon: Icon, sub }) => <button key={name} className={`category-tile ${activeCategory === name ? "is-active" : ""}`} onClick={() => setActiveCategory(name)}><span className="category-tile__icon"><Icon size={18} /></span><span><b>{name}</b><small>{sub}</small></span></button>)}</div>
          <div className="menu-toolbar"><div className="search-box"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search shakes, sandwiches, ice cream..." aria-label="Search menu" />{search && <button onClick={() => setSearch("")} aria-label="Clear search"><X size={16} /></button>}</div><div className="toolbar-actions"><button className={`filter-toggle ${popularOnly ? "is-active" : ""}`} onClick={() => setPopularOnly((value) => !value)}><Flame size={15} /> Popular</button><label className="sort-select"><Filter size={15} /><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort menu"><option>Recommended</option><option>Price Low → High</option><option>Price High → Low</option></select><ChevronDown size={15} /></label></div></div>
          <div className="results-line"><span><b>{filteredItems.length}</b> items {activeCategory !== "All items" && <>in <b>{activeCategory}</b></>}</span>{(search || popularOnly) && <button onClick={() => { setSearch(""); setPopularOnly(false); }}>Clear filters</button>}</div>
          <div className="menu-receipt-note"><div className="menu-receipt-note__label"><ReceiptText size={17} /><span>COUNTER NOTE</span></div><p>Order in a few taps, then let WhatsApp carry the details to our team.</p><span className="menu-receipt-note__order">NEXT ORDER / RV1001</span></div>
          <div className="item-grid">{filteredItems.map((item, index) => { const quantity = cart.find((line) => line.id === item.id)?.quantity ?? 0; return <Fragment key={item.id}>{index === 4 && <div className="editorial-card"><span className="eyebrow">THE SWEET SIDE</span><h3>Leave room<br /><i>for dessert.</i></h3><p>Jalebi, rabri, real-milk shakes and a little extra joy.</p><button onClick={() => { setActiveCategory("Jalebi Specials"); window.setTimeout(() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" }), 0); }}>See sweet picks <ArrowRight size={14} /></button></div>}<ItemCard item={item} quantity={quantity} onAdd={() => addToCart(item)} onIncrease={() => updateCart(item, 1)} onDecrease={() => updateCart(item, -1)} onOpen={() => setSelectedItem(item)} /></Fragment>; })}</div>
          {filteredItems.length === 0 && <div className="no-results"><Search size={26} /><h3>Nothing matched that search.</h3><p>Try a category or a simpler phrase.</p><button className="button button--dark" onClick={() => { setSearch(""); setPopularOnly(false); }}>Show all items</button></div>}
        </section>

        <section className="why-section" id="why-us"><div className="why-intro"><span className="eyebrow eyebrow--light">THE RV PROMISE</span><h2>Simple ingredients.<br /><i>Big comfort.</i></h2><p>We keep the good things obvious: pure veg, real milk, fresh prep, and a counter team that wants your order to land just right.</p></div><div className="promise-grid"><div><Leaf /><strong>100% Pure Veg</strong><span>Made with care for every table.</span></div><div><Coffee /><strong>Real Milk</strong><span>Rich, creamy, never a shortcut.</span></div><div><IceCreamBowl /><strong>Real Ice Cream</strong><span>Cold, smooth and properly indulgent.</span></div><div><Heart /><strong>Freshly Prepared</strong><span>Made when you order, not before.</span></div><div><Clock3 /><strong>Quick Service</strong><span>Good food without the long wait.</span></div><div><MessageCircle /><strong>Easy WhatsApp Ordering</strong><span>One clean handoff from cart to café.</span></div></div></section>

        <section className="order-process"><div className="process-heading"><span className="eyebrow">ORDER, MADE EASY</span><h2>From craving<br /><i>to confirmed.</i></h2></div><div className="process-steps"><div><span>01</span><ShoppingBag /><h3>Pick your favourites</h3><p>Browse the menu, search fast, and add what sounds good.</p></div><div><span>02</span><ReceiptText /><h3>Choose your handoff</h3><p>Pickup from the café or delivery around Circular Road.</p></div><div><span>03</span><MessageCircle /><h3>Send on WhatsApp</h3><p>Review your bill, then send a structured order to our team.</p></div></div></section>

        {lastOrder && <section className="tracking-section" id="track"><div className="tracking-head"><span className="eyebrow">ORDER TRACKER</span><h2>We have your order,<br /><i>{lastOrder.customer}.</i></h2><span className="order-number">Order #{lastOrder.number}</span></div><div className="tracking-card"><div className="tracking-path"><div className="track-step is-done"><span><Check size={15} /></span><b>Order received</b><small>Just now</small></div><div className="track-line is-done" /><div className="track-step is-current"><span><Utensils size={15} /></span><b>Preparing</b><small>Up next at the counter</small></div><div className="track-line" /><div className="track-step"><span><PackageCheck size={15} /></span><b>{lastOrder.type === "pickup" ? "Ready for pickup" : "Out for delivery"}</b><small>We will update you</small></div><div className="track-line" /><div className="track-step"><span><Heart size={15} /></span><b>Completed</b><small>Enjoy every bite</small></div></div><div className="tracking-note"><Sparkles size={17} /><span>Your order summary is ready. The café team will confirm details on WhatsApp.</span></div></div></section>}

        <section className="visit-section" id="visit"><div className="visit-map"><div className="map-grid" /><div className="map-pin"><MapPin size={22} /></div><span className="map-label">RV AMUL DESSERT CAFE</span><span className="map-road map-road--one" /><span className="map-road map-road--two" /></div><div className="visit-copy"><span className="eyebrow">COME BY THE COUNTER</span><h2>Meet us where<br /><i>the good stuff is.</i></h2><p>Opp. Trillium Mall, Circular Road, Amritsar</p><div className="visit-contact"><a href="tel:+919878624493"><Phone size={17} /><span><b>+91 9878624493</b><small>WhatsApp orders</small></span></a><a href="tel:+917888484761"><Phone size={17} /><span><b>+91 7888484761</b><small>Additional contact</small></span></a></div><button className="button button--dark" onClick={() => window.open("https://wa.me/919878624493", "_blank", "noopener,noreferrer")}><MessageCircle size={17} /> Order on WhatsApp</button><p className="visit-footnote">Available for parties, office orders, functions & special arrangements.</p></div></section>
      </main>

      <footer className="footer"><div className="footer-brand"><a className="brand-lockup brand-lockup--footer" href="#top"><AppMark small /><span className="brand-wordmark"><b>RV</b><em>AMUL DESSERT CAFE</em></span></a><p>Real milk. Real ice cream.<br />A sweet stop in Amritsar.</p></div><div className="footer-links"><span className="eyebrow">QUICK LINKS</span><a href="#menu">Menu</a><a href="#why-us">Why us</a><a href="#visit">Visit the café</a></div><div className="footer-links"><span className="eyebrow">ORDER DESK</span><a href="tel:+919878624493">WhatsApp: +91 9878624493</a><a href="tel:+917888484761">Call: +91 7888484761</a><span>7:00 AM – 10:00 PM</span></div><div className="footer-last"><span>© 2026 RV Amul Dessert Cafe</span><span>Prices may change · Availability varies</span></div></footer>

      {cartCount > 0 && <button className="mobile-cart-bar" onClick={() => setCartOpen(true)}><span><ShoppingBag size={17} /> {cartCount} {cartCount === 1 ? "item" : "items"}</span><b>₹{subtotal}</b><span>View cart <ArrowRight size={15} /></span></button>}
      <nav className="mobile-nav" aria-label="Mobile navigation"><a href="#top"><span>⌂</span>Home</a><a href="#menu"><MenuIcon size={18} />Menu</a><button onClick={() => setCartOpen(true)}><ShoppingBag size={18} />Cart{cartCount > 0 && <b>{cartCount}</b>}</button><a href="#track"><PackageCheck size={18} />Orders</a><a href="#visit"><Phone size={18} />Contact</a></nav>

      <CartDrawer cart={cart} subtotal={subtotal} cartOpen={cartOpen} setCartOpen={setCartOpen} setCart={setCart} onCheckout={() => setCheckoutOpen(true)} checkoutOpen={checkoutOpen} setCheckoutOpen={setCheckoutOpen} onOrderComplete={setLastOrder} />
      {selectedItem && <div className="modal-layer"><button className="drawer-scrim" onClick={() => setSelectedItem(null)} aria-label="Close item details" /><div className="item-modal"><button className="icon-button item-modal__close" onClick={() => setSelectedItem(null)} aria-label="Close"><X size={19} /></button><img src={selectedItem.image} alt={selectedItem.name} /><div className="item-modal__copy"><span className="eyebrow">{selectedItem.category}</span><h2>{selectedItem.name}</h2><p>{selectedItem.description}{selectedItem.note ? ` · ${selectedItem.note}` : ""}</p><div className="item-modal__price"><b>{formatPrice(selectedItem.price)}</b><span><Leaf size={13} /> Vegetarian</span></div><button className="button button--saffron button--wide" onClick={() => { addToCart(selectedItem); setSelectedItem(null); }}>Add to cart <Plus size={17} /></button></div></div></div>}
    </div>
  );
}
