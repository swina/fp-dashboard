const getters = {
  logged: state => state.user.logged,
  user: state => state.user,
  notify: state => state.navigation.notify,
  languages: state => state.shop.shop.languages,
  settings: state => state.shop.settings,
  currentDate: state => state.reservations.currentDate,
  currentTime: state => state.reservations.currentTime,
  period: state => state.reservations.period,
  currentName: state => state.reservations.currentName,
  currentSlice: state => state.reservations.currentSlice,
  reservations: state => state.reservations.reservations,
  orders: state => state.reservations.orders ,
  slices: state=> state.reservations.slices,
  months: state => state.reservations.months,
  shop: state => state.shop.shop,
  closes: state => state.shop.shop.closed,
  categories: state => state.shop.categories,
  category: state => state.shop.category,
  sales: state => state.shop.sales, 
  tags: state => state.shop.tags,
  products: state => state.shop.products,
  product: state => state.shop.product,
  variations: state => state.shop.variations,
  qty: state => state.shop.qty,
  cart: state => state.cart
}

export default getters
