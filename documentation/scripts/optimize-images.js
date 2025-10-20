const fs = require('node:fs').promises;
const path = require('node:path');
const util = require('node:util');
const styleText = util.styleText;

const dir = path.resolve('docs');

(async () => {
  const imagemin = (await import('imagemin')).default;
  const imageminPngquant = (await import('imagemin-pngquant')).default;
  const imageminMozjpeg = (await import('imagemin-mozjpeg')).default;

  try {
    await fs.access(dir);
  } catch {
    console.log(styleText('yellow', `⚠️  Directory ${dir} not found.`));
    return;
  }

  const files = ['docs/**/*.png', 'docs/**/*.jpg', 'docs/**/*.jpeg'];
  let optimized;

  try {
    optimized = await imagemin(files, {
      plugins: [
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
        imageminMozjpeg({ quality: 80 }),
      ],
    });
  } catch (error) {
    console.error(
      styleText('red', '❌ Error during image optimization:'),
      error,
    );
    return;
  }

  if (optimized.length === 0) {
    console.log(styleText('yellow', '⚠️  No images found to optimize.'));
    return;
  }

  console.log(
    styleText('green', `✅ Optimizing ${optimized.length} images...`),
  );

  await Promise.all(
    optimized.map(async (file) => {
      try {
        await fs.writeFile(file.sourcePath, file.data);
        console.log(styleText('green', `  ✔ Optimized: ${file.sourcePath}`));
      } catch (error) {
        console.error(
          styleText('red', `❌ Error writing file ${file.sourcePath}:`),
          error,
        );
      }
    }),
  );

  console.log(
    styleText('green', `\n✅ Optimized ${optimized.length} images total.`),
  );
})();
