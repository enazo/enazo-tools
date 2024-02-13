
// const getTagsFromImageBlob = (blob, onOver) => {
//     httpRequest({
//         method: 'POST',
//         url: 'https://192.168.31.2:9900/i2v',
//         responseType: 'json',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         data: {
//             image: blob
//         },
//         onload(res){
//             const data = res.response;
//             onOver(data);
//         },
//         onerror(e){
//             console.log('getTagsFromImageBlob error',e);
//             onOver();
//         }
//     })
// }


const getTagsFromImageBlobXHR = (blob, onOver) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://192.168.31.2:9900/i2v', true);
    xhr.responseType = 'json';
    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        const data = xhr.response;
        if(!data) return onOver();
        onOver(data);
    };
    xhr.onerror = function(e) {
        console.log('getTagsFromImageBlob error',e);
        onOver();
    };


    const formData = new FormData();
    formData.append('image', blob);
    xhr.send(formData);

}

