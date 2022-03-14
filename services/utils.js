export function postAnswers(payload={}) {
  
    let apiPayload = {...payload, question: '622eb63ceb95e0faf4f024fd', user: '622eb675eb95e0faf4f024fe'}

    const options = {
        method:'POST',
        mode: 'cors',
        cache: 'no-cache', 
        credentials: 'same-origin', 
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(apiPayload)
      }
    
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}answers`, options).then(res => res.json());
}

export function getAnswers() {
    const options = {
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
          }}
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}users`, options).then(res => res.json());
}