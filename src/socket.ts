import config from "./config"
import * as _ from "lodash"
import taskActions from "./action/task-actions"

let socket = new WebSocket(config.server)

function sendCommand(action, args?) {
    var packet: any = {
        action: action,
        apiKey: config.key
    }
    if (args) packet.args = args
    try {
        socket.send(JSON.stringify(packet));
    } catch (exception) {
        console.log(exception);
    }
}

interface ApiMessage {
    endpoint: string,
    results: any
}

export function connect() {
    try {
        console.log('Socket Status: ' + socket.readyState)

        socket.onopen = function() {
            console.log('Socket Status: ' + socket.readyState + ' (open)')
            //sendCommand("requestprocessinformation")

            setTimeout(
                (() => sendCommand("requestprocessinformation")),
                1000
            )

        }

        socket.onmessage = function(e) {
            if (typeof e.data === "string") {
                //console.log("String get: " + e.data)
                let dataObject = JSON.parse(e.data)
                console.log(dataObject)

                let _dataObject = _(dataObject)
                let message = (dataObject as ApiMessage)
                if ( message.endpoint == "requestProcessInformation" ) {
                    /*
                    if ( _dataObject.any(o => _(o).chain().keys().contains("icon")) ) {
                        console.log("Tasks get")
                        taskActions.updateTasks(dataObject as any as Task[])
                    }
                    */
                    console.log("Tasks get!")
                    taskActions.updateTasks(message.results as TaskInfo[])
                }

            }
            else if (e.data instanceof ArrayBuffer) {
                console.log("ArrayBuffer get (for some reason): " + e.data)
            }
            else if (e.data instanceof Blob) {
                console.log("Blob get (for some reason): " + e.data)
            }
        }

    }
    catch (err) {
        console.log(err)
    }
    finally {

    }

}
