const getItemQuestions = (itemId) => {
    return fetch(`http://localhost:3333/item/${itemId}/question`, {
        method: 'GET'
    })
    .then((response)=>{
        if(response.status === 200){
            return response.json();
        } else {
            throw 'Questions not available';
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

const askQuestion = (itemId, questionText) => {
    console.log('askQuestion called with:', { itemId, questionText });
    return fetch(`http://localhost:3333/item/${itemId}/question`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('session_token')
        },
        body: JSON.stringify({
            question_text: questionText
        })
    })
    .then((response)=>{
        console.log('askQuestion response status:', response.status);
        if(response.status === 200){
            return { success: true, message: 'Question submitted' };
        } else if(response.status === 401){
            throw 'Not authorized to submit question';
        } else if(response.status === 404){
            throw 'Item not found';
        } else {
            return response.text().then(text => {
                throw `Failed to submit: ${text}`;
            });
        }
    })
    .then((resJson)=>{
        console.log('Question submitted:', resJson);
        return resJson;
    })
    .catch((fetchError)=>{
        console.log("Error:", fetchError);
        return Promise.reject(err);
    })
}

const answerQuestion = (questionId, answerText) => {
    console.log('answerQuestion called with:', { questionId, answerText });
    const token = localStorage.getItem('session_token');
    console.log('Session token for answer:', token);
    
    return fetch(`http://localhost:3333/question/${questionId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('session_token')
        },
        body: JSON.stringify({
            answer_text: answerText
        })
    })
    .then((response)=>{
        console.log('Answer response status:', response.status);
        if(response.status === 200){
            return { success: true };
        } else if(response.status === 401){
            throw 'Not authorized to answer this question';
        } else if(response.status === 404){
            throw 'Question not found';
        } else {
            return response.text().then(text => {
                console.log('Error response text:', text);
                throw `Answer failed: ${text}`;
            });
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

export const questionService = {
    getItemQuestions,
    askQuestion,
    answerQuestion
}