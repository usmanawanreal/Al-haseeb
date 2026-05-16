/** Urdu titles/descriptions keyed by English service title from API or fallbacks */
export const SERVICE_UR_BY_TITLE = {
  'Injection (IM / SC / IV)': {
    title: 'انجیکشن (IM / SC / IV)',
    description: 'گھر پر محفوظ طریقے سے انٹرا ماسکلر، سب کیوٹینئس اور انٹرا ویس انجیکشن۔',
  },
  Injections: {
    title: 'انجیکشن',
    description: 'تربیت یافتہ عملہ گھر پر IM، IV اور SC انجیکشن لگاتا ہے۔',
  },
  'Wound Dressing (simple)': {
    title: 'زخم کی پٹی (سادہ)',
    description: 'مریض کے گھر پر سادہ زخم کی صفائی اور پٹی۔',
  },
  'Wound Dressing (complex / post-surgical)': {
    title: 'زخم کی پٹی (پیچیدہ / سرجری کے بعد)',
    description: 'تربیت یافتہ عملہ پیچیدہ یا سرجری کے بعد زخم کی دیکھ بھال کرتا ہے۔',
  },
  'Wound Care': {
    title: 'زخم کی دیکھ بھال',
    description: 'گھر پر پیشہ ورانہ زخم کی پٹی، صفائی اور سرجری کے بعد کی دیکھ بھال۔',
  },
  'Wound Care & Dressing': {
    title: 'زخم کی دیکھ بھال اور پٹی',
    description: 'سرجیکل یا عام زخموں کی پیشہ ورانہ صفائی اور پٹی۔',
  },
  'IV Drip Administration': {
    title: 'IV ڈرپ کا انتظام',
    description: 'نگرانی میں IV سیال اور دوا کا انتظام۔',
  },
  'IV Drip Therapy': {
    title: 'IV ڈرپ تھراپی',
    description: 'پیشہ ورانہ نگرانی میں انٹرا ویس سیال تھراپی اور دوائی کے ڈرپ۔',
  },
  'Blood Pressure / Sugar Check': {
    title: 'بلڈ پریشر / شوگر چیک',
    description: 'دائمی اور بزرگ مریضوں کے لیے گھر پر وائٹلز کی نگرانی۔',
  },
  'Blood Sampling (at home)': {
    title: 'خون کا نمونہ (گھر پر)',
    description: 'لیبارٹری ٹیسٹ کے لیے گھر پر خون کا نمونہ۔',
  },
  'Blood Sampling': {
    title: 'خون کا نمونہ',
    description: 'لیبارٹری ٹیسٹ کے لیے گھر پر خون جمع کرنا۔',
  },
  'Blood Test': {
    title: 'خون کا ٹیسٹ',
    description: 'گھر پر خون کا ٹیسٹ اور نمونہ جمع۔',
  },
  'Foley Catheter Care': {
    title: 'فولی کیتھیٹر کی دیکھ بھال',
    description: 'بستر پر مریضوں کے لیے کیتھیٹر کی دیکھ بھال اور دیکھ بھال۔',
  },
  'NG Tube Care': {
    title: 'NG ٹیوب کی دیکھ بھال',
    description: 'گھر پر نازو گیسٹرک ٹیوب کی دیکھ بھال اور متعلقہ سپورٹ۔',
  },
  '24-Hour Emergency Home Visit': {
    title: '۲۴ گھنٹے ایمرجنسی گھریلو وزٹ',
    description: 'فوری گھریلو وزٹ — چوبیس گھنٹے دستیاب۔',
  },
  'Emergency Service': {
    title: 'ایمرجنسی سروس',
    description: '۲۴/۷ ایمرجنسی گھریلو طبی ردعمل — جب ضرورت ہو ہم آپ کے پاس آتے ہیں۔',
  },
  '24hr Emergency Visit': {
    title: '۲۴ گھنٹے ایمرجنسی وزٹ',
    description: 'فوری دیکھ بھال کے لیے فوری ردعمل (رات/ہفتے کے اضافی چارجز لاگو ہو سکتے ہیں)۔',
  },
  'Patient Monitoring': {
    title: 'مریض کی نگرانی',
    description: 'دائمی مریضوں کے لیے باقاعدہ چیک اپ اور وائٹلز کی نگرانی۔',
  },
  'Vital Signs Checkup': {
    title: 'وائٹل سائنز چیک',
    description: 'بلڈ پریشر، شوگر، آکسیجن اور درجہ حرارت کی نگرانی۔',
  },
  'Catheter Care': {
    title: 'کیتھیٹر کی دیکھ بھال',
    description: 'پیشاب کی نالی کے کیتھیٹر کی دہلیز، نکالنا یا معمول کی دیکھ بھال۔',
  },
  'CT Scan': {
    title: 'سی ٹی اسکین',
    description: 'مکمل جسم کا سی ٹی اسکین (حوالہ کے مطابق)۔',
  },
};

export function localizeService(service, lang) {
  if (!service || lang !== 'ur') {
    return {
      title: service?.title || service?.name || '',
      description: service?.description || service?.desc || '',
    };
  }
  const key = String(service.title || service.name || '').trim();
  const mapped = SERVICE_UR_BY_TITLE[key];
  if (mapped) {
    return { title: mapped.title, description: mapped.description };
  }
  return {
    title: service.title || service.name || '',
    description: service.description || service.desc || '',
  };
}

export function formatServicePrice(basePrice, lang) {
  if (typeof basePrice !== 'number') return '';
  const amount = basePrice.toLocaleString('en-PK');
  return lang === 'ur' ? `از PKR ${amount}+` : `From PKR ${amount}+`;
}

export function formatRsPrice(basePrice, lang) {
  if (typeof basePrice !== 'number') return lang === 'ur' ? 'رابطہ کریں' : 'Contact for quote';
  const amount = basePrice.toLocaleString('en-PK');
  return lang === 'ur' ? `Rs. ${amount}+` : `Rs. ${amount}+`;
}
