const ready = () => {
  const rootStyles = window.getComputedStyle(document.documentElement);
  const coverWidth = parseFloat(rootStyles.getPropertyValue("--book-cover-width-large"));
  const coverAspectRatio = parseFloat(rootStyles.getPropertyValue("--book-cover-aspect-ratio"));
  const coverHeight = coverWidth / coverAspectRatio;

  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
  );

  FilePond.setOptions({
    stylePanelAspectRatio: 1 / coverAspectRatio,
    imageResizeTargetWidth: coverWidth,
    imageResizeTargetHeight: coverHeight,
  });

  FilePond.parse(document.body);
};

const checkStylesLoaded = () => {
  const rootStyles = window.getComputedStyle(document.documentElement);
  const largeWidth = rootStyles.getPropertyValue("--book-cover-width-large");
  if (largeWidth && largeWidth.trim() !== '') {
    ready();
  } else {
    document.getElementById("main-css").addEventListener("load", ready);
  }
};

checkStylesLoaded();
