export async function screenCapture(video: HTMLVideoElement): Promise<string> {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const { ipcRenderer } = window.require("electron");
        const { sources } = await ipcRenderer.invoke("screenshot");
        const source = sources.find((source: any) => source.name.includes("LOST ARK"));

        if (!source) {
          throw new Error("로스트아크 안켜져있음 수구");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: source.id,
              minWidth: 1920,
              maxWidth: 1920,
              minHeight: 1080,
              maxHeight: 1080,
            },
          } as any,
        });

        video.srcObject = stream;
        video.onloadedmetadata = function () {
          // Set video ORIGINAL height (screenshot)
          video.style.height = video.videoHeight + "px"; // videoHeight
          video.style.width = video.videoWidth + "px"; // videoWidth
          video.play();

          // Create canvas
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");

          if (!ctx) return;

          // Draw video on canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg"));

          // Remove hidden video tag
          video.remove();
          stream.getTracks()[0].stop();
        };
      } catch (error) {
        reject(error);
      }
    })();
  });
}
