const pageRefresher = () => {
  console.log("page-refresher");

  // TODO: Save into local storage the last used URL (only inject at first load).
  // TODO: Show the seconds remaining before the next refresh.

  const form = document.getElementById("page-refresher");
  if (!form) throw new Error("Form not found.");

  const startStop = document.getElementById("start-stop");
  if (!startStop) throw new Error("'Start / Stop' button not found.");

  let targetWindow = null;
  let loop = null;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    startStop.innerText = isWindowOpen(targetWindow) ? "START" : "STOP";

    if (isWindowOpen(targetWindow)) {
      targetWindow?.close();
      return;
    }

    if (!event.target) throw new Error("Event target not found.");
    const [url, interval] = getFormData(event.target);

    if (!url) throw new Error("URL not found.");
    if (!interval) throw new Error("Interval not found.");

    if (!isUrlValid(url)) {
      alert("Invalid URL.");
      return;
    }

    targetWindow = open(url, "refreshingWindow", "popup=no");

    let secondsRemaining = interval;
    loop = setInterval(() => {
      console.log("loop", "secondsRemaining", secondsRemaining);

      if (!isWindowOpen(targetWindow)) {
        console.log("stop");

        startStop.innerText = !isWindowOpen(targetWindow) ? "START" : "STOP";

        if (loop) {
          clearInterval(loop);
          loop = null;
        }
        return;
      }

      if (!secondsRemaining) {
        targetWindow = open(url, "refreshingWindow", "popup=no");
        secondsRemaining = interval;
      }

      secondsRemaining--;
    }, 1000);
  });

  const isWindowOpen = (window) => !!window && !window.closed;

  const getFormData = (target) => {
    const formData = new FormData(target);
    const formProps = Object.fromEntries(formData);
    const { url, interval } = formProps;

    return [String(url), Number(interval)];
  };

  const isUrlValid = (maybeUrl) => {
    try {
      const newUrl = new URL(maybeUrl);
      return newUrl.protocol === "http:" || newUrl.protocol === "https:";
    } catch (error) {
      return false;
    }
  };
};

pageRefresher();
