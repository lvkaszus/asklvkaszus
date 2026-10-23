self.addEventListener('push', function (event) {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Notification';

    // The server sends the date in UTC (ISO 8601), so format it in the timezone of this device.
    // Older payloads without these fields fall back to the ready-made body.
    let body = data.body || 'Notification Body';

    if (data.question && data.date) {
        const date = new Date(data.date);

        if (!isNaN(date.getTime())) {
            body = `❓: ${data.question}\n🕒: ${date.toLocaleString()}\n\n🌐️: ${data.ip || '-'}`;
        }
    }

    const options = {
        body: body,
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        self.clients.openWindow('/admin')
    );
});
