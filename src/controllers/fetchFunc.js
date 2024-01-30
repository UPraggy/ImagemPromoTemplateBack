
function fetchGet (url){
    return new Promise((resolve, reject)=>{
        resolve(fetch(`${url}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*"
            }})
            .then(resp =>  resp.json())
            .catch(resp => {return {"ERROR SERVER": resp}})
            )
    })
}

function fetchPost (url, body){
    return new Promise((resolve, reject)=>{
        resolve(fetch(`${url}`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(body)
            })
            .then(resp => resp.json())
            .catch(resp => {return {"ERROR SERVER": resp}})
            )
    })
}

exports.fetchFunc = {
    fetchPost,
    fetchGet
};