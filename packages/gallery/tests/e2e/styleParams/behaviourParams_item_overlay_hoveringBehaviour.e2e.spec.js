import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('behaviourParams_item_overlay_hoveringBehaviour - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('should show hover container on hover event when "behaviourParams_item_overlay_hoveringBehaviour" is "APPEARS', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.item.overlay.hoveringBehaviour]:
        GALLERY_CONSTS[
          optionsMap.behaviourParams.item.overlay.hoveringBehaviour
        ].APPEARS,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.actions.hover('item-container')[0];
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should make hover state disapear on hover (reverse-hover) when "behaviourParams_item_overlay_hoveringBehaviour" is "DISAPPEARS', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.item.overlay.hoveringBehaviour]:
        GALLERY_CONSTS[
          optionsMap.behaviourParams.item.overlay.hoveringBehaviour
        ].DISAPPEARS,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.actions.hover('item-container')[0];
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should set all items in constant hover state when "behaviourParams_item_overlay_hoveringBehaviour" is "ALWAYS_SHOW"', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.item.overlay.hoveringBehaviour]:
        GALLERY_CONSTS[
          optionsMap.behaviourParams.item.overlay.hoveringBehaviour
        ].ALWAYS_SHOW,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.actions.hover('item-container')[0];
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
});
