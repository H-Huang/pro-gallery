/* eslint-disable prettier/prettier */
/* eslint-disable no-redeclare */
/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */
import utils from '../../common/utils';
import { window } from 'pro-gallery-lib';
import { GALLERY_CONSTS } from 'pro-gallery-lib';
import { createScrollAnimations } from './cssAnimationsHelper';

const isHorizontalScroll = (options) =>
  options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL;

class CssScrollHelper {
  constructor() {
    this.galleryId = '???';
    this.pgScrollSteps = [];
    for (let i = 1; i < 50000; i *= 2) {
      this.pgScrollSteps.push(i);
    }
    this.pgScrollSteps.reverse();
    this.pgScrollClassName = 'pgscl';

    this.scrollCss = [];
    this.scrollCssProps = [];

    try {
      this.settings = JSON.parse(localStorage.gallerySettings);
    } catch (e) {
      this.settings = {};
    }
  }

  getSellectorDomId({ id, idx }) {
    const shortId = String(id).replace(/[\W]+/g, '');
    return `pgi${shortId}_${idx}`;
  }

  buildScrollClassName(idx, val, itemId) {
    const shortId = String(this.galleryId).replace(/[\W]+/g, '').slice(-8);
    return `${this.pgScrollClassName}_${shortId}_${val}-${
      this.pgScrollSteps[idx] + Number(val)
    }`;
  }

  calcScrollClasses(scrollTop, itemId) {
    //used by the scroll indicator
    return (
      `${this.pgScrollClassName}-${scrollTop} ` +
      this.pgScrollSteps
        .map((step, idx) =>
          this.buildScrollClassName(
            idx,
            Math.floor(scrollTop / step) * step,
            itemId
          )
        )
        .join(' ')
    );
  }

