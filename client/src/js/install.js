const butInstall = document.getElementById("buttonInstall");
//So, apparently, all of these methods are important to making the insall process work.

// Logic for installing the PWA
// DONE?: Add an event handler to the `beforeinstallprompt` event
window.addEventListener("beforeinstallprompt", (event) => {
  // Store the triggered events
  window.deferredPrompt = event;

  // Remove the hidden class from the button.
  butInstall.classList.toggle("hidden", false);
});

// DONE?: Implement a click event handler on the `butInstall` element
butInstall.addEventListener("click", async () => {
  console.log("install button clicked");
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) {
    return;
  }
  // Show the install prompt.
  promptEvent.prompt();
  // Log the result
  const result = await promptEvent.userChoice;
  console.log(`User response to the install prompt: ${result.outcome}`);
  // Reset the deferred prompt variable, since
  // prompt() can only be called once.
  window.deferredPrompt = null;
});

// DONE?: Add an handler for the `appinstalled` event
window.addEventListener("appinstalled", (event) => {
  // Clear prompt
  window.deferredPrompt = null;
});
