function getGcd(w: number, h: number): number {
  return h === 0 ? w : getGcd(h, w % h);
}

export function clearCanvas(...args: (HTMLCanvasElement | null)[]): void {
  args.forEach((canvas) => {
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      ctx?.beginPath();
    }
  });
}

export function setImagetoCanvas(
  canvas: HTMLCanvasElement | null,
  url: string,
  template?: boolean,
): Promise<Screenshot> {
  return new Promise((resolve, reject) => {
    try {
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) throw new Error();
      const img = new Image();
      img.src = url;
      img.onload = () => {
        let { width, height } = img;
        const gcd = getGcd(width, height);
        const aspectRatio = { width: width / gcd, height: height / gcd };
        ctx.save();
        if (template) {
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          // 16 : 9 = 160, 21 : 9 = 40
        } else if (gcd === 40) {
          canvas.width = 2560;
          canvas.height = 1080;
          ctx.drawImage(img, 0, 0, 2560, 1080);
        } else {
          canvas.width = 2560;
          canvas.height = 1440;
          ctx.drawImage(img, 0, 0, 2560, 1440);
        }
        ctx.restore();
        resolve({ width, height, createdTime: new Date(), aspectRatio, gcd });
      };
    } catch (error) {
      reject(error);
    }
  });
}
