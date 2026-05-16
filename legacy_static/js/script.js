/* ===========================================
   Al-Haseeb Medical Health Care Center SKG
   Main JavaScript
   =========================================== */

// --- Translations ---
const translations = {
  en: {
    nav: { home:"Home", about:"About Us", services:"Treatments", pricing:"Tariffs", booking:"Book Appointment", emergency:"24/7 Emergency", testimonials:"Patient Reviews", blog:"Health Tips", contact:"Contact Clinic" },
    hero: { badge:"24/7 Home Nursing & Medical Care", title:"Expert Medical Care Delivered to Your Home", subtitle:"Al-Haseeb Medical Health Care Center brings hospital-grade treatments directly to your doorstep in Shakargarh. Supervised by qualified professionals.", btnBook:"Schedule a Home Visit", btnWhatsapp:"Consult via WhatsApp" },
    services: { subtitle:"OUR TREATMENTS", title:"Comprehensive Home Healthcare", desc:"We provide sterile, safe, and professional medical procedures in the comfort of your home, ensuring fast recovery and peace of mind.",
      s1:{name:"Injectable Therapies",desc:"Safe administration of IM, IV, and Subcutaneous injections using strict sterile protocols."},
      s2:{name:"Wound Management",desc:"Clinical-grade wound dressing, suture removal, and diabetic foot care by experienced nurses."},
      s3:{name:"IV Drip Infusions",desc:"Hydration, vitamins, and medication drips administered under constant vital monitoring."},
      s4:{name:"Lab Diagnostics",desc:"Hygienic blood sampling from home with samples sent to certified partner laboratories."},
      s5:{name:"Urgent Medical Response",desc:"Immediate dispatch of our medical team for midnight emergencies and acute symptom management."},
      s6:{name:"Catheter & Vitals Care",desc:"Routine catheter maintenance, BP, sugar, and oxygen monitoring for elderly or bedridden patients."}
    },
    stats: { patients:"Patients Treated", experience:"Years of Excellence", available:"Emergency Response", staff:"Qualified Staff" },
    about: { subtitle:"ABOUT THE CLINIC", title:"Shakargarh's Most Trusted Home Care Provider", desc:"Al-Haseeb Medical Health Care Center was established with a singular mission: to make premium healthcare accessible to everyone in Shakargarh and Narowal. We understand that traveling to a hospital isn't always possible, which is why our certified paramedical staff brings the clinic to your bedroom.", points:["Rapid 24/7 Emergency Dispatch","Certified & Highly Trained Paramedics","Strict Infection Control Protocols","Compassionate Elderly Care"], btn:"Meet Our Medical Team" },
    testimonials: { subtitle:"PATIENT EXPERIENCES", title:"Stories of Recovery & Trust" },
    cta: { title:"Require Immediate Medical Assistance?", desc:"Our clinical dispatch team is on standby 24/7. Request a home visit or get a free medical consultation on WhatsApp.", btnBook:"Request Home Visit", btnWA:"Message on WhatsApp" },
    pricing: { subtitle:"CLINIC TARIFFS", title:"Transparent Medical Pricing", desc:"We believe in affordable healthcare. Final charges may vary based on the patient's exact location and medical requirements.", startFrom:"Starting from", getQuote:"Request Exact Quote", note:"* Specialized procedures and midnight emergency visits carry standard surcharges." },
    booking: { subtitle:"PATIENT REGISTRATION", title:"Request a Home Medical Visit", name:"Patient's Full Name", phone:"Contact Number", service:"Required Medical Service", date:"Preferred Date", time:"Preferred Time", address:"Complete Home Address", notes:"Describe Symptoms or Needs", emergency:"This is a critical emergency", submit:"Confirm Booking", success:"Your medical request has been received. Our clinical coordinator will call you instantly." },
    contact: { subtitle:"CLINIC CONTACT", title:"Reach Our Support Desk", address:"Al-Haseeb Medical Center, Shakargarh, District Narowal, Punjab", phone:"03187281385", email:"info@alhaseeb.pk", hours:"24/7 Clinical Support", sendMsg:"Submit Inquiry", yourName:"Patient Name", yourEmail:"Email Address", yourPhone:"Phone Number", yourMsg:"Medical Inquiry Details" },
    emergency: { title:"Immediate Emergency Response", desc:"Do not wait if symptoms are severe. Call our emergency dispatch line directly for immediate medical intervention at your home.", call:"Dispatch Medical Team", or:"OR", whatsapp:"Emergency WhatsApp Line", steps:"Emergency Protocol", step1:"Dial our emergency line immediately", step2:"Clearly state the patient's age and current symptoms", step3:"Provide your exact street address or share live location", step4:"Ensure the patient is resting safely until our team arrives" },
    footer: { desc:"Delivering hospital-standard medical care to the homes of Shakargarh and Narowal. Your health is our primary responsibility.", quickLinks:"Patient Resources", contactInfo:"Emergency Contact", workingHours:"Clinical Hours", allDay:"Monday – Sunday", allTime:"24/7 Rapid Response", rights:"All Rights Reserved." },
    blog: { subtitle:"MEDICAL INSIGHTS", title:"Health Education & Tips", readMore:"Read Article" },
    lang: "اردو"
  },
  ur: {
    nav: { home:"ہوم", about:"ہمارا تعارف", services:"علاج و سہولیات", pricing:"فیس کی تفصیل", booking:"اپائنٹمنٹ بک کریں", emergency:"ایمرجنسی", testimonials:"مریضوں کے تاثرات", blog:"صحت کی معلومات", contact:"رابطہ کریں" },
    hero: { badge:"24/7 ہوم نرسنگ سروس", title:"ماہرین کی زیرِ نگرانی، بہترین علاج آپ کے گھر پر", subtitle:"الحسیب میڈیکل ہیلتھ کیئر سنٹر اب شکرگڑھ میں ہسپتال جیسی معیاری طبی سہولیات آپ کی دہلیز پر فراہم کر رہا ہے۔ مستند اور تجربہ کار سٹاف کے ساتھ۔", btnBook:"ہوم وزٹ بک کریں", btnWhatsapp:"واٹس ایپ پر مشورہ کریں" },
    services: { subtitle:"ہماری طبی سہولیات", title:"گھر پر مکمل علاج اور دیکھ بھال", desc:"ہم آپ کے گھر کے آرام دہ ماحول میں جراثیم سے پاک اور محفوظ طبی سہولیات فراہم کرتے ہیں، تاکہ آپ جلد صحت یاب ہو سکیں۔",
      s1:{name:"انجیکشن سروس",desc:"آئی ایم، آئی وی، اور جلد کے نیچے لگنے والے انجیکشنز ماہر سٹاف کے ذریعے محفوظ طریقے سے لگوائیں۔"},
      s2:{name:"زخموں کی ڈریسنگ",desc:"آپریشن کے بعد کے زخموں، شوگر کے زخموں، اور عام چوٹوں کی پروفیشنل ڈریسنگ اور صفائی۔"},
      s3:{name:"آئی وی ڈرپ سروس",desc:"مریض کی حالت کو مانیٹر کرتے ہوئے گھر پر ڈرپ (گلوکوز/طاقت) اور ادویات کی فراہمی۔"},
      s4:{name:"خون کے ٹیسٹ",desc:"لیبارٹری ٹیسٹ کے لیے گھر بیٹھے خون کے نمونے دینے کی سہولت، سو فیصد درست نتائج کے ساتھ۔"},
      s5:{name:"ایمرجنسی سروس",desc:"آدھی رات ہو یا دن کا کوئی پہر، کسی بھی میڈیکل ایمرجنسی میں ہماری ٹیم فوراً آپ کے پاس پہنچے گی۔"},
      s6:{name:"مریض کی دیکھ بھال",desc:"بزرگ یا بستر تک محدود مریضوں کے لیے کیتھیٹر لگانا، بلڈ پریشر، شوگر اور آکسیجن چیک کرنا۔"}
    },
    stats: { patients:"صحت یاب مریض", experience:"سال کا تجربہ", available:"ایمرجنسی سروس", staff:"مستند طبی عملہ" },
    about: { subtitle:"ہمارے بارے میں", title:"شکرگڑھ کا سب سے قابلِ اعتماد ہوم کیئر سنٹر", desc:"الحسیب میڈیکل ہیلتھ کیئر سنٹر کا قیام اس مقصد کے تحت کیا گیا کہ شکرگڑھ اور نارووال کے ہر فرد کو بہترین طبی سہولیات گھر پر مل سکیں۔ ہم جانتے ہیں کہ ہسپتال جانا ہمیشہ ممکن نہیں ہوتا، اس لیے ہمارا مستند پیرا میڈیکل سٹاف ہسپتال جیسی سہولیات آپ کے گھر لاتا ہے۔", points:["24/7 ایمرجنسی اور فوری رسپانس","مستند اور اعلیٰ تربیت یافتہ عملہ","انفیکشن سے بچاؤ کے سخت اصول","بزرگ مریضوں کی خصوصی دیکھ بھال"], btn:"ہماری میڈیکل ٹیم سے ملیں" },
    testimonials: { subtitle:"مریضوں کے تاثرات", title:"صحت یابی اور اعتماد کی کہانیاں" },
    cta: { title:"کیا آپ کو فوری طبی امداد کی ضرورت ہے؟", desc:"ہماری میڈیکل ڈسپیچ ٹیم 24 گھنٹے تیار ہے۔ ہوم وزٹ کے لیے ابھی اپائنٹمنٹ بک کریں یا واٹس ایپ پر مفت مشورہ حاصل کریں۔", btnBook:"ہوم وزٹ بک کریں", btnWA:"واٹس ایپ پر میسج کریں" },
    pricing: { subtitle:"فیس اور چارجز", title:"شفاف میڈیکل فیس", desc:"ہمارا مقصد سستا اور معیاری علاج فراہم کرنا ہے۔ حتمی چارجز کا دارومدار مریض کی لوکیشن اور بیماری کی نوعیت پر ہے۔", startFrom:"فیس شروع", getQuote:"فیس معلوم کریں", note:"* خاص طبی طریقوں اور آدھی رات کی ایمرجنسی وزٹ پر اضافی چارجز لاگو ہو سکتے ہیں۔" },
    booking: { subtitle:"مریض کی رجسٹریشن", title:"گھر پر چیک اپ کے لیے درخواست دیں", name:"مریض کا پورا نام", phone:"رابطہ نمبر", service:"درکار میڈیکل سروس", date:"کس دن آنا ہے؟", time:"کس وقت آنا ہے؟", address:"گھر کا مکمل پتہ", notes:"علامات یا بیماری کی تفصیل لکھیں", emergency:"یہ ایک شدید ایمرجنسی ہے", submit:"بکنگ کنفرم کریں", success:"آپ کی درخواست موصول ہو گئی ہے۔ ہمارا کلینیکل کوآرڈینیٹر آپ کو فوراً کال کرے گا۔" },
    contact: { subtitle:"کلینک سے رابطہ", title:"ہمارے سپورٹ ڈیسک سے رابطہ کریں", address:"الحسیب میڈیکل سنٹر، شکرگڑھ، ضلع نارووال، پنجاب", phone:"03187281385", email:"info@alhaseeb.pk", hours:"24/7 کلینیکل سپورٹ", sendMsg:"پیغام بھیجیں", yourName:"مریض کا نام", yourEmail:"ای میل ایڈریس", yourPhone:"فون نمبر", yourMsg:"بیماری کی تفصیل یا سوال" },
    emergency: { title:"فوری ایمرجنسی رسپانس", desc:"اگر علامات شدید ہوں تو انتظار نہ کریں۔ گھر پر فوری طبی امداد کے لیے براہ راست ہماری ایمرجنسی ہیلپ لائن پر کال کریں۔", call:"میڈیکل ٹیم بلائیں", or:"یا", whatsapp:"ایمرجنسی واٹس ایپ", steps:"ایمرجنسی میں کیا کریں؟", step1:"فوری طور پر ہماری ایمرجنسی لائن پر کال کریں", step2:"مریض کی عمر اور موجودہ علامات واضح طور پر بتائیں", step3:"گھر کا درست پتہ بتائیں یا لائیو لوکیشن شیئر کریں", step4:"ہماری ٹیم کے پہنچنے تک مریض کو محفوظ اور آرام دہ حالت میں رکھیں" },
    footer: { desc:"شکرگڑھ اور نارووال کے گھروں میں ہسپتال جیسی معیاری طبی دیکھ بھال کی فراہمی۔ آپ کی صحت ہماری اولین ذمہ داری ہے۔", quickLinks:"مریضوں کے لیے لنکس", contactInfo:"ایمرجنسی رابطہ", workingHours:"کلینک کے اوقات", allDay:"پیر سے اتوار", allTime:"24/7 فوری رسپانس", rights:"جملہ حقوق محفوظ ہیں۔" },
    blog: { subtitle:"طبی معلومات", title:"صحت سے متعلق مضامین", readMore:"مضمون پڑھیں" },
    lang: "English"
  }
};