  createScrollSelectorsFunction({ itemId, item, container, options }) {
    const imageStart = Math.round(
      isHorizontalScroll(options) ? item.offset.left : item.offset.top
    );
    const imageSize = Math.round(
      isHorizontalScroll(options) ? item.width : item.height
    );

    const containerSize = isHorizontalScroll(options)
      ? Math.min(container.width, window.innerWidth)
      : Math.min(container.height, window.innerHeight) + container.scrollBase;

    return ({
      fromPosition,
      toPosition,
      fromValue,
      toValue,
      selectorSuffix,
      animationCss,
      reverseOnExit,
      noEasing,
      iterations = 10,
    }) => {
      // fromPosition:  the distance from the bottom of the screen to start the animation
      // toPosition:  the distance from the bottom of the screen to end the animation
      // fromValue: the animation start value
      // toValue: the animation end value

      const exitFix = reverseOnExit ? -1 : 1;
      const [enterFrom, enterTo] = [fromValue, toValue];
      const [exitFrom, exitTo] = [toValue, fromValue * exitFix];

      const createAnimationStep = (idx, isExit) => {
        const [to, from] = isExit ? [exitFrom, exitTo] : [enterTo, enterFrom];
        if (isExit) {
          idx = iterations - idx;
        }
        const ease = (t) =>
          noEasing ? t : t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
        let stepWithEase = (to - from) * ease(idx / iterations) + from;
        let step = (to - from) * (idx / iterations) + from;
        return animationCss.replace('#', step);
      };

      const createSelectorsRange = (fromPosition, toPosition) => {
        if (toPosition < 0) return [];
        fromPosition = Math.max(0, fromPosition);
        let scrollClasses = [];
        toPosition = Math.round(toPosition);
        fromPosition = Math.round(fromPosition);
        while (fromPosition < toPosition) {
          const largestDividerIdx = this.pgScrollSteps.findIndex(
            (step) =>
              fromPosition % step === 0 && fromPosition + step <= toPosition
          ); //eslint-disable-line
          scrollClasses.push(
            `.${this.buildScrollClassName(
              largestDividerIdx,
              fromPosition,
              itemId
            )} ~ div ${selectorSuffix}`
          );
          fromPosition += this.pgScrollSteps[largestDividerIdx];
        }
        return scrollClasses;
      };

      const createAnimationRange = (fromPosition, toPosition, isExit) => {
        if (toPosition < 0 || toPosition <= fromPosition) {
          return {};
        }
        return Array.from({ length: iterations })
          .map(
            (i, idx) =>
              fromPosition + (idx * (toPosition - fromPosition)) / iterations
          )
          .map((i, idx) => ({
            [createAnimationStep(idx, isExit)]: createSelectorsRange(
              i,
              i + (toPosition - fromPosition) / iterations
            ),
          }))
          .reduce((obj, item) => ({ ...obj, ...item }), {});
      };

      const createScrollClasses = () => {
        const transitionDuration = 400;
        const animationPadding = 1000;

        const transitionCss = `transition: ${
          animationCss.split(':')[0]
        } ${transitionDuration}ms ease !important`;

        const animationDuration = Math.round(toPosition - fromPosition);

        const entryAnimationStart = Math.round(
          imageStart - containerSize + fromPosition
        );
        const entryAnimationEnd = Math.round(
          entryAnimationStart + animationDuration
        );

        const exitAnimationStart = Math.round(
          imageStart + imageSize - toPosition
        );
        const exitAnimationEnd = Math.round(
          exitAnimationStart + animationDuration
        );

        const scrollClasses = {};

        const addScrollClass = (key, val) => {
          scrollClasses[key] = [...(scrollClasses[key] || []), ...val];
        };

        const addScrollClasses = (classesObj) => {
          for (let [key, val] of Object.entries(classesObj)) {
            addScrollClass(key, val);
          }
        };

        //first batch: animation start value until the range start:
        addScrollClass(
          `${transitionCss}; ${animationCss.replace('#', enterTo)}`,
          [selectorSuffix]
        );

        if (options.scrollAnimationDirection === 'BOTH') {
          addScrollClass(
            createAnimationStep(0) + 'transtion: none !important;',
            createSelectorsRange(
              entryAnimationStart - animationPadding,
              entryAnimationStart
            )
          );
          addScrollClasses(
            createAnimationRange(entryAnimationStart, entryAnimationEnd)
          );
          addScrollClass(
            createAnimationStep(iterations),
            createSelectorsRange(entryAnimationEnd, exitAnimationStart)
          );
          addScrollClasses(
            createAnimationRange(exitAnimationStart, exitAnimationEnd, true)
          );
          addScrollClass(
            createAnimationStep(iterations, true) +
              'transtion: none !important;',
            createSelectorsRange(
              exitAnimationEnd,
              exitAnimationEnd + animationPadding
            )
          );
        } else if (options.scrollAnimationDirection === 'IN') {
          addScrollClass(
            createAnimationStep(0) + 'transtion: none !important;',
            createSelectorsRange(
              entryAnimationStart - animationPadding,
              entryAnimationStart
            )
          );
          addScrollClasses(
            createAnimationRange(entryAnimationStart, entryAnimationEnd)
          );
          addScrollClass(
            createAnimationStep(iterations) + 'transtion: none !important;',
            createSelectorsRange(
              entryAnimationEnd,
              entryAnimationEnd + animationPadding
            )
          );
        } else if (options.scrollAnimationDirection === 'OUT') {
          addScrollClass(
            createAnimationStep(iterations) + 'transtion: none !important;',
            createSelectorsRange(
              exitAnimationStart - animationPadding,
              exitAnimationStart
            )
          );
          addScrollClasses(
            createAnimationRange(exitAnimationStart, exitAnimationEnd, true)
          );
          addScrollClass(
            createAnimationStep(iterations, true) +
              'transtion: none !important;',
            createSelectorsRange(
              exitAnimationEnd,
              exitAnimationEnd + animationPadding
            )
          );
        }

        const fullCss = Object.entries(scrollClasses)
          .map(([css, selectors]) => `${selectors.join(', ')} {${css}}`)
          .join(' ');

        return fullCss;
      };

      return createScrollClasses();
    };
  }

  createScrollAnimationsIfNeeded({ idx, item, container, options }) {
    const { isRTL, scrollAnimation, oneColorAnimationColor } = options;

    if (
      !scrollAnimation ||
      scrollAnimation === GALLERY_CONSTS.scrollAnimations.NO_EFFECT
    ) {
      return '';
    }

    const itemId = this.getSellectorDomId(item);
    const createScrollSelectors = this.createScrollSelectorsFunction({
      itemId,
      item,
      container,
      options,
    });

    return createScrollAnimations({
      createScrollSelectors,
      itemId,
      item,
      options,
      isHorizontalScroll: isHorizontalScroll(options),
    });
  }

  calcScrollCssForItem({ item, container, options }) {
    const { idx } = item;
    let scrollCss = '';
    scrollCss += this.createScrollAnimationsIfNeeded({
      idx,
      item,
      container,
      options,
    });

    this.scrollCss[idx] = scrollCss || this.scrollCss[idx];

    return this.scrollCss[idx];
  }

  calcScrollCss({ galleryId, items, container, options }) {
    this.galleryId = galleryId;
    const scrollAnimation = options.scrollAnimation;
    if (!(items && items.length)) {
      return [];
    }
    if (
      !scrollAnimation ||
      scrollAnimation === GALLERY_CONSTS.scrollAnimations.NO_EFFECT
    ) {
      return [];
    }

    const res = items.map((item) =>
      this.calcScrollCssForItem({ item, container, options })
    );
    return res;
  }
}

export const cssScrollHelper = new CssScrollHelper();
