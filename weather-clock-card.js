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

  // The CSS for the card, now including a wider range of background animations
  static get styles() {
    return css`
      :host {
        display: block;
        --card-background-color: var(--ha-card-background, var(--card-background-color, white));
      }
      ha-card {
        position: relative;
        overflow: hidden;
        border-radius: var(--ha-card-border-radius, 12px); /* Ensure rounded corners clip animations */
      }
      .card-content {
        padding: 16px;
        text-align: center;
        z-index: 2; /* Ensure content is on top of animation */
        position: relative;
        color: var(--primary-text-color); /* Ensure text is readable on various backgrounds */
        text-shadow: 1px 1px 2px rgba(0,0,0,0.3); /* For better contrast */
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

      /* Animated Background Styles */
      .animated-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1; /* Place behind card content */
        background-color: var(--card-background-color);
        overflow: hidden; /* Crucial to keep animations inside the card */
      }

      /* Base keyframes for common elements */
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      /* --- Sunny / Clear Day --- */
      .animated-bg.sunny, .animated-bg.clear-day {
        background: linear-gradient(to bottom, #87CEEB 0%, #FFFFFF 100%);
      }
      .animated-bg.sunny::before, .animated-bg.clear-day::before {
        content: '';
        position: absolute;
        width: 80px;
        height: 80px;
        background-color: yellow;
        border-radius: 50%;
        box-shadow: 0 0 40px yellow, 0 0 60px orange;
        top: 20%;
        left: 15%;
        animation: sun-pulse 8s infinite alternate;
      }
      @keyframes sun-pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.9; }
        100% { transform: scale(1); opacity: 1; }
      }

      /* --- Clear Night --- */
      .animated-bg.clear-night {
        background: linear-gradient(to bottom, #1a2a4e 0%, #3e506b 100%);
      }
      .animated-bg.clear-night::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px);
        background-size: 20px 20px;
        opacity: 0.8;
        animation: twinkling-stars 20s infinite alternate;
      }
      @keyframes twinkling-stars {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 0.5; }
      }

      /* --- Cloudy / Partly Cloudy --- */
      .animated-bg.cloudy, .animated-bg.partlycloudy {
        background: linear-gradient(to bottom, #adc1d4 0%, #e0e6eb 100%);
      }
      .animated-bg.cloudy::before, .animated-bg.partlycloudy::before,
      .animated-bg.cloudy::after, .animated-bg.partlycloudy::after {
        content: '';
        position: absolute;
        background-color: rgba(255,255,255,0.8);
        border-radius: 50%;
        filter: blur(5px);
        opacity: 0.9;
      }
      .animated-bg.cloudy::before, .animated-bg.partlycloudy::before {
        width: 120px; height: 120px;
        top: 10%; left: -20%;
        animation: cloud-move-slow 30s linear infinite alternate;
      }
      .animated-bg.cloudy::after, .animated-bg.partlycloudy::after {
        width: 180px; height: 180px;
        bottom: 5%; right: -30%;
        animation: cloud-move-fast 25s linear infinite alternate;
      }
      @keyframes cloud-move-slow {
        0% { transform: translateX(0); }
        100% { transform: translateX(150px); }
      }
      @keyframes cloud-move-fast {
        0% { transform: translateX(0); }
        100% { transform: translateX(-200px); }
      }

      /* --- Fog / Haze --- */
      .animated-bg.fog, .animated-bg.haze {
        background: linear-gradient(to bottom, #e0e0e0 0%, #f0f0f0 100%);
      }
      .animated-bg.fog::before {
        content: '';
        position: absolute;
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

      /* --- Rainy / Pouring --- */
      .animated-bg.rainy, .animated-bg.pouring {
        background: linear-gradient(to bottom, #5d7e9b 0%, #9baab8 100%);
        box-shadow: inset 0 0 50px rgba(0,0,0,0.5); /* Darken slightly */
      }
      .animated-bg.rainy::before, .animated-bg.pouring::before {
        content: '';
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><circle cx="5" cy="5" r="1" fill="rgba(173,216,230,0.8)"/></svg>') repeat; /* Small rain drops */
        background-size: 15px 15px;
        animation: rain-fall 0.8s linear infinite;
      }
      @keyframes rain-fall {
        0% { background-position: 0 0; }
        100% { background-position: 0 100%; }
      }

      /* --- Snowy --- */
      .animated-bg.snowy {
        background: linear-gradient(to bottom, #b3cdd1 0%, #e8f0f2 100%);
      }
      .animated-bg.snowy::before, .animated-bg.snowy::after {
        content: '';
        position: absolute;
        width: 100%; height: 100%;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><circle cx="5" cy="5" r="2" fill="rgba(255,255,255,0.9)"/></svg>') repeat;
        background-size: 20px 20px;
      }
      .animated-bg.snowy::before {
        animation: snow-fall-slow 15s linear infinite;
      }
      .animated-bg.snowy::after {
        background-position: 0 50%;
        animation: snow-fall-fast 10s linear infinite;
      }
      @keyframes snow-fall-slow {
        0% { background-position: 0 0; }
        100% { background-position: 100px 200px; }
      }
      @keyframes snow-fall-fast {
        0% { background-position: 0 0; }
        100% { background-position: -50px 150px; }
      }

      /* --- Stormy / Thunderstorm --- */
      .animated-bg.stormy, .animated-bg.thunderstorm {
        background: linear-gradient(to bottom, #303030 0%, #606060 100%);
        filter: brightness(0.7);
      }
      .animated-bg.stormy::before, .animated-bg.thunderstorm::before {
        content: '';
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><circle cx="5" cy="5" r="1" fill="rgba(100,100,100,0.8)"/></svg>') repeat; /* Dark rain */
        background-size: 12px 12px;
        animation: rain-fall 0.6s linear infinite;
      }
      .animated-bg.stormy::after, .animated-bg.thunderstorm::after {
        content: '';
        position: absolute;
        top: 20%; left: 30%;
        width: 10px; height: 10px;
        background-color: yellow;
        opacity: 0;
        border-radius: 50%;
        box-shadow: 0 0 50px 20px yellow, 0 0 80px 30px orange;
        animation: lightning-flash 8s infinite steps(1); /* Sudden flash */
      }
      @keyframes lightning-flash {
        0% { opacity: 0; }
        1% { opacity: 1; }
        2% { opacity: 0; }
        3% { opacity: 1; }
        4% { opacity: 0; }
        50% { opacity: 0; }
        51% { opacity: 1; }
        52% { opacity: 0; }
        100% { opacity: 0; }
      }

      /* --- Wind / Windy --- */
      .animated-bg.windy {
        background: linear-gradient(to bottom, #aaccdd 0%, #eef1f2 100%);
      }
      .animated-bg.windy::before, .animated-bg.windy::after {
        content: '';
        position: absolute;
        background-color: rgba(255,255,255,0.7);
        border-radius: 50%;
        filter: blur(3px);
      }
      .animated-bg.windy::before {
        width: 150px; height: 150px;
        top: 30%; left: -50%;
        animation: cloud-gust 20s linear infinite;
      }
      .animated-bg.windy::after {
        width: 100px; height: 100px;
        top: 60%; right: -40%;
        animation: cloud-gust-alt 25s linear infinite;
      }
      @keyframes cloud-gust {
        0% { transform: translateX(0); opacity: 0.7; }
        50% { transform: translateX(200px); opacity: 0.9; }
        100% { transform: translateX(0); opacity: 0.7; }
      }
      @keyframes cloud-gust-alt {
        0% { transform: translateX(0); opacity: 0.8; }
        50% { transform: translateX(-150px); opacity: 0.6; }
        100% { transform: translateX(0); opacity: 0.8; }
      }

      /* --- Hail --- */
      .animated-bg.hail {
        background: linear-gradient(to bottom, #7f8c8d 0%, #bdc3c7 100%);
      }
      .animated-bg.hail::before {
        content: '';
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect x="4" y="4" width="2" height="2" fill="rgba(200,200,200,0.9)" transform="rotate(45 5 5)"/></svg>') repeat; /* Small squares for hail */
        background-size: 15px 15px;
        animation: hail-fall 0.5s linear infinite;
      }
      @keyframes hail-fall {
        0% { background-position: 0 0; }
        100% { background-position: 0 100%; }
      }

      /* --- Extreme / Hurricane / Tornado --- (Simplified) */
      .animated-bg.exceptional {
        background: linear-gradient(to bottom, #2c3e50 0%, #34495e 100%);
      }
      .animated-bg.exceptional::before {
        content: '';
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background-image: radial-gradient(circle at center, rgba(255,255,0,0.2) 0%, transparent 70%);
        background-size: 300% 300%;
        animation: extreme-swirl 10s linear infinite;
      }
      @keyframes extreme-swirl {
        0% { transform: rotate(0deg) scale(1); background-position: 0% 0%; }
        100% { transform: rotate(360deg) scale(1.2); background-position: 100% 100%; }
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
    // Update time every second
    this._timeUpdateInterval = setInterval(() => this._updateTime(), 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Clear interval when card is removed
    clearInterval(this._timeUpdateInterval);
  }

  _updateTime() {
    const now = new Date();
    // Format time (e.g., "10:30 AM")
    this._time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // Format date (e.g., "Thursday, October 26, 2023")
    this._date = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Maps Home Assistant weather states to CSS class names for animations
  _getWeatherBackgroundClass(condition) {
    switch (condition) {
      case 'sunny':
        return 'sunny';
      case 'clear-night':
        return 'clear-night';
      case 'cloudy':
        return 'cloudy';
      case 'partlycloudy': // Home Assistant often uses this
        return 'partlycloudy';
      case 'fog':
        return 'fog';
      case 'hail':
        return 'hail';
      case 'lightning':
      case 'lightning-rainy':
      case 'thunderstorm':
        return 'thunderstorm'; // Group lightning under thunderstorm
      case 'rainy':
        return 'rainy';
      case 'pouring':
        return 'pouring'; // More intense rain
      case 'snowy':
      case 'snowy-rainy':
        return 'snowy';
      case 'windy':
      case 'windy-variant':
        return 'windy';
      case 'exceptional': // For extreme conditions like hurricane, tornado
        return 'exceptional';
      // Add more specific conditions if your weather integration provides them
      default:
        console.warn(`Weather condition "${condition}" not explicitly handled for background animation.`);
        return 'cloudy'; // Fallback to a generic cloudy animation
    }
  }

  render() {
    if (!this.hass || !this.config) {
      return html`
        <ha-card>
          <div class="card-content">
            <p>Loading card...</p>
          </div>
        </ha-card>
      `;
    }

    const weatherEntity = this.hass.states[this.config.weather_entity];
    let weatherInfo = '';
    let backgroundClass = '';

    if (weatherEntity) {
      const temperature = weatherEntity.attributes.temperature;
      const unit = this.hass.config.unit_system.temperature; // Get user's temp unit
      const condition = weatherEntity.state;
      const humidity = weatherEntity.attributes.humidity;
      const pressure = weatherEntity.attributes.pressure;
      const windSpeed = weatherEntity.attributes.wind_speed;
      const windBearing = weatherEntity.attributes.wind_bearing;
      
      backgroundClass = this._getWeatherBackgroundClass(condition);

      weatherInfo = html`
        <div class="weather-info">
          <ha-icon icon="mdi:weather-${condition}"></ha-icon> 
          <div class="weather-details">
            <p class="temperature">${temperature}°${unit}</p>
            <p>${condition.replace(/-/g, ' ')}</p>
            ${humidity ? html`<p>Humidity: ${humidity}%</p>` : ''}
            ${windSpeed ? html`<p>Wind: ${windSpeed} ${this.hass.config.unit_system.length}/h</p>` : ''}
          </div>
        </div>
      `;
    } else {
      weatherInfo = html`<p>Weather entity '${this.config.weather_entity}' not found or has no state.</p>`;
    }

    return html`
      <ha-card>
        <div class="animated-bg ${backgroundClass}"></div>
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