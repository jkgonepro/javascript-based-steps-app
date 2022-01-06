export default {
    items: sessionStorage.getItem('items') && JSON.parse(sessionStorage.getItem('items')).hasOwnProperty('countries')
    ? JSON.parse(sessionStorage.getItem('items')).countries.items
    : []
};
