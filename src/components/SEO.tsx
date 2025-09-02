import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
}

const DEFAULT_META = {
  title: 'Games & Connect - Join Ghana\'s Premier Gaming Community',
  description: 'Connect with fellow gamers across Ghana! Join exciting gaming events, trivia nights, tournaments, and community adventures. Register for upcoming events now!',
  keywords: 'gaming community Ghana, gaming events Accra, FIFA tournament, trivia night, esports Ghana, gaming meetups, community events, multiplayer gaming, video games Ghana',
  image: 'https://res.cloudinary.com/drkjnrvtu/image/upload/c_fill,w_1200,h_630,g_center,q_auto,f_auto/v1756502370/games_and_connect_og_banner.jpg',
  url: 'https://gamesandconnect.netlify.app',
  type: 'website'
};

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  article
}: SEOProps) {
  const meta = {
    title: title ? `${title} | Games & Connect` : DEFAULT_META.title,
    description: description || DEFAULT_META.description,
    keywords: keywords || DEFAULT_META.keywords,
    image: image || DEFAULT_META.image,
    url: url || DEFAULT_META.url,
    type
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{meta.title}</title>
      <meta name="title" content={meta.title} />
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={meta.type} />
      <meta property="og:url" content={meta.url} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:alt" content={meta.title} />
      <meta property="og:site_name" content="Games & Connect" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={meta.url} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />
      <meta name="twitter:image:alt" content={meta.title} />
      
      {/* Article specific meta tags */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:author" content={article.author} />
          {article.tags?.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={meta.url} />
    </Helmet>
  );
}
