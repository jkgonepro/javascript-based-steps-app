export default class DateFiller {
  constructor(store, key) {
    this.store = store;
    this.key = key;
  }

  fill(data) {

    let momentDate = '';
    if(data[this.key] !== null){
      momentDate = moment(data[this.key], 'YYYY-MM-DD').format('DD/MM/YYYY')
    }

    jQuery(`#${this.key}`).val(momentDate);
  }
}
