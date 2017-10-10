
(function(){
    const inputs: NodeListOf<HTMLInputElement> = document.getElementsByTagName('input') as NodeListOf<HTMLInputElement>;
    const message: HTMLTextAreaElement = document.getElementById('message') as HTMLTextAreaElement;
    const submit: HTMLButtonElement = document.getElementById('submit') as HTMLButtonElement;
    const charcount: HTMLSpanElement = document.getElementById('charcount') as HTMLSpanElement;
    const error: HTMLDivElement = document.getElementById('error') as HTMLDivElement;
    const success: HTMLDivElement = document.getElementById('success') as HTMLDivElement;

    function showError(err: any) {
        error.classList.remove('hide');
        const p = document.createTextNode('p');
        p.textContent = err;

        error.appendChild(p);
    }

    function showSuccess(msg: any) {
        success.classList.remove('hide');
        const p = document.createElement('p');
        p.textContent = msg;

        success.appendChild(p);
    }

    function hideStatus() {
        if(!error.classList.contains('hide'))
            error.classList.add('hide');
        error.innerHTML = '';
        if(!success.classList.contains('hide'))
            success.classList.add('hide');
        success.innerHTML = '';
    }

    submit.addEventListener('click', () => {
        hideStatus();

        // send all the requests
        for(const input of inputs as any) {

            if(input.value==='TWITTER' && message.value.length > 132) {
                showError(`[Twitter]: Cannot tweet larger than 140 characters (including the #hackgt)`)
                continue;
            }

            if(input.checked) {
                fetch('/postMessage', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: message.value,
                        type: input.value
                    })
                })
                .then(res=> {
                    if(res.ok) {
                        return res.json()
                    } else
                        throw res
                })
                .then(json=>{
                    console.log(json);
                    let bool = true;
                    for(const message in json.body) {
                        const val = JSON.parse(json.body[message]);
                        if(val.ok === false) {
                            bool = false;
                            showError(`[${input.value}]: ${JSON.stringify(val)}`);
                        }
                    }

                    if(bool) {
                        showSuccess(`[${input.value}]: Success`);
                    }
                })
                .catch(err => err.json().then((json: any)=>{showError(`[${input.value}]: ${JSON.stringify(json)}`)}))
            }
        }
    });

    message.addEventListener('input', () => {
        charcount.textContent = ''+message.value.length;
    });
 }());
