/**
 * Per-page SEO tags using React 19's native document metadata support:
 * <title>, <meta>, and <link> rendered anywhere in the component tree are
 * hoisted into <head> automatically by React DOM — no react-helmet needed.
 *
 * Usage: <Seo title="Pricing" description="..." path="/pricing" />
 */
const SITE_NAME = 'Al-Haseeb Medical Health Care Center';
const SITE_URL = 'https://alhaseebmedical.com'; // update to the real production domain
const DEFAULT_DESCRIPTION =
  'Al-Haseeb Medical Health Care Center provides certified 24/7 home healthcare services in Shakargarh & Narowal — injections, wound care, IV drips, blood sampling, and emergency home visits.';
const DEFAULT_IMAGE = `${SITE_URL}/og-cover.jpg`;

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_IMAGE,
  noindex = false,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Home Healthcare Shakargarh`;
  const canonicalUrl = `${SITE_URL}${path === '/' ? '' : path}`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph (Facebook, WhatsApp, LinkedIn link previews) */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_PK" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}

export { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION };
