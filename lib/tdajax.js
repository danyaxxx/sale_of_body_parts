class TDAjax {
    constructor(option = {}) {
        const {
            url = location.href,
            method = 'GET',
            async = true,
            contentType = 'application/x-www-form-urlencoded; charset=UTF-8',
            data = '',
            success = false,
            error = false,
        } = option;

        this.settings = {
            url: url,
            method: method,
            async: true,
            contentType: contentType,
            data: data,
            success: success,
            error: error,
        };
        this.send(this.settings.success, this.settings.error);
    }

    send(success, error) {
        this.xhr = new XMLHttpRequest();
        this.xhr.open(this.settings.method, this.settings.url, this.settings.async);
        this.xhr.setRequestHeader('Content-type', this.settings.contentType);

        this.xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    if (success) {
                        success(this.responseText);
                    }
                } else {
                    if (error) {
                        error(this.statusText);
                    } else {
                        console.warn('Error: ' + this.status + ' ' + this.statusText);
                    }
                }
            }
        };
        this.xhr.send(this.settings.data);
    }
}
