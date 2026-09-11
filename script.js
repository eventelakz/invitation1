/* =========================================
   EVENTELA
   WEDDING SETTINGS
========================================= */

const WEDDING = {

  names: "Ваши имена",

  dateText: "17 сентября 2026",

  dateISO: "2026-09-17T18:00:00+05:00",

  venue: "Ресторан",

  address: "Адрес мероприятия",

  map: "ССЫЛКА_2GIS",

  whatsapp: "77475308178",

  googleScriptUrl:
    "YOUR_GOOGLE_APPS_SCRIPT_URL"

};


/* =========================================
   ELEMENTS
========================================= */

const opening =
  document.getElementById("opening");

const envelope =
  document.getElementById("envelope");

const openButton =
  document.getElementById("openButton");

const mainContent =
  document.getElementById("mainContent");

const music =
  document.getElementById("music");

const musicControl =
  document.getElementById("musicControl");

const guestForm =
  document.getElementById("guestForm");

const formSuccess =
  document.getElementById("formSuccess");


/* =========================================
   NAMES
========================================= */

document.querySelectorAll(
  ".opening-names, .hero-video-content h1"
).forEach(function(element) {

  element.textContent =
    WEDDING.names;

});


/* =========================================
   LOCATION
========================================= */

document.getElementById("venue")
  .textContent = WEDDING.venue;

document.getElementById("address")
  .textContent = WEDDING.address;

document.getElementById("mapLink")
  .href = WEDDING.map;


/* =========================================
   WHATSAPP
========================================= */

const whatsappMessage =
  encodeURIComponent(
    "Здравствуйте! Хотела бы узнать подробнее о цифровом приглашении EVENTELA."
  );

document.getElementById("whatsappLink").href =
  "https://wa.me/" +
  WEDDING.whatsapp +
  "?text=" +
  whatsappMessage;


/* =========================================
   OPEN INVITATION
========================================= */

openButton.addEventListener(
  "click",
  function() {

    /* Prevent double click */
    if (opening.classList.contains("opened")) {
      return;
    }

    /* Start envelope animation */
    opening.classList.add("opened");


    /*
      The envelope animation takes about 1.5 seconds.
      We DO NOT show the main website during this time.
    */

    setTimeout(function() {

      /*
        First hide the opening screen.
        The website is still hidden at this moment.
      */

      opening.classList.add("hidden");

    }, 1700);


    /*
      Only after the opening screen has completely
      disappeared do we reveal the website.
    */

    setTimeout(function() {

      mainContent.classList.add("visible");

      musicControl.style.display = "flex";

      music.volume = 0.35;

      music.play().catch(function(error) {

        console.log(
          "Music autoplay blocked:",
          error
        );

      });

    }, 1900);


    /*
      Start automatic scrolling only after
      the invitation has appeared.
    */

    setTimeout(function() {

      startAutoScroll();

    }, 5000);

  }
);


/* =========================================
   MUSIC
========================================= */

let musicPlaying = true;


musicControl.addEventListener(
  "click",
  function() {

    if (musicPlaying) {

      music.pause();

      musicPlaying = false;

      musicControl
        .querySelector(".music-symbol")
        .textContent = "♪";

    } else {

      music.play();

      musicPlaying = true;

      musicControl
        .querySelector(".music-symbol")
        .textContent = "♫";

    }

  }
);


/* =========================================
   COUNTDOWN
========================================= */

const weddingDate =
  new Date(
    WEDDING.dateISO
  ).getTime();


function updateCountdown() {

  const now =
    new Date().getTime();

  const distance =
    weddingDate - now;


  if (distance <= 0) {

    document.getElementById("days")
      .textContent = "00";

    document.getElementById("hours")
      .textContent = "00";

    document.getElementById("minutes")
      .textContent = "00";

    document.getElementById("seconds")
      .textContent = "00";

    return;

  }


  const days =
    Math.floor(
      distance /
      (1000 * 60 * 60 * 24)
    );


  const hours =
    Math.floor(
      (distance %
        (1000 * 60 * 60 * 24)) /
      (1000 * 60 * 60)
    );


  const minutes =
    Math.floor(
      (distance %
        (1000 * 60 * 60)) /
      (1000 * 60)
    );


  const seconds =
    Math.floor(
      (distance %
        (1000 * 60)) /
      1000
    );


  document.getElementById("days")
    .textContent =
    String(days).padStart(2, "0");


  document.getElementById("hours")
    .textContent =
    String(hours).padStart(2, "0");


  document.getElementById("minutes")
    .textContent =
    String(minutes).padStart(2, "0");


  document.getElementById("seconds")
    .textContent =
    String(seconds).padStart(2, "0");

}


updateCountdown();

setInterval(
  updateCountdown,
  1000
);


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements =
  document.querySelectorAll(".reveal");


const revealObserver =
  new IntersectionObserver(

    function(entries) {

      entries.forEach(
        function(entry) {

          if (
            entry.isIntersecting
          ) {

            entry.target
              .classList
              .add("visible");

          }

        }
      );

    },

    {
      threshold: 0.12
    }

  );


revealElements.forEach(
  function(element) {

    revealObserver.observe(element);

  }
);


/* =========================================
   AUTO SCROLL
========================================= */

let autoScroll = null;

let autoScrolling = false;


function startAutoScroll() {

  if (autoScrolling) {
    return;
  }


  autoScrolling = true;


  autoScroll =
    setInterval(
      function() {

        window.scrollBy(
          0,
          1
        );

      },
      70
    );

}


function stopAutoScroll() {

  if (autoScroll) {

    clearInterval(
      autoScroll
    );

  }

  autoScrolling = false;

}


window.addEventListener(
  "touchstart",
  stopAutoScroll,
  { passive: true }
);


window.addEventListener(
  "wheel",
  stopAutoScroll,
  { passive: true }
);


window.addEventListener(
  "mousedown",
  stopAutoScroll
);


/* =========================================
   RSVP
========================================= */

guestForm.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();


    const submitButton =
      guestForm.querySelector(
        ".rsvp-button"
      );


    submitButton.disabled =
      true;


    submitButton.textContent =
      "Отправляем...";


    const formData =
      new FormData(
        guestForm
      );


    try {

      const response =
        await fetch(
          WEDDING.googleScriptUrl,
          {
            method: "POST",
            body: formData
          }
        );


      if (!response.ok) {

        throw new Error(
          "Request failed"
        );

      }


      guestForm.style.display =
        "none";


      formSuccess.style.display =
        "block";


    } catch (error) {

      console.error(error);


      submitButton.disabled =
        false;


      submitButton.textContent =
        "Попробовать снова";


      alert(
        "Не удалось отправить ответ. Пожалуйста, попробуйте ещё раз."
      );

    }

  }
);
