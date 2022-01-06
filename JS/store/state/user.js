export default {
  items: sessionStorage.getItem('items') && JSON.parse(sessionStorage.getItem('items')).hasOwnProperty('user')
  ? JSON.parse(sessionStorage.getItem('items')).user.items
  : []
};
