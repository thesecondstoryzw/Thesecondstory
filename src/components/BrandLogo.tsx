interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export function BrandLogo({
  className = '',
  imageClassName = '',
  priority = false,
}: BrandLogoProps) {
  return (
    <img
      src="/models/Logo.png"
      alt="The Second Story"
      className={`block object-contain ${className} ${imageClassName}`}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
