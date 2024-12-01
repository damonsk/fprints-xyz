import { IBlueprintDetails } from '@/supabase/more-types';
import { Helmet as ReactHelmet } from 'react-helmet-async';

export const Helmet = ({ blueprint }: { blueprint: IBlueprintDetails }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: blueprint.title,
    description: blueprint.description,
    image: blueprint.image_url,
    dateCreated: blueprint.created_at,
    dateModified: blueprint.updated_at,
    author: {
      '@type': 'Person',
      name: blueprint.user_handle,
    },
  };

  return (
    <ReactHelmet>
      <title>{`${blueprint.title} - Factorio Blueprint | Fprints`}</title>
      <meta
        name="description"
        content={
          blueprint.description ||
          `Factorio blueprint: ${blueprint.title}. Created by ${blueprint.user_handle}`
        }
      />
      <meta
        property="og:title"
        content={`${blueprint.title} - Factorio Blueprint`}
      />
      <meta
        property="og:description"
        content={
          blueprint.description ||
          `Factorio blueprint created by ${blueprint.user_handle}`
        }
      />
      <meta property="og:image" content={blueprint.image_url || ''} />
      <meta property="og:type" content="article" />
      {blueprint.user_handle && (
        <meta name="author" content={blueprint.user_handle} />
      )}
      <meta
        name="keywords"
        content={`factorio,blueprint${blueprint.tags?.length ? ',' + blueprint.tags.map(tag => (tag as { name: string }).name).join(',') : ''}`}
      />
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </ReactHelmet>
  );
};