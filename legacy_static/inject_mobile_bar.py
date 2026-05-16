import os
import re

css_addition = """
/* --- Mobile Sticky Conversion Bar --- */
.mobile-sticky-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: var(--white);
  box-shadow: 0 -4px 10px rgba(0,0,0,0.1);
  display: flex;
  z-index: 1040;
  padding: 0.5rem;
  gap: 0.5rem;
  border-top: 1px solid var(--border);
}
.mobile-sticky-bar .btn-sticky {
  flex: 1;
  padding: 0.75rem 0;
  border-radius: var(--radius);
  font-weight: 700;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--white);
  border: none;
  text-decoration: none;
}
.mobile-sticky-bar .btn-sticky-whatsapp {
  background: var(--whatsapp);
}
.mobile-sticky-bar .btn-sticky-call {
  background: var(--emergency);
  animation: emergencyPulse 2s infinite;
}
@media (min-width: 768px) {
  .mobile-sticky-bar { display: none; }
}
@media (max-width: 767px) {
  .whatsapp-float { display: none; /* Hide circle on mobile in favor of sticky bar */ }
  body { padding-bottom: 70px; /* Space for sticky bar */ }
}
"""

with open('css/style.css', 'a', encoding='utf-8') as f:
    f.write(css_addition)

html_addition = """
  <!-- Mobile Sticky Conversion Bar -->
  <div class="mobile-sticky-bar d-md-none">
    <a href="https://wa.me/923187281385?text=I%20need%20home%20healthcare%20service" target="_blank" class="btn-sticky btn-sticky-whatsapp"><i class="bi bi-whatsapp"></i> WhatsApp</a>
    <a href="tel:03187281385" class="btn-sticky btn-sticky-call"><i class="bi bi-telephone-fill"></i> Call Now</a>
  </div>
"""

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    if '<div class="mobile-sticky-bar' not in content:
        content = content.replace('</body>', html_addition + '</body>')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Injected sticky mobile conversion bar and CSS.")
