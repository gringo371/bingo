class CookieManager {

    Create(cookieName, cookieValue, days = 1460) {
        let newDate = new Date();
        newDate.setTime(newDate.getTime() + (days * 86400000));
        document.cookie = `${cookieName}=${cookieValue};expires=${newDate.toGMTString()};path=/`;
    }

    Get(cookieName) {
        let cookieValue = null;
        let decodedCookie = decodeURIComponent(document.cookie);

        let regex = new RegExp(`.*${cookieName}=([^;]*)(; |$)`);
        let match = regex.exec(decodedCookie);

        if (match) {
            cookieValue = match[1];
        }
        return cookieValue;
    }

    Destroy(cookieName) {
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
    }
}