export default {
  saveUserInfo(context, payload) {
    context.commit('user/saveUserInfo', payload);
  }
};
