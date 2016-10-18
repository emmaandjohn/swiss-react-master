export default function loadInfo() {
  return new Promise((resolve) => {
    resolve({
      message: 'Server-Anfrage erfolgreich',
      time: Date.now()
    });
  });
}
