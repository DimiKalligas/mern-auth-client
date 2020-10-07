import cookie from 'js-cookie'

// set in cookie
export const setCookie = (key, value) => {
    if (window !== 'undefined') {
        cookie.set(key, value, {
            expires: 1 // one day
            , secure: true
        })  // , { SameSite: 'None' }, { secure: true }
    }
}

// remove from cookie when user signs out
export const removeCookie = (key) => {
    if (window !== 'undefined') {
        cookie.remove(key, {
            expires: 1 // one day
        })
    }
}

// get from cookie such as stored token
// will be useful when we need to make request to server with token
export const getCookie = (key) => {
    if (window !== 'undefined') {
        return cookie.get(key)
    }
}


// set in localstorage
export const setLocalStorage = (key, value) => {
    if (window !== undefined) {
        localStorage.setItem(key, JSON.stringify(value)) // in localstorage we only save JSON data
    }
}

// remove from localstorage
export const removeLocalStorage = (key) => {
    if (window !== undefined) {
        localStorage.removeItem(key)
    }
}

// authenticate user by passing data to cookie and localstorage during signin
// this is like middleware
export const authenticate = (response, next) => {
    setCookie('token', response.data.token)
    setLocalStorage('user', response.data.user)
    next() // this callback function will be available in the signin
}

// access user info from localstorage
export const isAuth = () => {
    if (window !== undefined) {
        const cookieChecked = getCookie('token')
        if (cookieChecked) {
            if (localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user')) // we parse it into Javascript object, so it can be used in our application
            } else {
                return false
            }
        }
    }
}

export const signout = next => {
    removeCookie('token')
    removeLocalStorage('user')
    next() // callback used to redirect
}

export const updateUser = (response, next) => {
    console.log('UPDATE USER IN LOCALSTORAGE', response)
    if (typeof window !== 'undefined') {
        let auth = JSON.parse(localStorage.getItem('user'))
        auth = response.data
        localStorage.setItem('user', JSON.stringify(auth))
    }
    next()
}