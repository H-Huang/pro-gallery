import { GALLERY_CONSTS } from "pro-gallery-lib";

export const createScrollAnimations = ({
  createScrollSelectors,
  itemId,
  item,
  options,
  containerSize,
  scrollAnimation,
  isHorizontalScroll,
}) => {
  const { isRTL, oneColorAnimationColor, scrollAnimationIntensity, scrollAnimationDistance } = options;

  const {
    NO_EFFECT,
    FADE_IN,
    GRAYSCALE,
    SHADOW,
    BLUR,
    ONE_COLOR,
    MAIN_COLOR,
    EXPAND,
    SHRINK,
    ROUND,
    ZOOM_IN,
    ZOOM_OUT,
    SKEW_UP,
    SKEW_DOWN,
    SKEW_RIGHT,
    SKEW_LEFT,
    SPIRAL_RIGHT,
    SPIRAL_LEFT,
    ROTATE_RIGHT,
    ROTATE_LEFT,
    HINGE_RIGHT,
    HINGE_LEFT,
    FLIP_UP,
    FLIP_DOWN,
    FLIP_LEFT,
    FLIP_RIGHT,
    SQUEEZE_UP,
    SQUEEZE_DOWN,
    SQUEEZE_LEFT,
    SQUEEZE_RIGHT,
    SLIDE_UP,
    SLIDE_DOWN,
    SLIDE_LEFT,
    SLIDE_RIGHT,
    APPEAR_UP,
    APPEAR_DOWN,
    APPEAR_LEFT,
    APPEAR_RIGHT,
    PAN_LEFT,
    PAN_RIGHT,
    PAN_UP,
    PAN_DOWN,
  } = GALLERY_CONSTS.scrollAnimations;

  const i = scrollAnimationIntensity || 25;
  const h = isHorizontalScroll;
  const d = Math.round((scrollAnimationDistance / 100) * (containerSize + item[h ? "width" : "height"]));
  const s = scrollAnimation;

  let scrollSelectorsCss = "";
  let animationBySuffix = {};

  const addScrollSelectors = ({ selectorSuffix, animationCss }, generalStyles = "") => {
    scrollSelectorsCss += generalStyles + ` \n`;
    animationBySuffix[selectorSuffix] = [...(animationBySuffix[selectorSuffix] || []), animationCss];
  };

  const mergeSelectorsCss = () => {
    for (let [selectorSuffix, animationCss] of Object.entries(animationBySuffix)) {
      scrollSelectorsCss += createScrollSelectors({
        fromPosition: 0,
        toPosition: d,
        selectorSuffix,
        animationCss: (step, isExit) => {
          const cssObject = {};
          for (let cssCreationFunction of animationCss) {
            const animationCssObject = cssCreationFunction(step, isExit);
            for (let cssProp of Object.keys(animationCssObject)) {
              if (cssObject[cssProp]) {
                cssObject[cssProp] = cssObject[cssProp] + " " + animationCssObject[cssProp];
              } else {
                cssObject[cssProp] = animationCssObject[cssProp];
              }
            }
          }
          return cssObject;
        },
      });
    }
    return scrollSelectorsCss;
  };

  const valueInRange = (step, from, to, roundTo, ease = false) => {
    //TODO - use easing
    const _step = ease ? Math.pow(step, 3) : step;
    const val = _step * (to - from) + from;
    if (roundTo < 1) {
      const roundedRoundTo = Math.round(1 / roundTo); //stupid javascript
      return Math.round(val * roundedRoundTo) / roundedRoundTo;
    } else {
      return Math.round(val * roundTo) / roundTo;
    }
  };

  if (s.includes(FADE_IN)) {
    const fromVal = Math.round(50 - i / 2) / 100; // 0.5 - 0
    const toVal = 1;
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-wrapper`,
      animationCss: (step, isExit) => ({
        opacity: valueInRange(step, fromVal, toVal, 0.01),
      }),
    });
  }
  if (s.includes(GRAYSCALE)) {
    const fromVal = Math.round(50 + i / 2); // 50-100
    const toVal = 0;
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-content`,
      animationCss: (step, isExit) => ({
        filter: `grayscale(${valueInRange(step, fromVal, toVal, 1)}%)`,
      }),
    });
  }
  if (s.includes(SHADOW)) {
    //TODO check why animation doesn't start on time
    const fromVal = Math.round(15 + i / 6); // 15-31
    const toVal = 0;
    addScrollSelectors({
      selectorSuffix: `#${itemId}`,
      animationCss: (step, isExit) => {
        const size = valueInRange(step, fromVal, toVal, 1);
        return {
          filter: `drop-shadow(0 0 ${size}px rgba(0,0,0,${0.3 + i / 250}));`,
        };
      },
    });
  }
  if (s.includes(EXPAND)) {
    const fromVal = Math.round(95 - i / 4) / 100; // 0.95-0.7
    const toVal = 1;
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-wrapper`,
      animationCss: (step, isExit) => ({
        transform: `scale(${valueInRange(step, fromVal, toVal, 0.01)})`,
      }),
    });
  }
  if (s.includes(SHRINK)) {
    const fromVal = Math.round(102 + i / 12) / 100; // 1.02-1.10
    const toVal = 1;
    addScrollSelectors({
      selectorSuffix: `#${itemId}`,
      animationCss: (step, isExit) => ({
        transform: `scale(${valueInRange(step, fromVal, toVal, 0.01)})`,
      }),
    });
  }
  if (s.includes(ZOOM_OUT)) {
    const fromVal = Math.round(110 + i / 4) / 100; // 1.1-1.35
    const toVal = 1;
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-content`,
      animationCss: (step, isExit) => ({
        transform: `scale(${valueInRange(step, fromVal, toVal, 0.01)})`,
      }),
    });
  }
  if (s.includes(ZOOM_IN)) {
    const fromVal = 1;
    const toVal = Math.round(110 + i / 4) / 100; // 1.1-1.35
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-content`,
      animationCss: (step, isExit) => ({
        transform: `scale(${valueInRange(step, fromVal, toVal, 0.01)})`,
      }),
    });
  }
  if (s.includes(BLUR)) {
    const fromVal = Math.round(10 + (i * 9) / 10); // 10-100;
    const toVal = 0;
    const scaleByBlur = (blur) => {
      const size = Math.min(item.width, item.height);
      return (size + blur * 2) / size;
    };
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-content`,
      animationCss: (step, isExit) => {
        const blur = valueInRange(step, fromVal, toVal, 1);
        return {
          transform: `scale(${scaleByBlur(blur)})`,
          filter: `blur(${blur}px)`,
        };
      },
    });
  }
  if ([ROTATE_LEFT, ROTATE_RIGHT].some((r) => s.includes(r))) {
    //TODO - add scale so that the image will fit in the container
    const direction = s.includes(ROTATE_LEFT) ? 1 : -1;
    const fromVal = direction * Math.round(2 + i / 8); // 2-14
    const toVal = 0;
    addScrollSelectors({
      selectorSuffix: `#${itemId}`,
      animationCss: (step, isExit) => ({
        transform: `rotate(${valueInRange(step, fromVal, toVal, 1)}deg)`,
        "transform-origin": "center",
      }),
    });
  }
  if ([HINGE_LEFT, HINGE_RIGHT].some((r) => s.includes(r))) {
    const origin = s.includes(HINGE_LEFT) ? "top left" : "top right";
    const direction = s.includes(HINGE_LEFT) ? 1 : -1;
    const fromVal = direction * Math.round(2 + i / 8); // 2-14
    const toVal = 0;
    addScrollSelectors({
      selectorSuffix: `#${itemId}`,
      animationCss: (step, isExit) => ({
        transform: `rotate(${(isExit ? -1 : 1) * valueInRange(step, fromVal, toVal, 1)}deg)`,
        "transform-origin": origin,
      }),
    });
  }
  if (s.includes(ROUND)) {
    const from = Math.round(i / 1.2);
    const to = 0;
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-wrapper`,
      animationCss: (step, isExit) => ({
        "border-radius": `${valueInRange(step, from, to, 1)}%`,
      }),
    });
  }

  if ([SQUEEZE_DOWN, SQUEEZE_UP, SQUEEZE_LEFT, SQUEEZE_RIGHT].some((r) => s.includes(r))) {
    const rtlFix = h && isRTL ? -1 : 1;
    const directionFix = [SQUEEZE_UP, SQUEEZE_LEFT].some((r) => s.includes(r)) ? 1 : -1;
    const prop = [SQUEEZE_LEFT, SQUEEZE_RIGHT].some((r) => s.includes(r)) ? "X" : "Y";
    const origin = s.includes(SQUEEZE_DOWN)
      ? "bottom"
      : s.includes(SQUEEZE_UP)
      ? "top"
      : s.includes(SQUEEZE_RIGHT)
      ? "right"
      : "left";
    const fromVal = 1 - i / 100; // .8-0
    const toVal = 1;

    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationCss: (step, isExit) => ({
          transform: `scale${prop}(${valueInRange(step, fromVal, toVal, 0.01)})`,
          "transform-origin": origin,
          "object-fit": "fill",
        }),
      },
      ` #${itemId} {overflow: visible !important;}`
    );
  }

  if ([FLIP_DOWN, FLIP_UP, FLIP_LEFT, FLIP_RIGHT].some((r) => s.includes(r))) {
    const xAxis = [FLIP_RIGHT, FLIP_LEFT].some((r) => s.includes(r)) ? 0 : s.includes(FLIP_UP) ? -1 : 1;
    const yAxis = [FLIP_UP, FLIP_DOWN].some((r) => s.includes(r)) ? 0 : s.includes(FLIP_RIGHT) ? -1 : 1;
    const origin = s.includes(FLIP_DOWN)
      ? "bottom"
      : s.includes(FLIP_UP)
      ? "top"
      : s.includes(FLIP_RIGHT)
      ? "right"
      : "left";
    const fromVal = 10 + (i * 8) / 10; // 0-90
    const toVal = 0;
    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-wrapper`,
        animationCss: (step, isExit) => ({
          transform: `rotate3d(${xAxis}, ${yAxis}, 0, ${valueInRange(step, fromVal, toVal, 1)}deg)`,
          "transform-origin": origin,
        }),
      },
      `#${itemId}>div {perspective: 1000px;}`
    );
  }

  if (s.includes(ONE_COLOR)) {
    const bgColor = oneColorAnimationColor?.value || oneColorAnimationColor || "transparent";
    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationCss: (step, isExit) => ({
          opacity: valueInRange(step, 0.5 - i / 50, 1, 0.01),
        }),
      },
      ` #${itemId} .gallery-item-wrapper {background-color: ${bgColor} !important;}`
    );
  }
  if (s.includes(MAIN_COLOR)) {
    const pixel = item.createUrl("pixel", "img");
    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationCss: (step, isExit) => ({
          opacity: valueInRange(step, 0.5 - i / 50, 1, 0.01),
        }),
      },
      ` #${itemId} .gallery-item-wrapper {background-image: url(${pixel}) !important;}`
    );
  }
  if ([SLIDE_DOWN, SLIDE_UP, SLIDE_LEFT, SLIDE_RIGHT].some((r) => s.includes(r))) {
    const rtlFix = h && isRTL ? -1 : 1;
    const directionFix = [SLIDE_UP, SLIDE_LEFT].some((r) => s.includes(r)) ? 1 : -1;
    const prop = [SLIDE_LEFT, SLIDE_RIGHT].some((r) => s.includes(r)) ? "X" : "Y";
    const slideGap = i * 2; // 0-200
    const fromVal = slideGap * rtlFix * directionFix;
    const toVal = 0;

    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-wrapper`,
        animationCss: (step, isExit) => ({
          transform: `translate${prop}(${valueInRange(step, fromVal * (isExit ? -1 : 1), toVal, 1)}px)`,
        }),
      },
      ` #${itemId} {overflow: visible !important;}`
    );
  }

  if ([APPEAR_DOWN, APPEAR_UP, APPEAR_LEFT, APPEAR_RIGHT].some((r) => s.includes(r))) {
    const rtlFix = h && isRTL ? -1 : 1;
    const directionFix = [APPEAR_UP, APPEAR_LEFT].some((r) => s.includes(r)) ? 1 : -1;
    const prop = [APPEAR_LEFT, APPEAR_RIGHT].some((r) => s.includes(r)) ? "X" : "Y";
    const appearFrom = 50 + i / 2; // 0-200
    const fromVal = appearFrom * rtlFix * directionFix;
    const toVal = 0;

    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationCss: (step, isExit) => ({
          transform: `translate${prop}(${valueInRange(step, fromVal * (isExit ? -1 : 1), toVal, 1, false)}px)`,
        }),
      },
      ` #${itemId} {overflow: visible !important;}`
    );
  }

  if ([PAN_LEFT, PAN_RIGHT, PAN_UP, PAN_DOWN].some((r) => s.includes(r))) {
    //TODO = the image should not exit the frame
    const scale = 1.1 + i / 200; //1.1 - 2.1
    const pan = Math.round(((scale - 1) / 2) * 100);
    const selectorSuffix = `#${itemId} .gallery-item-content`;
    const prop = [PAN_LEFT, PAN_RIGHT].some((r) => s.includes(r)) ? "X" : "Y";
    const fromVal = (([PAN_LEFT, PAN_UP].some((r) => s.includes(r)) ? 1 : -1) * pan) / 2;
    const toVal = (([PAN_LEFT, PAN_UP].some((r) => s.includes(r)) ? -1 : 1) * pan) / 2;

    addScrollSelectors({
      selectorSuffix,
      animationCss: (step, isExit) => ({
        transform: `scale(${valueInRange(0, scale, scale, 0.01)}) translate${prop}(${valueInRange(
          step,
          fromVal,
          toVal,
          0.1,
          false
        )}%)`,
      }),
    });
  }

  if ([SPIRAL_LEFT, SPIRAL_RIGHT].some((r) => s.includes(r))) {
    const direction = s.includes(SPIRAL_LEFT) ? 1 : -1;
    const fromVal = direction * (5 + Math.round(i / 8)); // 5 - 30
    const scaleByDeg = (deg) => {
      const rad = (Math.abs(deg) * 2 * Math.PI) / 360;
      return Math.sin(rad) + Math.cos(rad);
    };
    const toVal = 0;
    const selectorSuffix = `#${itemId} .gallery-item-content`;

    addScrollSelectors({
      selectorSuffix,
      animationCss: (step, isExit) => {
        const deg = valueInRange(step, fromVal, toVal, 1);
        return {
          transform: `scale(${scaleByDeg(deg)}) rotate(${deg}deg)`,
          "transform-origin": "center",
        };
      },
    });
  }

  if ([SKEW_LEFT, SKEW_RIGHT, SKEW_UP, SKEW_DOWN].some((r) => s.includes(r))) {
    const direction = s.includes(SKEW_LEFT, SKEW_UP) ? 1 : -1;
    const fromVal = direction * (5 + Math.round(i / 20)); // 5 - 30
    const scaleByDeg = (deg) => {
      const rad = (Math.abs(deg) * 2 * Math.PI) / 360;
      return Math.sin(rad) + Math.cos(rad);
    };
    const toVal = 0;
    const selectorSuffix = `#${itemId} .gallery-item-content`;
    const skewX = (deg) => (s.includes(SKEW_LEFT, SKEW_RIGHT) ? deg : 0);
    const skewY = (deg) => (s.includes(SKEW_LEFT, SKEW_RIGHT) ? 0 : deg);

    addScrollSelectors({
      selectorSuffix,
      animationCss: (step, isExit) => {
        const deg = valueInRange(step, fromVal, toVal, 1);
        return {
          transform: `scale(${scaleByDeg(Math.abs(deg))}) skew(${skewY(deg)}deg, ${skewX(deg)}deg)`,
          "transform-origin": "center",
        };
      },
    });
  }

  return mergeSelectorsCss();
};