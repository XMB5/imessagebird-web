(function() {
    const WEBSOCKET_CONNECT_MAX_FAILS = 5;

    let ws;
    let wsConnectFailures = 0;

    function displayErrorMessage(e) {
        console.log('display error:', e);
    }

    function handleMessage(messageObj) {

    }

    function connectWs() {
        const proto = location.protocol.replace('http', 'ws');
        const wsUrl = proto + '//' + location.host + '/';
        console.log('websocket connect to %s', wsUrl);
        try {
            ws = new WebSocket(wsUrl);
        } catch (e) {
            console.error(e);
            displayErrorMessage('unable to construct websocket: ' + e.toString());
            return;
        }
        ws.addEventListener('open', evt => {
            console.log('websocket opened');
            wsConnectFailures = 0;
            debugger;
        });
        ws.addEventListener('message', evt => {
            console.log('websocket message %o', evt.data);
            try {
                const messageObj = JSON.parse(evt.data);
                handleMessage(messageObj);
            } catch (e) {
                console.error(e);
                displayErrorMessage('Error parsing incoming message: ' + e.toString());
            }
        });
        ws.addEventListener('error', evt => {
            //no details here
        });
        ws.addEventListener('close', evt => {
            wsConnectFailures++;
            if (wsConnectFailures === WEBSOCKET_CONNECT_MAX_FAILS) {
                displayErrorMessage('WebSocket failed to connect ' + wsConnectFailures + ' times, giving up-L ');
            } else {
                const delayMs = wsConnectFailures * 1000;
                displayErrorMessage('WebSocket failed to connect, will wait ' + delayMs + ' ms and try again');
                setTimeout(connectWs, delayMs);
            }
        });
    }

    connectWs();
})();