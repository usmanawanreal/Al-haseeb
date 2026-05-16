const Service = require('../models/Service');

const DEFAULT_SERVICES = [
  {
    title: 'Injection (IM / SC / IV)',
    description: 'Intramuscular, subcutaneous, and intravenous injections at home.',
    icon: 'bi-capsule',
    basePrice: 400,
    isAvailable24_7: true,
  },
  {
    title: 'Wound Dressing (simple)',
    description: 'Simple wound cleaning and dressing at the patient home.',
    icon: 'bi-bandaid',
    basePrice: 650,
    isAvailable24_7: true,
  },
  {
    title: 'Wound Dressing (complex / post-surgical)',
    description: 'Complex or post-surgical wound care by trained staff.',
    icon: 'bi-bandaid',
    basePrice: 1150,
    isAvailable24_7: true,
  },
  {
    title: 'IV Drip Administration',
    description: 'IV fluid and medication administration under supervision.',
    icon: 'bi-droplet-half',
    basePrice: 950,
    isAvailable24_7: true,
  },
  {
    title: 'Blood Pressure / Sugar Check',
    description: 'Vitals monitoring at home for chronic and elderly patients.',
    icon: 'bi-activity',
    basePrice: 250,
    isAvailable24_7: true,
  },
  {
    title: 'Blood Sampling (at home)',
    description: 'Home blood collection for laboratory tests.',
    icon: 'bi-eyedropper',
    basePrice: 500,
    isAvailable24_7: true,
  },
  {
    title: 'Foley Catheter Care',
    description: 'Catheter care and maintenance for bedridden patients.',
    icon: 'bi-heart-pulse',
    basePrice: 1000,
    isAvailable24_7: true,
  },
  {
    title: 'NG Tube Care',
    description: 'Nasogastric tube care and related support at home.',
    icon: 'bi-heart-pulse',
    basePrice: 1000,
    isAvailable24_7: true,
  },
  {
    title: '24-Hour Emergency Home Visit',
    description: 'Urgent home visit dispatch — available around the clock.',
    icon: 'bi-heart-pulse',
    basePrice: 1500,
    isAvailable24_7: true,
  },
];

async function ensureDefaultServices() {
  try {
    const count = await Service.countDocuments();
    if (count > 0) {
      return;
    }

    await Service.insertMany(
      DEFAULT_SERVICES.map((s) => ({ ...s, isActive: true }))
    );
    console.log(`[ensureDefaultServices] Seeded ${DEFAULT_SERVICES.length} default services.`);
  } catch (e) {
    console.error('[ensureDefaultServices]', e.message);
  }
}

module.exports = { ensureDefaultServices, DEFAULT_SERVICES };
