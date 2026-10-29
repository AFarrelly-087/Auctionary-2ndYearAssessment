const getSearchItems = (searchQuery = '', itemStatus = '', limit = 50, offset = 0) => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (itemStatus) params.append('status', itemStatus);
    params.append('limit', limit);
    params.append('offset', offset);
    
    const url = `http://localhost:3333/search${params.toString() ? '?' + params.toString() : ''}`;
    
    const headers = {
        'Content-Type': 'application/json'
    };

    const sessionToken = localStorage.getItem('session_token');
    if (itemStatus && sessionToken) {
        headers['X-Authorization'] = sessionToken;
    }
    
    return fetch(url, {
        method: 'GET',
        headers: headers
    })
    .then((response)=>{
        console.log('Response status:', response.status);
        if(response.status === 200){
            return response.json()
        } else if(response.status === 401) {
            throw 'Authentication required for status filter';
        } else {
            throw 'Search failed';
        }
    })
    .then((resJson)=>{
        return resJson;
    })
    .catch((err)=>{
        console.log("Search error:",err);
        return Promise.reject(err);
    })
}

const getOneItem = (itemId) => {
    return fetch(`http://localhost:3333/item/${itemId}`, {
        method: 'GET'
    })
    .then((response)=>{
        if(response.status === 200){
            return response.json()
        } else {
            throw 'Item not found';
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

const getBidHistory = (itemId) => {
    return fetch(`http://localhost:3333/item/${itemId}/bid`, {
        method: 'GET'
    })
    .then((response)=>{
        if(response.status === 200){
            return response.json()
        } else {
            throw 'Bid history not available';
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

const createItem = (name, description, starting_bid, end_date) => {
    return fetch("http://localhost:3333/item", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('session_token')
        },
        body: JSON.stringify({
            name: name,
            description: description,
            starting_bid: starting_bid,
            end_date: end_date
        })
    })
    .then((response)=>{
        if(response.status === 201){
            return response.json();
        } else {
            throw 'Failed to create item';
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

const makeBid = (itemId, amount) => {
    return fetch(`http://localhost:3333/item/${itemId}/bid`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('session_token')
        },
        body: JSON.stringify({
            amount: amount
        })
    })
    .then((response)=>{
        if(response.status === 201){
            return response.json();
        } else {
            throw 'Failed to place bid';
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

export const coreService = {
    getSearchItems,
    getOneItem,
    getBidHistory,
    createItem,
    makeBid
}