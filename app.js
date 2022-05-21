import * as config from "/config.js";
import * as render from "/markup.js";

class App {
  #map = L.map("map").setView([0, 0], 0);
  #form = document.querySelector(".main-form");
  #parentInfoContainer = document.querySelector(".address-info-container");
  #parentErrorContainer = document.querySelector(".error-message-container");
  #infoContainer = document.querySelector(".info-container");
  #errorMessage = document.querySelector(".error-message");

  constructor() {
    this._load_map(this.#map);
    this._load_location_data();
    this._init_form_handler();
  }

  _load_map(map) {
    L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }).addTo(map);
  }

  _load_location_map(map, { lat, lng } = { lat: 51.5, lng: 10.09 }, routeIP) {
    map.setView([lat, lng], config.MAP_ZOOM);
    L.marker([lat, lng], {
      icon: L.icon({
        iconUrl: `images/icon-location.svg`,
        iconSize: [35, 40],
      }),
    })
      .addTo(map)
      .bindPopup(
        L.popup({
          offset: [0, -15],
          autoClose: false,
          closeOnClick: false,
        })
      )
      .setPopupContent(`route (${routeIP}) located here `)
      .openPopup();
  }

  _display_error_message(message) {
    this.#parentInfoContainer.classList.remove("active");
    this.#parentErrorContainer.classList.add("active");
    this.#errorMessage.textContent = message;
  }

  _clear() {
    this.#infoContainer.innerHTML = "";
  }

  async _get_my_IP() {
    try {
      const response = await fetch(config.GET_IP);

      if (!response.ok)
        throw new Error(`can't get your IP Address (${response.status})`);

      const { ip: IP } = await response.json();
      document.getElementById("address-input").value = IP;
      return IP;
    } catch (error) {
      throw error;
    }
  }

  async _get_res_data(address) {
    try {
      const IP = address ?? (await this._get_my_IP());
      const response = await fetch(config.IP_COUNTRY_CITY(IP));

      if (!response.ok)
        throw new Error(`${response.statusText} (${response.status})`);

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async _get_route_location(address) {
    try {
      const data = await this._get_res_data(address);
      const makeCorrectCase = data.as.route.split(/[./]/);
      const routeIP = makeCorrectCase.slice(0, 4).join(".");
      return routeIP;
    } catch (error) {
      throw error;
    }
  }

  async _load_location_data(address) {
    try {
      const exact_IP = await this._get_route_location(address);
      const data = await this._get_res_data(exact_IP);

      this._load_location_map(
        this.#map,
        {
          lat: data.location.lat,
          lng: data.location.lng,
        },
        exact_IP
      );

      this._clear();
      this.#parentInfoContainer.classList.add("active");
      this.#infoContainer.insertAdjacentHTML(
        "beforeend",
        render.renderInfo(data)
      );
    } catch (error) {
      this._display_error_message(error.message);
    }
  }

  _init_form_handler() {
    this.#form.addEventListener("submit", (e) => {
      e.preventDefault();
      const userInput = document.getElementById("address-input").value;

      // validating if IP address case is really correct
      if (!(userInput.split(".").filter((el) => +el).length === 4)) {
        this._display_error_message(
          "Make sure your input value is an IP Address not domain"
        );
        return;
      }

      // if ever previous error exist
      this.#parentErrorContainer.classList.remove("active");

      this._load_location_data(userInput);
    });
  }
}

const app = new App();
