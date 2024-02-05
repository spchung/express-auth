function parseCookie(rawCookie) {
    const parsedCookie = {};
    if (rawCookie){
        rawCookie.split(';').forEach((cookie) => {
            const parts = cookie.split('=');
            parsedCookie[parts[0].trim()] = parts[1].trim();
        });
        return parsedCookie;
    }
    return {};
}

module.exports = {
    parseCookie,
}