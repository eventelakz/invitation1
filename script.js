/* =====================================================
   EVENTELA - WEDDING TEMPLATE
   НАСТРОЙКИ САЙТА
===================================================== */

const WEDDING = {

  // Имена
  names: "Ваши имена",

  // Дата свадьбы
  dateText: "17 сентября 2026",

  // Дата и время для countdown
  dateISO: "2026-09-17T18:00:00+05:00",

  // Место
  venue: "Ресторан",

  // Адрес
  address: "Адрес мероприятия",

  // Ссылка на 2GIS
  map: "ССЫЛКА_2GIS",

  // Музыка
  music: "music.mp3",

  // Видео на заставке
  introVideo: "intro.mp4",

  // WhatsApp
  whatsapp: "77000000000",

  // Google Apps Script
  googleScriptUrl: "YOUR_GOOGLE_APPS_SCRIPT_URL"

};


/* =====================================================
   ELEMENTS
===================================================== */

const intro = document.getElementById("intro");
const openButton = document.getElementById("openButton");
const mainContent = document.getElementById("mainContent");

const music = document.getElementById("music");
const musicControl = document.getElementById("musicControl");

const guestForm = document.getElementById("guestForm");
const formSuccess = document.getElementById("formSuccess");


/* =====================================================
   INSERT WEDDING DATA
===================================================== */

document.getElementById("introNames").textContent =
  WEDDING.names;

document.getElementById("heroNames").textContent =
  WEDDING.names;

document.getElementById("heroDate").textContent =
  WEDDING.dateText;

document.getElementById("venue").textContent =
  WEDDING.venue;

document.getElementById("address").textContent =
  WEDDING.address;


/* =====================================================
   MAP
===================================================== */

const mapLink = document.getElementById("mapLink");

mapLink.href = WEDDING.map;


/* =====================================================
   WHATSAPP
===================================================== */

const whatsappLink =
  document.getElementById("whatsappLink");

const whatsappMessage =
  encodeURIComponent(
    "Здравствуйте! Хотела бы узнать подробнее о цифровом приглашении EVENTELA."
  );

whatsappLink.href =
  "https://wa.me/" +
  WEDDING.whatsapp +
  "?text=" +
  whatsappMessage;


/* =====================================================
   OPEN INVITATION
===================================================== */

openButton.addEventListener("click", function() {

  intro.classList.add("hidden");

  mainContent.classList.add("visible");

  musicControl.style.display = "block";

  music.volume = 0.35;

  music.play().catch(function(error) {
    console.log("Music autoplay blocked:", error);
  });

  setTimeout(function() {
    startAutoScroll();
  }, 3000);

});


/* =====================================================
   MUSIC CONTROL
===================================================== */

let musicPlaying = true;

musicControl.addEventListener("click", function() {

  if (musicPlaying) {

    music.pause();

    musicControl.textContent = "♪";

    musicPlaying = false;

  } else {

    music.play();

    musicControl.textContent = "♫";

    musicPlaying = true;

  }

});


/* =====================================================
   COUNTDOWN
===================================================== */

const weddingDate =
  new Date(WEDDING.dateISO).getTime();


function updateCountdown() {

  const now = new Date().getTime();

  const distance = weddingDate - now;


  if (distance <= 0) {

    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";

    return;

  }


  const days =
    Math.floor(distance / (1000 * 60 * 60 * 24));

  const hours =
    Math.floor(
      (distance % (1000 * 60 * 60 * 24))
      / (1000 * 60 * 60)
    );

  const minutes =
    Math.floor(
      (distance % (1000 * 60 * 60))
      / (1000 * 60)
    );

  const seconds =
    Math.floor(
      (distance % (1000 * 60))
      / 1000
    );


  document.getElementById("days").textContent =
    String(days).padStart(2, "0");

  document.getElementById("hours").textContent =
    String(hours).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(minutes).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(seconds).padStart(2, "0");

}


updateCountdown();

setInterval(updateCountdown, 1000);


/* =====================================================
   SCROLL REVEAL
===================================================== */

const revealElements =
  document.querySelectorAll(".reveal");


const revealObserver =
  new IntersectionObserver(

    function(entries) {

      entries.forEach(function(entry) {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

        }

      });

    },

    {
      threshold: 0.15
    }

  );


revealElements.forEach(function(element) {

  revealObserver.observe(element);

});


/* =====================================================
   SLOW AUTO SCROLL
===================================================== */

let autoScroll;
let autoScrolling = false;


function startAutoScroll() {

  if (autoScrolling) return;

  autoScrolling = true;

  autoScroll = setInterval(function() {

    window.scrollBy(0, 1);

  }, 70);

}


function stopAutoScroll() {

  clearInterval(autoScroll);

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


/* =====================================================
   RSVP FORM
===================================================== */

guestForm.addEventListener("submit", async function(event) {

  event.preventDefault();


  const submitButton =
    guestForm.querySelector(".submit-button");

  submitButton.disabled = true;

  submitButton.textContent =
    "Отправляем...";


  const formData =
    new FormData(guestForm);


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
      throw new Error("Request failed");
    }


    guestForm.style.display = "none";

    formSuccess.style.display = "block";


  } catch (error) {

    console.error(error);

    submitButton.disabled = false;

    submitButton.textContent =
      "Попробовать снова";

    alert(
      "Не удалось отправить ответ. Пожалуйста, попробуйте ещё раз."
    );

  }

});
