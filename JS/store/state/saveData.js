export default {
    firsts_step        : sessionStorage.getItem('items') && JSON.parse(sessionStorage.getItem('items')).hasOwnProperty('saveData') ? JSON.parse(sessionStorage.getItem('items')).saveData.firsts_step : {},
    firsts_step_errors : sessionStorage.getItem('items') && JSON.parse(sessionStorage.getItem('items')).hasOwnProperty('saveData') ? JSON.parse(sessionStorage.getItem('items')).saveData.firsts_step_errors : {},
    second_step_step   : sessionStorage.getItem('items') && JSON.parse(sessionStorage.getItem('items')).hasOwnProperty('saveData') ? JSON.parse(sessionStorage.getItem('items')).saveData.second_step : {},
    second_step_errors : sessionStorage.getItem('items') && JSON.parse(sessionStorage.getItem('items')).hasOwnProperty('saveData') ? JSON.parse(sessionStorage.getItem('items')).saveData.second_step_errors : {},
};
