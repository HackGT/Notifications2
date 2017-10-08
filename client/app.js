(function () {
    var inputs = document.getElementsByTagName('input');
    var message = document.getElementById('message');
    var submit = document.getElementById('submit');
    var charcount = document.getElementById('charcount');
    var error = document.getElementById('error');
    var success = document.getElementById('success');
    function showError(err) {
        error.classList.remove('hide');
        var p = document.createTextNode('p');
        p.textContent = err;
        error.appendChild(p);
    }
    function showSuccess(msg) {
        success.classList.remove('hide');
        var p = document.createElement('p');
        p.textContent = msg;
        success.appendChild(p);
    }
    function hideStatus() {
        if (!error.classList.contains('hide'))
            error.classList.add('hide');
        error.innerHTML = '';
        if (!success.classList.contains('hide'))
            success.classList.add('hide');
        success.innerHTML = '';
    }
    submit.addEventListener('click', function () {
        hideStatus();
        var _loop_1 = function (input) {
            if (input.value === 'TWITTER' && message.value.length > 131) {
                showError("[Twitter]: Cannot tweet larger than 140 characters (including the #hackgt4)");
                return "continue";
            }
            if (input.checked) {
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
                    .then(function (res) {
                    if (res.ok) {
                        showSuccess("[" + input.value + "]: Success");
                        return res.json();
                    }
                    else
                        throw res;
                })
                    .then(function (json) { return console.log(json); })
                    .catch(function (err) { return err.json().then(function (json) { showError("[" + input.value + "]: " + JSON.stringify(json)); }); });
            }
        };
        // send all the requests
        for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
            var input = inputs_1[_i];
            _loop_1(input);
        }
    });
    message.addEventListener('input', function () {
        charcount.textContent = '' + message.value.length;
    });
}());
//# sourceMappingURL=app.js.map