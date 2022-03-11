import { useItemMotion } from '../logic/animation';
import { createImageSource, useImageState } from '../logic/image';
import { useDistanceToViewport, useInViewport } from '../logic/viewport';
import { ItemProps } from '../types/item';

export function useItem(props: ItemProps) {
  const { item, location, galleryStructure, container, styling } = props;
  const distanceToViewport = useDistanceToViewport({
    location,
    galleryStructure,
    container,
  });
  const isInViewport = useInViewport(distanceToViewport);
  const { backgroundLoadStep, imageLoadStep, isLazy } =
    useImageState(distanceToViewport);
  const backgroundImageSrc =
    backgroundLoadStep && createImageSource(item, backgroundLoadStep);
  const imageSrc = createImageSource(item, imageLoadStep);

  const { contentMotion, containerMotion } = useItemMotion({
    styling,
    distanceToViewport,
  });
  return {
    isInViewport,
    contentMotion,
    containerMotion,
    image: {
      src: imageSrc,
      backgroundSrc: backgroundImageSrc,
      isLazy,
    },
  };
}