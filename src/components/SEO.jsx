import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component for dynamic meta tags
 * Provides enterprise-grade SEO optimization for LMS pages
 * 
 * @param {string} title - Page title (will append " | LMS Platform")
 * @param {string} description - Page description for meta tags
 * @param {string} keywords - Comma-separated keywords (appends to default LMS keywords)
 * @param {string} image - Open Graph image URL
 * @param {string} url - Canonical URL for the page
 * @param {string} type - Open Graph type (default: "website")
 */
const SEO = ({ 
  title = 'Enterprise Learning Management System | Professional Development Platform',
  description = 'Comprehensive online learning management system for professional development, certification programs, and skill-based training. Empower your workforce with enterprise-grade e-learning solutions.',
  keywords = '',
  image = 'https://lms-platform.com/og-image.jpg',
  url = 'https://lms-platform.com/',
  type = 'website'
}) => {
  // Default LMS keywords for all pages
  const defaultKeywords = 'learning management system, LMS, online training platform, professional development, certification programs, corporate e-learning, skill development, course management, virtual learning environment, employee training, online education platform, enterprise learning solutions';
  
  // Combine custom keywords with defaults
  const fullKeywords = keywords 
    ? `${keywords}, ${defaultKeywords}`
    : defaultKeywords;

  // Full page title
  const fullTitle = title.includes('LMS Platform') 
    ? title 
    : `${title} | LMS Platform`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={fullKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
