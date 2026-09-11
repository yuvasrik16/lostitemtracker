const socket = io();

socket.on("connect", function () {
    console.log("Connected to server");

    document.getElementById("lastUpdate").innerText =
        "Connected to Lost Item Tracker";
});

socket.on("item_update", function (data) {

    document.getElementById("itemName").innerText = data.name;
    document.getElementById("address").innerText = data.address;
    document.getElementById("rssi").innerText = "RSSI: " + data.rssi;

    const status = document.getElementById("status");
    const signalBar = document.getElementById("signalBar");

    status.className = "status";

    if (data.rssi === "--") {

        status.innerText = "🔴 OUT OF RANGE";
        status.classList.add("out");
        signalBar.style.width = "0%";

    } else {

        let rssi = Number(data.rssi);

        let percentage = Math.max(
            0,
            Math.min(100, (rssi + 100) * 1.5)
        );

        signalBar.style.width = percentage + "%";

        if (rssi >= -60) {
            status.innerText = "🟢 VERY NEAR";
            status.classList.add("near");

        } else if (rssi >= -75) {
            status.innerText = "🟢 NEAR";
            status.classList.add("near");

        } else if (rssi >= -90) {
            status.innerText = "🟡 FAR";
            status.classList.add("far");

        } else {
            status.innerText = "🔴 VERY FAR";
            status.classList.add("out");
        }
    }

    const now = new Date();

    document.getElementById("lastUpdate").innerText =
        "Last update: " + now.toLocaleTimeString();
});