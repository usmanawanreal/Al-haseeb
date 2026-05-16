import os

json_ld = """
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": ["MedicalOrganization", "LocalBusiness"],
    "name": "Al-Haseeb Medical Health Care Center",
    "url": "https://alhaseeb.pk",
    "logo": "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=500&h=500&fit=crop",
    "image": "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1200&h=630&fit=crop",
    "description": "24/7 Professional home healthcare in Shakargarh, Narowal. Injections, wound care, IV drips & emergency visits.",
    "telephone": "+92-318-7281385",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Main City",
      "addressLocality": "Shakargarh",
      "addressRegion": "Punjab",
      "postalCode": "51800",
      "addressCountry": "PK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 32.2687,
      "longitude": 75.1581
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "medicalSpecialty": [
      "HomeHealthCare",
      "Emergency"
    ],
    "priceRange": "PKR"
  }
  </script>
"""

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Inject JSON-LD before </head> if not already there
    if 'application/ld+json' not in content:
        content = content.replace('</head>', json_ld + '</head>')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Injected Advanced Local SEO Schema into {len(html_files)} files.")
