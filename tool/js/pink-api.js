const pFetch = (method, url, data = null) => {
    let credentials = {
        method: method,
        headers: {
            "Accept": "text/json",
            "Authorization": "PINKYENAZO", //TODO
            "Content-Type": "text/json;charset=UTF-8",
        }
    }

    if (method.toUpperCase() === 'POST') {
        if (data) {
            credentials.body = JSON.stringify(data)
        }
    }
    return fetch(url, credentials).then(res => res.json())
}

const pGet = url => pFetch('GET', url)
const pPost = (url, data) => pFetch('POST', url, data)