import { useLayoutEffect, useState } from "react";

const moduleConfig: any = {
  wasmBinaryFile: "opencv_js.wasm",
  usingWasm: true,
};

const useOpencv = () => {
  const [cv, setCv] = useState<any>();

  useLayoutEffect(() => {
    if (window.Module || cv) {
      return;
    }

    moduleConfig.onRuntimeInitialized = () => {
      setCv(window.Module);
    };

    window.Module = moduleConfig;
    const script = document.createElement("script");
    script.id = "opencv";
    script.src = "./opencv.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, [cv]);

  return { cv };
};

export default useOpencv;
