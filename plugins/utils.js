export default ({ app }, inject) => {
  const formatDate = (date) => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    const _date = new Date(date).toLocaleDateString('pt-BR', options).replace(',', '');
    if (_date === 'Invalid Date') {
      return '';
    }
    return _date;
  };

  const getIconBySensor = (key) => {
    return {
      'humidity': 'mdi-water',
      'temperature': 'mdi-thermometer',
      'mq2': 'mdi-gas-burner',
      'ldr': 'mdi-brightness-6',
      'noise': 'mdi-home-sound-in-outline',
      'presence': 'mdi-run-fast',
      'wifi': 'mdi-wifi',
      'pressure': 'mdi-gauge',
      'memory': 'mdi-memory',
      'cpu': 'mdi-cpu-32-bit',
      'uptime': 'mdi-timer-cog-outline',
      'temp_internal': 'mdi-thermometer',
      'voltage': 'mdi-flash-triangle-outline'
    }[key] || ''
  };
  const getUnitBySensor = (key) => {
    return {
      'temperature': '°C',
      'humidity': '%',
      'lumi': 'lux',
      'mq2': 'ppm',
      'ldr': 'lux',
      'presence': '',
      'noise': 'dB',
    }[key] || '';
  }

  const getNameBySensor = (key) => {
    return {
      'temperature': 'Temperatura',
      'humidity': 'Humidade',
      'lumi': 'Luminosidade',
      'mq2': 'Gases',
      'ldr': 'Luminosidade',
      'presence': 'Presença',
      'noise': 'Ruído',
    }[key] || '';
  }

  const formatHistorySensors = (h) => {
    let a = Object.entries(h).flatMap(([key, item]) => {
      return Object.entries(item).map(([k, i]) => ({
        key: key,
        value: typeof i.value === 'boolean' ? (i.value ? 'Detectado' : 'Não detectado') : i.value,
        date: formatDate(i.updated_at),
        updated_at: i.updated_at
      }));
    });
    return a.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  }

  const showForm = (key) => {
    if (key === 'presence' || key === 'wifi') {
      return false
    }

    return true
  }

  const formatMilis = (ms) => {
    const milliseconds = ms % 1000;
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    let formatted = '';

    if (hours > 0) {
      formatted += hours + 'h ';
    }
    if (minutes > 0 || hours > 0) {
      formatted += minutes + 'm ';
    }
    if (seconds > 0 || minutes > 0 || hours > 0) {
      formatted += seconds + 's ';
    }


    return formatted.trim();
  }

  const formatNumber = (number, key = '') => {
    if (key == 'presence') {
      return number ? 'Detectado' : 'Não detectado'
    }
    if (key == 'wifi') {
      return !number ? '-' : number
    }

    if (key == 'uptime') {
      return formatMilis(number)
    }

    if (key == 'ip') {
      return number
    }

    if (key == 'voltage') {
      return parseFloat(number).toFixed(2)
    }

    if (key == 'mq2') {
      return parseFloat(number).toFixed(3)
    }

    let n = parseFloat(number);
    if (isNaN(n)) {
      return 0;
    }
    return n.toFixed(1)
  }

  inject('formatDate', formatDate);
  inject('getIconBySensor', getIconBySensor);
  inject('getUnitBySensor', getUnitBySensor);
  inject('getNameBySensor', getNameBySensor);
  inject('formatHistorySensors', formatHistorySensors);
  inject('showForm', showForm);
  inject('formatNumber', formatNumber);
};
