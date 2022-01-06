export default {
  saveUserInfo(state, payload) {
    state.items.user.items = payload;
    sessionStorage.setItem('items', JSON.stringify(state.items));

    return state;
  }
};