// --- State ---
let currentLang = localStorage.getItem('alhaseeb-lang') || 'en';

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
  initNavbarScroll();
  initScrollAnimations();
  initCounters();
  initForms();
});

// --- Language Switch ---
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('alhaseeb-lang', lang);
  const t = translations[lang];
  const isRTL = lang === 'ur';

  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  document.body.classList.toggle('rtl', isRTL);

  // Update all translatable elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = getNestedValue(t, key);
    if (value) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = value;
      } else if (el.tagName === 'OPTION') {
        el.textContent = value;
      } else {
        el.textContent = value;
      }
    }
  });

  // Update lang toggle button text
  const langBtn = document.getElementById('langToggle');
  if (langBtn) langBtn.textContent = t.lang;

  // Fix WhatsApp float position for RTL
  const waFloat = document.querySelector('.whatsapp-float');
  if (waFloat) {
    waFloat.style.right = isRTL ? 'auto' : '24px';
    waFloat.style.left = isRTL ? '24px' : 'auto';
  }
}

function toggleLanguage() {
  setLanguage(currentLang === 'en' ? 'ur' : 'en');
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : null, obj);
}

// --- Navbar Scroll Effect ---
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar-custom');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// --- Scroll Animations ---
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// --- Counter Animation ---
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        animateCounter(el, 0, target, 2000, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el, start, end, duration, suffix) {
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * eased);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// --- Form Handling ---
function initForms() {
  // Booking form
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(bookingForm);
      const data = Object.fromEntries(formData);

      // Build WhatsApp message
      const msg = `*New Appointment Request*\n\n*Name:* ${data.name}\n*Phone:* ${data.phone}\n*Service:* ${data.service}\n*Preferred Time:* ${data.time}\n*Address:* ${data.address}`;
      const waURL = `https://wa.me/923187281385?text=${encodeURIComponent(msg)}`;

      // Show success message
      const t = translations[currentLang];
      const successDiv = document.getElementById('bookingSuccess');
      if (successDiv) {
        successDiv.classList.remove('d-none');
        successDiv.textContent = t.booking.success;
      }
      bookingForm.reset();

      // Open WhatsApp
      setTimeout(() => window.open(waURL, '_blank'), 500);
    });
  }

  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      const msg = `Message from Website:\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nMessage: ${data.message}`;
      const waURL = `https://wa.me/923187281385?text=${encodeURIComponent(msg)}`;
      window.open(waURL, '_blank');
      contactForm.reset();
    });
  }
}

// --- WhatsApp Helper ---
function openWhatsApp(customMsg) {
  const defaultMsg = currentLang === 'ur'
    ? 'السلام علیکم، میں الحسیب سے ہوم ہیلتھ کیئر وزٹ بک کرنا چاہتا/چاہتی ہوں۔'
    : 'Hi, I would like to book a home healthcare visit from Al-Haseeb. Please assist.';
  const msg = customMsg || defaultMsg;
  window.open(`https://wa.me/923187281385?text=${encodeURIComponent(msg)}`, '_blank');
}
