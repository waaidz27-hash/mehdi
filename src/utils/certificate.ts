const TEMPLATE_PATH = '/assets/certificates/certificate_template.png';
const GOLD_COLOR = '#C9A227';

function loadImageFromSrc(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function downloadCertificate(subjectTitle: string, userName: string, subjectId: string) {
  const img = await loadImageFromSrc(TEMPLATE_PATH);
  if (!img) {
    alert(
      'تعذّر تحميل قالب الشهادة. يرجى التأكد من وجود ملف certificate_template.png في مجلد الشهادات.',
    );
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.drawImage(img, 0, 0);

  const w = canvas.width;
  const h = canvas.height;

  ctx.direction = 'rtl';
  ctx.textAlign = 'center';

  // Student name — on the underline below "تمنح أكاديمية المعرفة هذه الشهادة بكل فخر إلى"
  const nameFontSize = Math.round(h * 0.055);
  ctx.font = `bold ${nameFontSize}px 'Amiri', 'Tahoma', 'Arial'`;
  ctx.fillStyle = GOLD_COLOR;
  ctx.fillText(userName, w / 2, h * 0.50);

  // Subject name — on the blank line after "واجتهاده المثمر في"
  const moduleFontSize = Math.round(h * 0.046);
  ctx.font = `bold ${moduleFontSize}px 'Amiri', 'Tahoma', 'Arial'`;
  ctx.fillStyle = GOLD_COLOR;
  ctx.fillText(subjectTitle, w / 2, h * 0.65);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${subjectId}_certificate.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 'image/png');
}
