import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('layoutParams_info_width - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('should set layoutParams_info_width(manual)', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.info.sizeUnits]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.sizeUnits].PIXEL,
      [optionsMap.layoutParams.info.width]: 150,
      [optionsMap.layoutParams.info.placement]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.placement].RIGHT,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should set layoutParams_info_width(percent)', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.info.sizeUnits]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.sizeUnits].PERCENT,
      [optionsMap.layoutParams.info.width]: 30,
      [optionsMap.layoutParams.info.placement]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.placement].RIGHT,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
});
