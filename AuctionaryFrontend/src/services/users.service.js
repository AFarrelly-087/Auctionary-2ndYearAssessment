const createAccount = (firstname,lastname,email,password) => {
    return fetch("http://localhost:3333/users", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'first_name': firstname,
            'last_name': lastname,
            'email': email,
            'password': password

        })
    })
    .then((response)=>{
        if(response.status === 201){
            return response.json();
        } else {
            throw 'Account creation failed';
        }
    })
    .then((resJson)=>{
        return resJson;
    })
    .catch((err)=>{
        console.log("Err",err);
        return Promise.reject(err);
    })
}

const login = (email,password) => {
    return fetch("http://localhost:3333/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            "email": email, 
            "password": password
        })
    })
    .then((response)=>{
        if(response.status === 200){
            return response.json();
        } else if(response.status === 400){
            throw 'Invalid email or password';
        } else {
            throw 'Login failed';
        }
    })
    .then((resJson)=>{        
        localStorage.setItem('user_id', resJson.user_id);
        localStorage.setItem('session_token', resJson.session_token);
        
        return resJson;
    })
    .catch((err)=>{
        console.log("Err",err);
        return Promise.reject(err);
    })
}

const logout = () => {
    return fetch("http://localhost:3333/logout", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('session_token')
        }
    })
    .then((response)=>{
        if(response.status === 200){
            localStorage.removeItem('user_id');
            localStorage.removeItem('session_token');
            return
        } else if(response.status === 401){
            throw 'Session expired'
        }else {
            throw 'Logout failed';
        }
    })
    .catch((err)=>{
        console.log("Err",err);
        return Promise.reject(err);
    })
}

const getUser = (userId) => {
    return fetch(`http://localhost:3333/users/${userId}`, {
        method: 'GET'
    })
    .then((response)=>{
        if(response.status === 200){
            return response.json();
        } else {
            throw 'User not found';
        }
    })
    .then((resJson)=>{
        return resJson;
    })
    .catch((err)=>{
        console.log("Err",err);
        return Promise.reject(err);
    })
}

export const usersService = {
    createAccount,
    login,
    logout,
    getUser
};