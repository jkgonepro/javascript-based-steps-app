import { hideLoader } from "../main.js";

const csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

export default {
    get(url) {
        return new Promise(((resolve, reject) => {
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': csrf_token
                },
                url: window.location.origin + url,
                dataType: 'json',
                contentType: 'application/json',
                type: 'GET',
                success: function (result){
                    resolve(result);
                },
                error: function (error) {
                    reject(error);
                },
                complete: function () {
                    hideLoader();
                }
            });
        }));
    },
    post(url, data) {
        return new Promise(((resolve, reject) => {
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': csrf_token
                },
                url: window.location.origin + url,
                dataType: 'json',
                data: JSON.stringify(data),
                contentType: 'application/json',
                type: 'POST',
                success: function (result){
                    resolve(result);
                },
                error: function (error) {
                    reject(error);
                },
                complete: function () {
                    hideLoader();
                }
            });
        }));
    },
    patch(url, data) {
        return new Promise(((resolve, reject) => {
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': csrf_token
                },
                url: window.location.origin + url,
                dataType: 'json',
                data: JSON.stringify(data),
                contentType: 'application/json',
                type: 'PATCH',
                success: function (result){
                    resolve(result);
                },
                error: function (error) {
                    reject(error);
                },
                complete: function () {
                    hideLoader();
                }
            });
        }));
    },
    put() {

    },
    delete() {

    }
}
