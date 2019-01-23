
console.log("Push Codelab self", self);

const title = 'Push Codelab';
const options = {
  body: 'Yay it works.',
  icon: 'android-icon-72x72.png',
  badge: 'android-icon-72x72.png'
};
self.registration.showNotification(title, options);
