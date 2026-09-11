from flask import Flask, render_template
from flask_socketio import SocketIO
import time
import threading

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

TARGET_NAME = "My Keys"

# Demo RSSI values
demo_values = [-55, -68, -82, -95, -72, -60]


@app.route("/")
def home():
    return render_template("index.html")


def demo_tracker():

    index = 0

    while True:

        rssi = demo_values[index]

        if rssi >= -60:
            status = "VERY NEAR"
        elif rssi >= -75:
            status = "NEAR"
        elif rssi >= -90:
            status = "FAR"
        else:
            status = "VERY FAR"

        print("Demo RSSI:", rssi, "| Status:", status)

        socketio.emit(
            "item_update",
            {
                "name": TARGET_NAME,
                "address": "DEMO-BLUETOOTH",
                "rssi": rssi,
                "status": status
            }
        )

        index = (index + 1) % len(demo_values)

        time.sleep(3)


if __name__ == "__main__":

    thread = threading.Thread(
        target=demo_tracker,
        daemon=True
    )

    thread.start()

    print("================================")
    print("   LOST ITEM TRACKER - DEMO")
    print("================================")
    print("Open: http://127.0.0.1:5000")

    socketio.run(
        app,
        host="0.0.0.0",
        port=5000,
        debug=False
    )