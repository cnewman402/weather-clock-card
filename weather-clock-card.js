// weather-clock-card.js

import { LitElement, html, css } from 'https://unpkg.com/lit-element@2.4.0/lit-element.js?module';

class WeatherClockCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
      _time: {},
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        --card-background-color: var(--ha-card-background, var(--card-background-color, white));
      }
      ha-card {
        position: relative;
        overflow: hidden;
        border-radius: var(--ha-card-border-radius, 12px);
        background: var(--card-background-color);
        /* Ensure animations stay within the card's rounded corners */
        box-shadow: var(--ha-card-box-shadow, 0px 2px 4px 0px rgba(0,0,0,0.16));
      }
      .animated-bg-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1; /* Behind the content */
      }
      .card-content {
        position: relative;
        z-index: 2; /* On top of the background */
        padding: 16px;
        text-align: center;
        color: var(--primary-text-color);
        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
      }
      .time {
        font-size: 3em;
        font-weight: bold;
      }
      .date {
        font-size: 1.2em;
        margin-top: 8px;
      }
      .weather-info {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
      }
      .weather-icon {
        width: 50px;
        height: 50px;
      }
      .weather-details {
        text-align: left;
      }
      .weather-details p {
        margin: 0;
        line-height: 1.2;
      }
      .temperature {
        font-size: 1.5em;
        font-weight: bold;
      }
      
      /* --- ANIMATION STYLES --- */
      .bg-sunny {
        background: linear-gradient(to bottom, #87CEEB 0%, #FFFFFF 100%);
      }
      .bg-sunny::before {
        content: '';
        position: absolute;
        width: 80px; height: 80px;
        background-color: yellow; border-radius: 50%;
        box-shadow: 0 0 40px yellow, 0 0 60px orange;
        top: 20%; left: 15%;
        animation: sun-pulse 8s infinite alternate;
      }
      @keyframes sun-pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.9; }
        100% { transform: scale(1); opacity: 1; }
      }

      .bg-clear-night {
        background: linear-gradient(to bottom, #1a2a4e 0%, #3e506b 100%);
      }
      .bg-clear-night::before {
        content: ''; position: absolute;
        width: 100%; height: 100%;
        background-image: radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px);
        background-size: 20px 20px;
        opacity: 0.8;
        animation: twinkling-stars 20s infinite alternate;
      }
      @keyframes twinkling-stars {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 0.5; }
      }

      .bg-cloudy {
        background: linear-gradient(to bottom, #adc1d4 0%, #e0e6eb 100%);
      }
      .bg-cloudy::before, .bg-cloudy::after {
        content: ''; position: absolute;
        background-color: rgba(255,255,255,0.8); border-radius: 50%;
        filter: blur(5px); opacity: 0.9;
        animation: cloud-move-slow 30s linear infinite alternate;
      }
      .bg-cloudy::before { width: 120px; height: 120px; top: 10%; left: -20%; }
      .bg-cloudy::after { width: 180px; height: 180px; bottom: 5%; right: -30%; animation-duration: 25s; }
      @keyframes cloud-move-slow {
        0% { transform: translateX(0); }
        100% { transform: translateX(150px); }
      }

      .bg-fog {
        background: linear-gradient(to bottom, #e0e0e0 0%, #f0f0f0 100%);
      }
      .bg-fog::before {
        content: ''; position: absolute;
        width: 200%; height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.7) 10%, transparent 70%);
        animation: fog-drift 40s linear infinite alternate;
        top: -50%; left: -50%;
      }
      @keyframes fog-drift {
        0% { transform: translate(0, 0); opacity: 0.7; }
        50% { transform: translate(20px, 10px); opacity: 0.8; }
        100% { transform: translate(0, 0); opacity: 0.7; }
      }

      .bg-rainy, .bg-pouring {
        background: linear-gradient(to bottom, #5d7e9b 0%, #9baab8 100%);
      }
      .bg-rainy::before, .bg-pouring::before {
        content: ''; position: absolute; top: 0; left: 0;
        width: 100%; height: 100%;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><circle cx="5" cy="5" r="1" fill="rgba(173,216,230,0.8)"/></svg>') repeat;
        background-size: 15px 15px;
        animation: rain-fall 0.8s linear infinite;
      }
      @keyframes rain-fall {
        0% { background-position: 0 0; }
        100% { background-position: 0 100%; }
      }

      .bg-snowy {
        background: linear-gradient(to bottom, #b3cdd1 0%, #e8f0f2 100%);
      }
      .bg-snowy::before, .bg-snowy::after {
        content: ''; position: absolute;
        width: 100%; height: 100%;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><circle cx="5" cy="5" r="2" fill="rgba(255,255,255,0.9)"/></svg>') repeat;
        background-size: 20px 20px;
      }
      .bg-snowy::before { animation: snow-fall-slow 15s linear infinite; }
      .bg-snowy::after { background-position: 0 50%; animation: snow-fall-fast 10s linear infinite; }
      @keyframes snow-fall-slow {
        0% { transform: translateY(0); }
        100% { transform: translateY(100%); }
      }
      @keyframes snow-fall-fast {
        0% { transform: translateY(0); }
        100% { transform: translateY(100%); }
      }

      .bg-thunderstorm {
        background: linear-gradient(to bottom, #303030 0%, #606060 100%);
      }
      .bg-thunderstorm::before {
        content: ''; position: absolute; top: 0; left: 0;
        width: 100%; height: 100%;
        background-color: yellow; opacity: 0;
        animation: lightning-flash 8s infinite steps(1);
      }
      @keyframes lightning-flash {
        0% { opacity: 0; } 1% { opacity: 0.8; } 2% { opacity: 0; }
        50% { opacity: 0; } 51% { opacity: 0.8; } 52% { opacity: 0; }
      }

      .bg-windy {
        background: linear-gradient(to bottom, #aaccdd 0%, #eef1f2 100%);
      }
      .bg-windy::before, .bg-windy::after {
        content: ''; position: absolute;
        background-color: rgba(255,255,255,0.7); border-radius: 50%;
        filter: blur(3px); opacity: 0.9;
        animation: cloud-gust 20s linear infinite;
      }
      .bg-windy::before { width: 150px; height: 150px; top: 30%; left: -50%; }
      .bg-windy::after { width: 100px; height: 100px; top: 60%; right: -40%; animation-duration: 25s; }
      @keyframes cloud-gust {
        0% { transform: translateX(0); } 100% { transform: translateX(200px); }
      }
    `;
  }

  setConfig(config) {
    if (!config.weather_entity) {
      throw new Error('You need to define a weather_entity!');
    }
    this.config = config;
  }

  connectedCallback() {
    super.connectedCallback();
    this._updateTime();
    this._timeUpdateInterval = setInterval(() => this._updateTime(), 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._timeUpdateInterval);
  }

  _updateTime() {
    const now = new Date();
    this._time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this._date = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  _getWeatherBackgroundClass(condition) {
    if (!condition) return '';
    const normalizedCondition = condition.toLowerCase().replace(/ /g, '-');
    switch (normalizedCondition) {
      case 'sunny': return 'bg-sunny';
      case 'clear': return 'bg-sunny';
      case 'clear-night': return 'bg-clear-night';
      case 'cloudy': return 'bg-cloudy';
      case 'partlycloudy': return 'bg-cloudy';
      case 'partly-cloudy': return 'bg-cloudy';
      case 'overcast': return 'bg-cloudy';
      case 'fog': return 'bg-fog';
      case 'mist': return 'bg-fog';
      case 'haze': return 'bg-fog';
      case 'hail': return 'bg-hail';
      case 'ice': return 'bg-hail';
      case 'sleet': return 'bg-hail';
      case 'lightning': return 'bg-thunderstorm';
      case 'lightning-rainy': return 'bg-thunderstorm';
      case 'thunderstorm': return 'bg-thunderstorm';
      case 'severe': return 'bg-thunderstorm';
      case 'rainy': return 'bg-rainy';
      case 'light-rain': return 'bg-rainy';
      case 'showers': return 'bg-rainy';
      case 'pouring': return 'bg-pouring';
      case 'heavy-rain': return 'bg-pouring';
      case 'snowy': return 'bg-snowy';
      case 'snow': return 'bg-snowy';
      case 'snowy-rainy': return 'bg-snowy';
      case 'windy': return 'bg-windy';
      case 'windy-variant': return 'bg-windy';
      case 'exceptional': return 'bg-exceptional';
      default:
        console.warn(`Weather condition "${condition}" not explicitly handled for background animation.`);
        return 'bg-cloudy';
    }
  }

  render() {
    if (!this.hass || !this.config) {
      return html`<ha-card><div class="card-content"><p>Loading card...</p></div></ha-card>`;
    }

    const weatherEntity = this.hass.states[this.config.weather_entity];
    let weatherInfo = '';
    let backgroundClass = 'bg-cloudy'; // Fallback class
    if (weatherEntity) {
      const condition = weatherEntity.state;
      backgroundClass = this._getWeatherBackgroundClass(condition);
      weatherInfo = html`
        <div class="weather-info">
          <ha-icon icon="mdi:weather-${condition}"></ha-icon>
          <div class="weather-details">
            <p class="temperature">${weatherEntity.attributes.temperature}°${this.hass.config.unit_system.temperature}</p>
            <p>${condition.replace(/-/g, ' ')}</p>
          </div>
        </div>
      `;
    } else {
      weatherInfo = html`<p>Weather entity '${this.config.weather_entity}' not found or has no state.</p>`;
    }

    return html`
      <ha-card>
        <div class="animated-bg-container ${backgroundClass}"></div>
        <div class="card-content">
          <div class="time">${this._time}</div>
          <div class="date">${this._date}</div>
          ${weatherInfo}
        </div>
      </ha-card>
    `;
  }
}

customElements.define('weather-clock-card', WeatherClockCard);
